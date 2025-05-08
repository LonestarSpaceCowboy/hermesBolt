import React from 'react';
import { format, addHours, startOfDay, addDays } from 'date-fns';

interface TimelineViewProps {
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
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 14, 30),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 15, 30),
    category: 'personal',
    importance: 'medium'
  },
  {
    id: '3',
    title: 'Project deadline',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 17, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 18, 0),
    category: 'work',
    importance: 'high'
  },
  {
    id: '4',
    title: 'Dinner with family',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 19, 30),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 21, 0),
    category: 'personal',
    importance: 'high'
  },
];

// Sort events by start time
const sortedEvents = [...sampleEvents].sort((a, b) => a.start.getTime() - b.start.getTime());

const TimelineView: React.FC<TimelineViewProps> = ({ date }) => {
  const dayStart = startOfDay(date);
  const nextDay = addDays(dayStart, 1);
  
  // Hours in the day for the timeline (6 AM to 10 PM)
  const startHour = 6;
  const endHour = 22;
  const hoursInDay = endHour - startHour;
  
  // Category colors
  const categoryColors: Record<string, string> = {
    work: 'bg-primary-600',
    personal: 'bg-accent-500',
    default: 'bg-gray-500'
  };

  // Importance affects the size of the dot
  const importanceSizes: Record<string, string> = {
    high: 'w-6 h-6',
    medium: 'w-5 h-5',
    low: 'w-4 h-4',
    default: 'w-4 h-4'
  };

  // Calculate position on timeline
  const getEventPosition = (event: typeof sampleEvents[0]) => {
    const startTime = event.start.getHours() + event.start.getMinutes() / 60;
    const endTime = event.end.getHours() + event.end.getMinutes() / 60;
    
    // Only show events within our timeline range
    if (startTime > endHour || endTime < startHour) return null;
    
    const adjustedStart = Math.max(startHour, startTime);
    const adjustedEnd = Math.min(endHour, endTime);
    
    const left = ((adjustedStart - startHour) / hoursInDay) * 100;
    const width = ((adjustedEnd - adjustedStart) / hoursInDay) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  // Create hour markers
  const hourMarkers = [];
  for (let i = startHour; i <= endHour; i++) {
    const hour = addHours(dayStart, i);
    const position = ((i - startHour) / hoursInDay) * 100;
    
    hourMarkers.push({
      hour: format(hour, 'h a'),
      position: `${position}%`
    });
  }

  // Current time indicator
  const currentTime = new Date();
  const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;
  let currentTimePosition = null;
  
  if (currentHour >= startHour && currentHour <= endHour && 
      currentTime >= dayStart && currentTime < nextDay) {
    currentTimePosition = ((currentHour - startHour) / hoursInDay) * 100;
  }

  return (
    <div className="py-6">
      {/* Timeline track */}
      <div className="relative h-24 mb-10">
        {/* Hour markers */}
        <div className="absolute left-0 right-0 top-10 h-0.5 bg-gray-300 dark:bg-gray-600">
          {hourMarkers.map((marker, idx) => (
            <div key={idx} className="absolute top-0 transform -translate-x-1/2" style={{ left: marker.position }}>
              <div className="h-2 w-0.5 bg-gray-300 dark:bg-gray-600 mb-1"></div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{marker.hour}</div>
            </div>
          ))}
        </div>

        {/* Current time indicator */}
        {currentTimePosition !== null && (
          <div 
            className="absolute top-8 w-0.5 h-4 bg-error-500 z-10 transform -translate-x-1/2"
            style={{ left: `${currentTimePosition}%` }}
          >
            <div className="w-2 h-2 rounded-full bg-error-500 absolute -top-1 -left-0.75"></div>
            <div className="text-xs text-error-500 absolute top-5 -left-5 whitespace-nowrap">
              {format(currentTime, 'h:mm a')}
            </div>
          </div>
        )}

        {/* Events */}
        {sortedEvents.map((event, idx) => {
          const position = getEventPosition(event);
          if (!position) return null;
          
          return (
            <div 
              key={idx} 
              className="absolute top-10 transform -translate-y-1/2"
              style={{ left: position.left }}
            >
              <div 
                className={`rounded-full ${categoryColors[event.category] || categoryColors.default} ${importanceSizes[event.importance] || importanceSizes.default}`}
                data-tooltip={`${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}: ${event.title}`}
              ></div>
              <div className="mt-6 text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap transform -translate-x-1/2">
                {event.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event details */}
      <div className="mt-10">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Today's Schedule</h3>
        <div className="space-y-3">
          {sortedEvents.map((event, idx) => (
            <div 
              key={idx} 
              className="p-3 bg-white dark:bg-gray-800 shadow-sm rounded-lg border-l-4 flex items-start"
              style={{ borderLeftColor: categoryColors[event.category] || '#6B7280' }}
            >
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {event.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                </div>
              </div>
              <div className={`px-2 py-1 text-xs rounded-full ${
                event.importance === 'high' ? 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200' :
                event.importance === 'medium' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200' :
                'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200'
              }`}>
                {event.importance}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;