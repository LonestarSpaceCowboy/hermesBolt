import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Calendar, MessageSquareText, Clock, Zap, Shield, Gift, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Landing: React.FC = () => {
  const [heroText, setHeroText] = useState<string>(
    "Are missed emails costing you trust, opportunities, and peace of mind? Hermes instantly turns your emails into calendar appointments, ensuring you never miss another crucial moment."
  );

  const benefits = [
    'Never miss another commitment',
    'Save hours every week',
    'Reduce email anxiety',
    'Stay organized effortlessly'
  ];

  useEffect(() => {
    const fetchHeroText = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('hero_text')
          .single();
        
        if (error) throw error;
        if (data) setHeroText(data.hero_text);
      } catch (error) {
        console.error('Error fetching hero text:', error);
      }
    };

    fetchHeroText();
  }, []);

  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-primary-600" />,
      title: 'Smart Calendar Sync',
      description: 'Automatically create calendar events from email commitments with AI-powered date and time extraction.'
    },
    {
      icon: <MessageSquareText className="h-8 w-8 text-primary-600" />,
      title: 'Email Intelligence',
      description: 'Our AI analyzes your emails, filters out noise, and identifies actionable tasks and meetings.'
    },
    {
      icon: <Clock className="h-8 w-8 text-primary-600" />,
      title: 'Time-Saving',
      description: 'Save up to 5 hours per week by automating the manual process of creating calendar events from emails.'
    },
    {
      icon: <Zap className="h-8 w-8 text-primary-600" />,
      title: 'Quick Capture',
      description: 'Speak or type commitments on the go, and let Hermes handle the scheduling details.'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: 'Privacy First',
      description: 'Your data stays private. We use state-of-the-art encryption and never share your information.'
    },
    {
      icon: <Gift className="h-8 w-8 text-primary-600" />,
      title: 'Free Trial',
      description: 'Try all features free for 7 days. No credit card required until you\'re ready to commit.'
    }
  ];

  return (
    <div className="relative bg-white dark:bg-gray-900">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 -z-10" />
      
      {/* Hero section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl xl:text-6xl">
                  <span className="block">Hermes</span>
                  <span className="block text-primary-600 dark:text-primary-400 mt-2">
                    Inbox Today. Done Tomorrow.
                  </span>
                </h1>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
                  {heroText}
                </p>
                <div className="mt-8 space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary-500" />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <Link to="/signup" className="flex-none">
                    <Button variant="primary" size="lg" rightIcon={<ArrowRight />}>
                      Start Free Trial
                    </Button>
                  </Link>
                  <Link to="/features" className="flex-none">
                    <Button variant="outline" size="lg">
                      See Features
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-16 lg:mt-0 lg:col-span-5">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative">
                <div className="absolute -top-4 -right-4 bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  7 Days Free
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Get Started in Minutes
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Calendar className="h-5 w-5 text-primary-500 mr-3" />
                    <span>Connect your calendar</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <MessageSquareText className="h-5 w-5 text-primary-500 mr-3" />
                    <span>Link your email</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Zap className="h-5 w-5 text-primary-500 mr-3" />
                    <span>Watch the magic happen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 sm:py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Powerful Features for Busy Professionals
            </h2>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500 dark:text-gray-400">
              From email intelligence to calendar management, Hermes has you covered with a comprehensive suite of productivity tools.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 dark:bg-gray-800 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">{feature.title}</h3>
                      <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary-600 dark:bg-primary-900 transform skew-y-2" />
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="relative">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to take control of your inbox?
              </h2>
              <p className="mt-4 text-lg text-white/90">
                Join thousands of professionals who have already transformed their email workflow.
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                <Link to="/signup">
                  <Button variant="accent" size="lg" rightIcon={<ArrowRight />}>
                    Start Free Trial
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-white/75">
                No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;