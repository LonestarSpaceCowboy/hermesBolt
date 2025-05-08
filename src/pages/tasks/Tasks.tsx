import React, { useState } from 'react';
import { PlusCircle, CheckSquare, Square, Trash, Clock, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Sample data for demonstration
const initialTasks = [
  {
    id: '1',
    title: 'Review product requirements',
    description: 'Go through the updated PRD for the Q3 roadmap',
    category: 'work',
    importance: 'high',
    completed: false,
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, vegetables',
    category: 'personal',
    importance: 'medium',
    completed: false,
  },
  {
    id: '3',
    title: 'Schedule team meeting',
    description: 'Quarterly planning session',
    category: 'work',
    importance: 'high',
    completed: true,
  },
  {
    id: '4',
    title: 'Pay utility bills',
    description: 'Electricity and internet',
    category: 'personal',
    importance: 'medium',
    completed: false,
  },
];

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'work',
    importance: 'medium',
  });
  
  // Filter states
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      importance: newTask.importance,
      completed: false,
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      category: 'work',
      importance: 'medium',
    });
    setShowNewTaskForm(false);
  };
  
  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };
  
  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      // Status filter
      if (filter === 'active' && task.completed) return false;
      if (filter === 'completed' && !task.completed) return false;
      
      // Category filter
      if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
      
      return true;
    });
  };
  
  const filteredTasks = getFilteredTasks();
  
  // Importance styles
  const importanceStyles: Record<string, string> = {
    high: 'border-l-4 border-error-500',
    medium: 'border-l-4 border-warning-500',
    low: 'border-l-4 border-success-500',
  };
  
  // Category styles
  const categoryStyles: Record<string, string> = {
    work: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
    personal: 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
              Tasks
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button 
              variant="primary" 
              onClick={() => setShowNewTaskForm(true)}
              leftIcon={<PlusCircle size={16} />}
            >
              New Task
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
              <button
                className={`px-3 py-1.5 text-sm ${
                  filter === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-3 py-1.5 text-sm ${
                  filter === 'active'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`px-3 py-1.5 text-sm ${
                  filter === 'completed'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
            
            <select
              className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
            </select>
          </div>
        </div>
        
        {/* Task list */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No tasks</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filter === 'all'
                  ? "You don't have any tasks yet. Add one to get started!"
                  : filter === 'active'
                  ? "You don't have any active tasks."
                  : "You don't have any completed tasks."}
              </p>
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowNewTaskForm(true)}
                  leftIcon={<Plus size={16} />}
                >
                  Add your first task
                </Button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTasks.map((task) => (
                <li 
                  key={task.id} 
                  className={`px-4 py-4 sm:px-6 ${importanceStyles[task.importance] || ''} ${
                    task.completed ? 'bg-gray-50 dark:bg-gray-800/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className="flex-shrink-0 h-6 w-6 text-primary-600 dark:text-primary-400"
                      >
                        {task.completed ? (
                          <CheckSquare className="h-6 w-6" />
                        ) : (
                          <Square className="h-6 w-6" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p 
                          className={`text-base font-medium ${
                            task.completed
                              ? 'text-gray-500 dark:text-gray-400 line-through'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {task.description}
                          </p>
                        )}
                        <div className="mt-2">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              categoryStyles[task.category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}
                          >
                            {task.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-error-500 dark:hover:text-error-400"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* New task form */}
        {showNewTaskForm && (
          <div className="fixed inset-0 z-20 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-50"></div>
              </div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                    Add New Task
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="What needs to be done?"
                      fullWidth
                    />
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={3}
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Add details (optional)"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Category
                        </label>
                        <select
                          id="category"
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          value={newTask.category}
                          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                        >
                          <option value="work">Work</option>
                          <option value="personal">Personal</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="importance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Importance
                        </label>
                        <select
                          id="importance"
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm p-2 focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          value={newTask.importance}
                          onChange={(e) => setNewTask({ ...newTask, importance: e.target.value as any })}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button
                    variant="primary"
                    onClick={handleAddTask}
                    className="w-full sm:w-auto sm:ml-3"
                  >
                    Add Task
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewTaskForm(false)}
                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;