import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Grid, List, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';
import MonthView from '../../components/calendar/MonthView';
import WeekView from '../../components/calendar/WeekView';
import TimelineView from '../../components/calendar/TimelineView';
import AgendaView from '../../components/calendar/AgendaView';

type CalendarView = 'month' | 'week' | 'timeline' | 'agenda';

const Dashboard: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');

  const nextDate = () => {
    const newDate = new Date(date);
    switch (view) {
      case 'month':
        newDate.setMonth(date.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(date.getDate() + 7);
        break;
      case 'timeline':
      case 'agenda':
        newDate.setDate(date.getDate() + 1);
        break;
    }
    setDate(newDate);
  };

  const prevDate = () => {
    const newDate = new Date(date);
    switch (view) {
      case 'month':
        newDate.setMonth(date.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(date.getDate() - 7);
        break;
      case 'timeline':
      case 'agenda':
        newDate.setDate(date.getDate() - 1);
        break;
    }
    setDate(newDate);
  };

  const resetToToday = () => {
    setDate(new Date());
  };

  const renderViewTitle = () => {
    switch (view) {
      case 'month':
        return format(date, 'MMMM yyyy');
      case 'week':
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${format(startOfWeek, 'MMM d')} - ${format(endOfWeek, 'MMM d, yyyy')}`;
      case 'timeline':
      case 'agenda':
        return format(date, 'EEEE, MMMM d, yyyy');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
              Mission Control
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button 
              variant="outline" 
              size="sm"
              leftIcon={<ChevronLeft size={16} />}
              className="mr-2"
              onClick={prevDate}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetToToday}
              className="mr-2"
            >
              Today
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              rightIcon={<ChevronRight size={16} />}
              onClick={nextDate}
            >
              Next
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {renderViewTitle()}
            </h3>
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <Button 
                variant={view === 'month' ? 'primary' : 'ghost'} 
                size="sm"
                leftIcon={<Grid size={16} />}
                onClick={() => setView('month')}
              >
                Month
              </Button>
              <Button 
                variant={view === 'week' ? 'primary' : 'ghost'} 
                size="sm"
                leftIcon={<List size={16} />}
                onClick={() => setView('week')}
              >
                Week
              </Button>
              <Button 
                variant={view === 'timeline' ? 'primary' : 'ghost'} 
                size="sm"
                leftIcon={<Clock size={16} />}
                onClick={() => setView('timeline')}
              >
                Timeline
              </Button>
              <Button 
                variant={view === 'agenda' ? 'primary' : 'ghost'} 
                size="sm"
                leftIcon={<List size={16} />}
                onClick={() => setView('agenda')}
              >
                Agenda
              </Button>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {view === 'month' && <MonthView date={date} />}
            {view === 'week' && <WeekView date={date} />}
            {view === 'timeline' && <TimelineView date={date} />}
            {view === 'agenda' && <AgendaView date={date} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;