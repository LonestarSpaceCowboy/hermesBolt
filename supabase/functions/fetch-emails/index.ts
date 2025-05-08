import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import OpenAI from 'npm:openai@4.28.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Initialize Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

// Mock function to demonstrate email fetching
async function fetchEmailsFromProvider(account: any) {
  // This would be replaced with actual API calls to email providers
  console.log(`Fetching emails for ${account.email} from ${account.provider}`);
  
  // Mock response with sample emails
  return [
    {
      external_id: `mock-${Date.now()}-1`,
      from: 'john@example.com',
      to: [account.email],
      subject: 'Team meeting tomorrow',
      body_text: 'Hi there, let\'s have a team meeting tomorrow at 2pm to discuss the project progress.',
      received_at: new Date().toISOString(),
    },
    {
      external_id: `mock-${Date.now()}-2`,
      from: 'sarah@example.com',
      to: [account.email],
      subject: 'Reminder: Submit report',
      body_text: 'Please remember to submit your quarterly report by Friday.',
      received_at: new Date().toISOString(),
    }
  ];
}

// Process an email with OpenAI to extract potential tasks or events
async function processEmailWithAI(email: any) {
  try {
    // First use a lightweight model to classify the email
    const classificationPrompt = `
      Analyze this email and determine if it contains a task, event, or neither:
      
      From: ${email.from}
      Subject: ${email.subject}
      Body: ${email.body_text}
      
      Output only one of these classifications: "task", "event", "neither"
    `;
    
    const classificationResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: classificationPrompt }],
      temperature: 0.3,
    });
    
    const classification = classificationResponse.choices[0].message.content?.trim().toLowerCase();
    
    if (classification === "neither") {
      console.log(`Email ${email.id} classified as neither task nor event`);
      return null;
    }
    
    // If it's a task or event, extract details
    const extractionPrompt = `
      Extract the following information from this email:
      
      From: ${email.from}
      Subject: ${email.subject}
      Body: ${email.body_text}
      
      Return a JSON object with these fields:
      - type: "${classification}"
      - title: a clear title for the ${classification}
      - description: a brief description
      - category: either "work" or "personal"
      - importance: "low", "medium", or "high"
      ${classification === "event" ? `
      - startTime: the start date and time (or null if not specified)
      - endTime: the end date and time (or null if not specified)
      - location: the location (or null if not specified)
      - isRemote: true/false if it's a remote meeting` : ''}
    `;
    
    const extractionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: extractionPrompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });
    
    const extractedData = JSON.parse(extractionResponse.choices[0].message.content || "{}");
    console.log("Extracted data:", extractedData);
    
    return {
      type: extractedData.type,
      title: extractedData.title,
      description: extractedData.description,
      category: extractedData.category,
      importance: extractedData.importance,
      start_time: extractedData.startTime,
      end_time: extractedData.endTime,
      location: extractedData.location,
      is_remote: extractedData.isRemote,
      email_source_id: email.id,
    };
  } catch (error) {
    console.error("Error processing email with AI:", error);
    return null;
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Check if request is authorized
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Get all email accounts from the database
    const { data: emailAccounts, error: accountsError } = await supabaseClient
      .from('email_accounts')
      .select('*');

    if (accountsError) {
      console.error('Error fetching email accounts:', accountsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch email accounts' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Process each email account
    const results = [];
    for (const account of emailAccounts) {
      // 1. Fetch new emails from the provider
      const emails = await fetchEmailsFromProvider(account);
      console.log(`Found ${emails.length} new emails for ${account.email}`);

      // 2. Store emails in Supabase
      for (const email of emails) {
        const { data: emailData, error: insertError } = await supabaseClient
          .from('emails')
          .insert({
            user_id: account.user_id,
            email_account_id: account.id,
            external_id: email.external_id,
            from: email.from,
            to: [email.to].flat(), // Ensure it's an array
            subject: email.subject,
            body_text: email.body_text,
            received_at: email.received_at,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting email:', insertError);
          continue;
        }

        // 3. Process email with AI to extract tasks/events
        const processedData = await processEmailWithAI(emailData);
        
        if (processedData) {
          // 4. Create incoming request for user to review
          const { error: requestError } = await supabaseClient
            .from('incoming_requests')
            .insert({
              user_id: account.user_id,
              type: processedData.type,
              title: processedData.title,
              description: processedData.description,
              start_time: processedData.start_time,
              end_time: processedData.end_time,
              location: processedData.location,
              is_remote: processedData.is_remote,
              category: processedData.category,
              importance: processedData.importance,
              email_source_id: processedData.email_source_id,
            });

          if (requestError) {
            console.error('Error creating incoming request:', requestError);
          } else {
            results.push({
              email_id: emailData.id,
              action: 'created_request',
              type: processedData.type,
            });
          }
        }

        // 5. Mark email as processed
        await supabaseClient
          .from('emails')
          .update({ processed: true })
          .eq('id', emailData.id);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Processed ${results.length} emails`,
      results 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error('Error in fetch-emails function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});