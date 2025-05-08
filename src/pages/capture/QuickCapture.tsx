import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, Send, Loader } from 'lucide-react';
import Button from '../../components/ui/Button';

const QuickCapture: React.FC = () => {
  const [inputMethod, setInputMethod] = useState<'type' | 'speak'>('type');
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<null | {
    title: string;
    date?: string;
    time?: string;
    type: 'event' | 'task';
  }>(null);
  
  // Mock speech recognition
  const timer = useRef<NodeJS.Timeout | null>(null);
  
  const startRecording = () => {
    setIsRecording(true);
    setText('');
    
    // Simulate recording with a timer
    timer.current = setTimeout(() => {
      setIsRecording(false);
      setText("Call Sarah about the project proposal tomorrow at 2pm");
      processInput("Call Sarah about the project proposal tomorrow at 2pm");
    }, 3000);
  };
  
  const stopRecording = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setIsRecording(false);
  };
  
  const processInput = async (input: string) => {
    setIsProcessing(true);
    
    // Simulate API call to OpenAI
    setTimeout(() => {
      setResult({
        title: "Call Sarah about the project proposal",
        date: "Tomorrow",
        time: "2:00 PM",
        type: "event"
      });
      setIsProcessing(false);
    }, 1500);
  };
  
  const handleSubmit = () => {
    if (!text) return;
    processInput(text);
  };
  
  const handleResultAction = (action: 'accept' | 'reject') => {
    if (action === 'accept') {
      // Simulate creating an event or task
      setTimeout(() => {
        setResult(null);
        setText('');
        alert('The item has been added to your schedule!');
      }, 500);
    } else {
      setResult(null);
    }
  };
  
  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Quick Capture
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create tasks or events quickly by typing or speaking
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`flex-1 py-4 text-center font-medium text-sm ${
                inputMethod === 'type'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setInputMethod('type')}
            >
              Type It
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium text-sm ${
                inputMethod === 'speak'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setInputMethod('speak')}
            >
              Speak It
            </button>
          </div>
          
          <div className="p-6">
            {/* Type interface */}
            {inputMethod === 'type' && (
              <div>
                <div className="mb-4">
                  <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type your commitment or task
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <textarea
                      id="text-input"
                      className="block w-full pr-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
                      placeholder="e.g., Meeting with John tomorrow at 3pm, or Buy groceries"
                      rows={3}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      disabled={isProcessing || !!result}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-start pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        leftIcon={<Send size={16} />}
                        onClick={handleSubmit}
                        disabled={!text || isProcessing || !!result}
                      >
                        Process
                      </Button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Include key details like date, time, and what you need to do
                  </p>
                </div>
              </div>
            )}
            
            {/* Speech interface */}
            {inputMethod === 'speak' && (
              <div className="text-center py-6">
                {!isRecording && !text && !isProcessing && !result ? (
                  <div>
                    <button
                      className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto focus:outline-none hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                      onClick={startRecording}
                    >
                      <Mic size={40} />
                    </button>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      Click the microphone to start speaking
                    </p>
                  </div>
                ) : isRecording ? (
                  <div>
                    <button
                      className="w-20 h-20 rounded-full bg-error-100 dark:bg-error-900 flex items-center justify-center text-error-600 dark:text-error-400 mx-auto focus:outline-none hover:bg-error-200 dark:hover:bg-error-800 transition-colors animate-pulse"
                      onClick={stopRecording}
                    >
                      <StopCircle size={40} />
                    </button>
                    <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                      Listening... Click to stop
                    </p>
                  </div>
                ) : (
                  <div className="text-left">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Recorded text
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                        <p className="text-gray-900 dark:text-white">{text}</p>
                      </div>
                    </div>
                    
                    {!isProcessing && !result && (
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setText('');
                            setResult(null);
                          }}
                        >
                          Clear
                        </Button>
                        <Button 
                          variant="primary" 
                          onClick={() => processInput(text)}
                        >
                          Process
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Processing indicator */}
            {isProcessing && (
              <div className="text-center py-6">
                <Loader size={40} className="animate-spin text-primary-500 mx-auto" />
                <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                  Analyzing your input...
                </p>
              </div>
            )}
            
            {/* Result display */}
            {result && (
              <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Here's what we found:
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Title:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{result.title}</span>
                  </div>
                  {result.date && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Date:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{result.date}</span>
                    </div>
                  )}
                  {result.time && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Time:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{result.time}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Type:</span>
                    <span className="text-sm text-gray-900 dark:text-white capitalize">{result.type}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => handleResultAction('reject')}
                  >
                    Reject
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => handleResultAction('accept')}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Tips for best results
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Include specific dates and times (e.g., "tomorrow at 3pm" or "next Tuesday")</li>
              <li>Mention location information when relevant (e.g., "at the office" or "Starbucks downtown")</li>
              <li>Be clear about whether it's a task or event (e.g., "meeting with" vs "remember to")</li>
              <li>For recurring events, specify frequency (e.g., "every Monday" or "weekly")</li>
              <li>Start with a verb for tasks (e.g., "Buy groceries" or "Call John")</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickCapture;