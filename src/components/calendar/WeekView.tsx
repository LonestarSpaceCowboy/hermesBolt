import React from 'react';
import { format, startOfWeek, addDays, eachHourOfInterval, startOfDay, addHours, isSameDay, isToday } from 'date-fns';

interface WeekViewProps {
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
    importance: 'high'
  },
  {
    id: '2',
    title: 'Doctor appointment',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 14, 30),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 15, 30),
    category: 'personal',
    importance: 'medium'
  },
  {
    id: '3',
    title: 'Project deadline',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 17, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 18, 0),
    category: 'work',
    importance: 'high'
  },
];

const WeekView: React.FC<WeekViewProps> = ({ date }) => {
  const startWeek = startOfWeek(date);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startWeek, i));
  
  // Show work week (Monday - Friday)
  const workWeekDays = weekDays.slice(1, 6);
  
  // Hours to display (9 AM to 6 PM)
  const dayStart = startOfDay(date);
  const dayStartWithHour = addHours(dayStart, 9); // Start at 9 AM
  const dayEndWithHour = addHours(dayStart, 18); // End at 6 PM
  const hours = eachHourOfInterval({ start: dayStartWithHour, end: dayEndWithHour });

  // Category colors
  const categoryColors: Record<string, string> = {
    work: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 border-primary-200 dark:border-primary-800',
    personal: 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200 border-accent-200 dark:border-accent-800',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600'
  };

  // Importance indicators
  const importanceStyles: Record<string, string> = {
    high: 'border-l-4 border-error-500',
    medium: 'border-l-4 border-warning-500',
    low: 'border-l-4 border-success-500',
    default: ''
  };

  // Position events based on their time
  const getEventPosition = (event: typeof sampleEvents[0], day: Date) => {
    if (!isSameDay(event.start, day)) return null;
    
    const startHour = event.start.getHours() + event.start.getMinutes() / 60;
    const endHour = event.end.getHours() + event.end.getMinutes() / 60;
    
    // Only show events during work hours
    if (startHour >= 18 || endHour <= 9) return null;
    
    const adjustedStart = Math.max(9, startHour); // Cap at 9 AM
    const adjustedEnd = Math.min(18, endHour); // Cap at 6 PM
    
    const top = ((adjustedStart - 9) / 9) * 100; // 9 hours total display
    const height = ((adjustedEnd - adjustedStart) / 9) * 100;
    
    return { top: `${top}%`, height: `${height}%` };
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header with day names */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <div className="w-16 flex-shrink-0"></div>
        {workWeekDays.map((day, i) => (
          <div 
            key={i} 
            className={`flex-1 text-center py-2 ${
              isToday(day) ? 'bg-primary-50 dark:bg-primary-900/20' : ''
            }`}
          >
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {format(day, 'EEE')}
            </div>
            <div className={`text-lg font-semibold ${
              isToday(day) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
            }`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex flex-1 overflow-y-auto">
        {/* Time markers */}
        <div className="w-16 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
          {hours.map((hour, i) => (
            <div key={i} className="h-20 border-t border-gray-200 dark:border-gray-700 relative">
              <span className="absolute -top-2 right-2 text-xs text-gray-500 dark:text-gray-400">
                {format(hour, 'h a')}
              </span>
            </div>
          ))}
        </div>

        {/* Days columns */}
        <div className="flex-1 flex">
          {workWeekDays.map((day, dayIdx) => (
            <div 
              key={dayIdx} 
              className={`flex-1 border-r border-gray-200 dark:border-gray-700 relative ${
                isToday(day) ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
              }`}
            >
              {/* Hour cells */}
              {hours.map((hour, hourIdx) => (
                <div 
                  key={hourIdx} 
                  className="h-20 border-t border-gray-200 dark:border-gray-700"
                ></div>
              ))}
              
              {/* Events */}
              {sampleEvents.map((event, eventIdx) => {
                const position = getEventPosition(event, day);
                if (!position) return null;
                
                return (
                  <div 
                    key={eventIdx}
                    className={`absolute left-0 right-0 mx-1 p-1 rounded-sm border ${
                      categoryColors[event.category] || categoryColors.default
                    } ${
                      importanceStyles[event.importance] || importanceStyles.default
                    }`}
                    style={{
                      top: position.top,
                      height: position.height,
                    }}
                  >
                    <div className="text-xs font-medium">
                      {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                    </div>
                    <div className="text-sm font-semibold truncate">{event.title}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;