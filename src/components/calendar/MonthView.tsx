import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameMonth, isToday } from 'date-fns';

interface MonthViewProps {
  date: Date;
}

// Sample data for demonstration
const sampleEvents = [
  {
    id: '1',
    title: 'Team meeting',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 10, 0),
    category: 'work',
    importance: 'high'
  },
  {
    id: '2',
    title: 'Doctor appointment',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 14, 30),
    category: 'personal',
    importance: 'medium'
  },
  {
    id: '3',
    title: 'Project deadline',
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 17, 0),
    category: 'work',
    importance: 'high'
  },
];

const MonthView: React.FC<MonthViewProps> = ({ date }) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = addDays(monthStart, -(monthStart.getDay() % 7));
  const daysArray = eachDayOfInterval({ start: startDate, end: addDays(monthEnd, (6 - monthEnd.getDay()) % 7) });

  // Group events by date for efficient lookup
  const eventsByDate: Record<string, typeof sampleEvents> = {};
  sampleEvents.forEach(event => {
    const dateStr = format(event.date, 'yyyy-MM-dd');
    if (!eventsByDate[dateStr]) {
      eventsByDate[dateStr] = [];
    }
    eventsByDate[dateStr].push(event);
  });

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

  return (
    <div className="overflow-hidden">
      {/* Days of the week */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <div key={i} className="py-2 text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {daysArray.map((day, dayIdx) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayEvents = eventsByDate[dateKey] || [];
          
          return (
            <div 
              key={dayIdx}
              className={`min-h-[120px] bg-white dark:bg-gray-800 p-2 ${
                !isSameMonth(day, date) 
                  ? 'text-gray-400 dark:text-gray-500' 
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              <div className={`text-right ${
                isToday(day) 
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full w-7 h-7 flex items-center justify-center ml-auto' 
                  : ''
              }`}>
                {format(day, 'd')}
              </div>
              
              <div className="mt-2 space-y-1 max-h-[88px] overflow-y-auto">
                {dayEvents.map((event, eventIdx) => (
                  <div 
                    key={eventIdx}
                    className={`px-2 py-1 text-xs rounded ${categoryColors[event.category] || categoryColors.default} ${importanceStyles[event.importance] || importanceStyles.default}`}
                  >
                    <div className="font-medium">{format(event.date, 'h:mm a')}</div>
                    <div className="truncate">{event.title}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;