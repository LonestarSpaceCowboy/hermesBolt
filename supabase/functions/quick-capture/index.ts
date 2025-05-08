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

    // Extract the token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Get request body
    const { text } = await req.json();
    
    if (!text) {
      return new Response(JSON.stringify({ error: 'Text input is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Process the text input with OpenAI
    const prompt = `
      Extract structured information from this input:
      
      "${text}"
      
      Return a JSON object with these fields:
      - type: "event" or "task" depending on whether this describes a scheduled event or a task
      - title: a clear, concise title 
      - description: additional details
      - category: "work" or "personal"
      - importance: "low", "medium", or "high"
      
      If it's an event, also include:
      - startTime: ISO datetime for when it starts (or null if unclear)
      - endTime: ISO datetime for when it ends (or null if unclear)
      - location: where it takes place (or null)
      - isRemote: boolean indicating if it's a remote/virtual meeting
      
      Use the current date as reference: ${new Date().toISOString().split('T')[0]}
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });
    
    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Create an incoming request based on the extracted data
    const { data: requestData, error: requestError } = await supabaseClient
      .from('incoming_requests')
      .insert({
        user_id: user.id,
        type: result.type,
        title: result.title,
        description: result.description,
        start_time: result.startTime,
        end_time: result.endTime,
        location: result.location,
        is_remote: result.isRemote,
        category: result.category,
        importance: result.importance,
      })
      .select()
      .single();
    
    if (requestError) {
      console.error('Error creating incoming request:', requestError);
      return new Response(JSON.stringify({ error: 'Failed to create request' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: {
        id: requestData.id,
        type: result.type,
        title: result.title,
        date: result.startTime ? new Date(result.startTime).toLocaleDateString() : null,
        time: result.startTime ? new Date(result.startTime).toLocaleTimeString() : null,
      } 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error('Error in quick-capture function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});