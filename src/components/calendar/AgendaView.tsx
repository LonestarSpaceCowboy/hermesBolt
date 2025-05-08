import React from 'react';
import { format, isToday, isTomorrow, isYesterday, addDays, startOfToday } from 'date-fns';

interface AgendaViewProps {
  date: Date;
}

// Sample data for demonstration
const sampleEvents = [
  {
    id: '1',
    title: 'Team meeting',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 10, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 11, 0),
    category: 'work',
    importance: 'high',
    location: 'Conference Room A',
    description: 'Weekly team sync to discuss project progress and roadblocks.'
  },
  {
    id: '2',
    title: 'Doctor appointment',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 14, 30),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 15, 30),
    category: 'personal',
    importance: 'medium',
    location: 'City Medical Center',
    description: 'Annual health checkup.'
  },
  {
    id: '3',
    title: 'Project deadline',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 17, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 18, 0),
    category: 'work',
    importance: 'high',
    location: '',
    description: 'Final submission for the Q2 project.'
  },
  {
    id: '4',
    title: 'Coffee with Sarah',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 9, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 10, 0),
    category: 'personal',
    importance: 'low',
    location: 'Downtown Cafe',
    description: 'Catch up and discuss collaboration opportunities.'
  },
  {
    id: '5',
    title: 'Gym session',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 18, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 19, 30),
    category: 'personal',
    importance: 'medium',
    location: 'Fitness Center',
    description: 'Weekly training with personal trainer.'
  },
];

// Sort events by date and time
const sortedEvents = [...sampleEvents].sort((a, b) => a.start.getTime() - b.start.getTime());

// Group events by date
interface GroupedEvents {
  [key: string]: typeof sampleEvents;
}

const groupEventsByDate = (events: typeof sampleEvents): GroupedEvents => {
  return events.reduce((acc: GroupedEvents, event) => {
    const dateKey = format(event.start, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});
};

const AgendaView: React.FC<AgendaViewProps> = ({ date }) => {
  const [expandedEvent, setExpandedEvent] = React.useState<string | null>(null);
  
  // Get a range of 14 days from today
  const today = startOfToday();
  const dateRange = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  
  // Group events by date
  const groupedEvents = groupEventsByDate(sortedEvents);

  // Format the date heading
  const formatDateHeading = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM d');
  };

  // Category colors
  const categoryColors: Record<string, string> = {
    work: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
    personal: 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };

  // Importance indicators
  const importanceStyles: Record<string, string> = {
    high: 'border-l-4 border-error-500',
    medium: 'border-l-4 border-warning-500',
    low: 'border-l-4 border-success-500',
    default: ''
  };

  const toggleEventDetails = (eventId: string) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(eventId);
    }
  };

  return (
    <div className="overflow-y-auto max-h-[600px]">
      {dateRange.map((day) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayEvents = groupedEvents[dateKey] || [];
        
        if (dayEvents.length === 0) return null;
        
        return (
          <div key={dateKey} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sticky top-0 bg-white dark:bg-gray-800 py-2 z-10">
              {formatDateHeading(day)}
            </h3>
            
            <div className="space-y-3">
              {dayEvents.map((event) => (
                <div 
                  key={event.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden ${
                    importanceStyles[event.importance] || importanceStyles.default
                  } ${
                    expandedEvent === event.id ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <div 
                    className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => toggleEventDetails(event.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                        </div>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${categoryColors[event.category] || categoryColors.default}`}>
                        {event.category}
                      </div>
                    </div>
                  </div>
                  
                  {expandedEvent === event.id && (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                      {event.location && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Location:</span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">{event.location}</span>
                        </div>
                      )}
                      {event.description && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Description:</span>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{event.description}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AgendaView;