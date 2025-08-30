
import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Clock, Play, Pause, RotateCcw, X, Target, Filter, Search, Download, Upload, Star, Calendar, Tag, Users, BarChart3, Settings, Moon, Sun, Bell, Archive, ChevronDown, ChevronUp, Edit3, Trash2, MoreHorizontal, FolderPlus, FolderOpen, PieChart, List, Grid, Eye, EyeOff, AlertCircle, CheckSquare, Square, CalendarDays, Clock4, Flag, Bookmark, BookmarkCheck, RotateCw, ChevronRight, ChevronLeft, Maximize2, Minimize2, Zap, Crown, Sparkles, Brain, Target as TargetIcon, Coffee, Music, Camera, Heart, MessageCircle, ThumbsUp, Rocket, Lightbulb, Gem, Award, Trophy, Shield, Key, Lock, Unlock, User, UserPlus, Users as UsersIcon, Mail, Phone, Video, MapPin, Navigation, Compass, Globe, Cloud, CloudRain, CloudSnow, Sun as SunIcon, Cloudy, Wind, Umbrella } from 'lucide-react';
import axios from 'axios';
// API base URL
const API_BASE_URL = 'http://localhost:5001/api';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activeTimer, setActiveTimer] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filter, setFilter] = useState('all');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('work');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showTaskDetails, setShowTaskDetails] = useState(null);
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroType, setPomodoroType] = useState('work');
  const [pomodoroCompleted, setPomodoroCompleted] = useState(0);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [showMotivational, setShowMotivational] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [productivityScore, setProductivityScore] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [tags, setTags] = useState(['urgent', 'important', 'meeting', 'idea', 'follow-up']);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagManager, setShowTagManager] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [isLoading, setIsLoading] = useState(false);

  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = [
    { id: 'work', name: 'Work', color: 'bg-blue-500', icon: <BarChart3 size={16} /> },
    { id: 'personal', name: 'Personal', color: 'bg-green-500', icon: <User size={16} /> },
    { id: 'health', name: 'Health', color: 'bg-red-500', icon: <Heart size={16} /> },
    { id: 'learning', name: 'Learning', color: 'bg-purple-500', icon: <Brain size={16} /> },
    { id: 'finance', name: 'Finance', color: 'bg-amber-500', icon: <DollarSign size={16} /> },
    { id: 'social', name: 'Social', color: 'bg-pink-500', icon: <UsersIcon size={16} /> },
    { id: 'creative', name: 'Creative', color: 'bg-indigo-500', icon: <Sparkles size={16} /> },
    { id: 'other', name: 'Other', color: 'bg-gray-500', icon: <MoreHorizontal size={16} /> }
  ];

  const priorityOptions = [
    { id: 'low', name: 'Low', color: 'bg-blue-100 text-blue-800' },
    { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'high', name: 'High', color: 'bg-orange-100 text-orange-800' },
    { id: 'critical', name: 'Critical', color: 'bg-red-100 text-red-800' }
  ];

  const motivationalQuotes = [
    "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
    "The secret of getting ahead is getting started.",
    "Your time is limited, so don't waste it living someone else's life.",
    "It's not about having time, it's about making time.",
    "The way to get started is to quit talking and begin doing.",
    "Focus on being productive instead of busy.",
    "You don't have to see the whole staircase, just take the first step.",
    "The future depends on what you do today.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Don't count the days, make the days count."
  ];

  // API request helper
  const apiRequest = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle task timers
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTimer) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === activeTimer
              ? { ...task, timeSpent: (task.timeSpent || 0) + 1 }
              : task
          )
        );
      }

      if (pomodoroActive && pomodoroTime > 0) {
        setPomodoroTime(prev => prev - 1);
      } else if (pomodoroActive && pomodoroTime === 0) {
        setPomodoroActive(false);
        if (pomodoroType === 'work') {
          setPomodoroCompleted(prev => prev + 1);
          
          if (!achievements.includes('pomodoro_master')) {
            setAchievements(prev => [...prev, 'pomodoro_master']);
          }
      
          setPomodoroType('break');
          setPomodoroTime(5 * 60);
          if (notifications) {
            new Notification('Pomodoro Completed!', { body: 'Time for a 5 minute break!' });
          }
        } else {
          setPomodoroType('work');
          setPomodoroTime(25 * 60);
          if (notifications) {
            new Notification('Break Over!', { body: 'Time to get back to work!' });
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, pomodoroActive, pomodoroTime, pomodoroType, achievements, notifications]);

  // Load tasks from backend
  useEffect(() => {
    const loadTasks = async () => {
      if (!token) {
        // Auto-register a user if no token exists
        await registerUser();
        return;
      }

      try {
        setIsLoading(true);
        const tasksData = await apiRequest('/tasks');
        setTasks(tasksData);
        
        // Load achievements
        const analyticsData = await apiRequest('/analytics');
        setAchievements(analyticsData.achievements || []);
        setProductivityScore(analyticsData.productivityScore || 0);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [token]);

  // Auto-register a user
  const registerUser = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: `user_${Math.random().toString(36).substring(2, 9)}`,
          email: `user_${Math.random().toString(36).substring(2, 9)}@example.com`,
          password: 'password123'
        })
      });

      setToken(response.token);
      setUserId(response._id);
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response._id);
    } catch (error) {
      console.error('Failed to register user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (inputValue.trim() === '') {
      alert('Please enter a task');
      return;
    }
    
    try {
      const newTask = {
        text: inputValue.trim(),
        category: selectedCategory,
        priority: 'medium',
        timeSpent: 0
      };
      
      const createdTask = await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(newTask)
      });
      
      setTasks([...tasks, createdTask]);
      setInputValue('');
    } catch (error) {
      console.error('Failed to add task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  // const toggleTask = async (id) => {
  //   try {
  //     const taskToUpdate = tasks.find(task => task.id === id);
  //     const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
      
  //     await apiRequest(`'http://localhost:5001/api/tasks/${id}`, {
  //       method: 'PUT',
  //       body: JSON.stringify(updatedTask)
  //     });
      
  //     setTasks(tasks.map(task => 
  //       task.id === id ? updatedTask : task
  //     ));
      
  //     if (activeTimer === id) {
  //       setActiveTimer(null);
  //     }
  //   } catch (error) {
  //     console.error('Failed to update task:', error);
  //   }
  // };

  const toggleTask = async (id) => {
  try {
    const taskToUpdate = tasks.find(task => task._id === id);
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

    await axios.put(`${API_BASE_URL}/tasks/${id}`, updatedTask, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });

    setTasks(tasks.map(task =>
      task._id === id ? updatedTask : task
    ));

    if (activeTimer === id) {
      setActiveTimer(null);
    }
  } catch (error) {
    console.error('Failed to update task:', error);
  }
};

  // const deleteTask = async (id) => {
  //   try {
  //     await apiRequest(`http://localhost:5001/api/tasks/${id}`, {
  //       method: 'DELETE'
  //     });
      
  //     setTasks(tasks.filter(task => task.id !== id));
  //     if (activeTimer === id) {
  //       setActiveTimer(null);
  //     }
  //   } catch (error) {
  //     console.error('Failed to delete task:', error);
  //   }
  // };

  // const toggleTimer = (id) => {
  //   if (activeTimer === id) {
  //     setActiveTimer(null);
  //   } else {
  //     setActiveTimer(id);
  //   }
  // };

    const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      setTasks(tasks.filter(task => task._id !== id));
      if (activeTimer === id) {
        setActiveTimer(null);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };
const resetTimer = async (id) => {
  try {
    const taskToUpdate = tasks.find(task => task._id === id);
    const updatedTask = { ...taskToUpdate, timeSpent: 0 };

    await axios.put(`${API_BASE_URL}/tasks/${id}`, updatedTask, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });

    setTasks(tasks.map(task =>
      task._id === id ? updatedTask : task
    ));

    if (activeTimer === id) {
      setActiveTimer(null);
    }
  } catch (error) {
    console.error('Failed to reset timer:', error);
  }
};

  // const toggleStar = async (id) => {
  //   try {
  //     const taskToUpdate = tasks.find(task => task.id === id);
  //     const updatedTask = { ...taskToUpdate, starred: !taskToUpdate.starred };
      
  //     await apiRequest(`/tasks/${id}`, {
  //       method: 'PUT',
  //       body: JSON.stringify(updatedTask)
  //     });
      
  //     setTasks(tasks.map(task =>
  //       task.id === id ? updatedTask : task
  //     ));
  //   } catch (error) {
  //     console.error('Failed to toggle star:', error);
  //   }
  // };
  const toggleStar = async (id) => {
  try {
    const taskToUpdate = tasks.find(task => task._id === id);
    const updatedTask = { ...taskToUpdate, starred: !taskToUpdate.starred };

    await axios.put(`${API_BASE_URL}/tasks/${id}`, updatedTask, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });

    setTasks(tasks.map(task =>
      task._id === id ? updatedTask : task
    ));
  } catch (error) {
    console.error('Failed to toggle star:', error);
  }
};

  // const archiveTask = async (id) => {
  //   try {
  //     const taskToUpdate = tasks.find(task => task.id === id);
  //     const updatedTask = { ...taskToUpdate, archived: true };
      
  //     await apiRequest(`/tasks/${id}`, {
  //       method: 'PUT',
  //       body: JSON.stringify(updatedTask)
  //     });
      
  //     setTasks(tasks.map(task =>
  //       task.id === id ? updatedTask : task
  //     ));
  //   } catch (error) {
  //     console.error('Failed to archive task:', error);
  //   }
  // };

  const archiveTask = async (id) => {
  try {
    const taskToUpdate = tasks.find(task => task._id === id);
    const updatedTask = { ...taskToUpdate, archived: true };

    await axios.put(`${API_BASE_URL}/tasks/${id}`, updatedTask, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });

    setTasks(tasks.map(task =>
      task._id === id ? updatedTask : task
    ));
  } catch (error) {
    console.error('Failed to archive task:', error);
  }
};

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditText(task.text);
  };

  const saveEdit = async (id) => {
    try {
      const taskToUpdate = tasks.find(task => task._id === id);
      const updatedTask = { ...taskToUpdate, text: editText };
      
      await apiRequest(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTask)
      });
      
      setTasks(tasks.map(task =>
        task._id === id ? updatedTask : task
      ));
      
      setEditingTaskId(null);
      setEditText('');
    } catch (error) {
      console.error('Failed to save edit:', error);
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditText('');
  };

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'tasks.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importTasks = async (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = async e => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        
        // Import each task to the backend
        for (const task of importedTasks) {
          await apiRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify(task)
          });
        }
        
        // Reload tasks from backend
        const tasksData = await apiRequest('/tasks');
        setTasks(tasksData);
      } catch (error) {
        alert('Error importing tasks: Invalid file format');
      }
    };
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPomodoroTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const startPomodoro = () => {
    setPomodoroActive(true);
    setPomodoroType('work');
    setPomodoroTime(25 * 60);
  };

  const pausePomodoro = () => {
    setPomodoroActive(false);
  };

  const resetPomodoro = () => {
    setPomodoroActive(false);
    setPomodoroType('work');
    setPomodoroTime(25 * 60);
  };

  const addSubtask = async (taskId, text) => {
    if (!text.trim()) return;
    
    try {
      await apiRequest(`/tasks/${taskId}/subtasks`, {
        method: 'POST',
        body: JSON.stringify({
          text: text.trim(),
          completed: false
        })
      });
      
      // Reload tasks from backend
      const tasksData = await apiRequest('/tasks');
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const subtask = task.subtasks.find(s => s._id === subtaskId);
      
      await apiRequest(`/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'PUT',
        body: JSON.stringify({
          completed: !subtask.completed
        })
      });
      
      // Reload tasks from backend
      const tasksData = await apiRequest('/tasks');
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
    }
  };

  const deleteSubtask = async (taskId, subtaskId) => {
    try {
      await apiRequest(`/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'DELETE'
      });
      
      // Reload tasks from backend
      const tasksData = await apiRequest('/tasks');
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  };

  const addTagToTask = async (taskId, tag) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const updatedTags = [...new Set([...(task.tags || []), tag])];

      await axios.put(`${API_BASE_URL}/tasks/${taskId}`, {
        ...task,
        tags: updatedTags
      }, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      // Reload tasks from backend
      const tasksData = await apiRequest('/tasks');
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

    const removeTagFromTask = async (taskId, tag) => {
      try {
        const task = tasks.find(t => t._id === taskId);
        const updatedTags = (task.tags || []).filter(t => t !== tag);

        await axios.put(`${API_BASE_URL}/tasks/${taskId}`, {
          ...task,
          tags: updatedTags
        }, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          }
        });

        // Reload tasks from backend
        const tasksData = await apiRequest('/tasks');
        setTasks(tasksData);
      } catch (error) {
        console.error('Failed to remove tag:', error);
      }
    };
  const addNewTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !task.completed && !task.archived) ||
      (filter === 'completed' && task.completed) ||
      (filter === 'starred' && task.starred) ||
      (filter === 'archived' && task.archived);
    
    const matchesTags = selectedTags.length === 0 || 
      (task.tags && selectedTags.some(tag => task.tags.includes(tag)));
    
    return matchesSearch && matchesFilter && matchesTags && !task.archived;
  });

  const completedCount = tasks.filter(task => task.completed && !task.archived).length;
  const totalCount = tasks.filter(task => !task.archived).length;
  const totalTimeSpent = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
  const activeTask = tasks.find(task => task._id === activeTimer);
  const starredCount = tasks.filter(task => task.starred && !task.archived).length;

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const themeClass = darkMode ? 'bg-slate-900' : 'bg-slate-50';
  const cardClass = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const textClass = darkMode ? 'text-slate-100' : 'text-slate-800';
  const subtextClass = darkMode ? 'text-slate-400' : 'text-slate-600';
  const buttonClass = darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700';

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex(prevIndex => 
        (prevIndex + 1) % motivationalQuotes.length
      );
    }, 30000);

    return () => clearInterval(quoteInterval);
  }, []);

  const motivationalQuote = motivationalQuotes[currentQuoteIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClass} p-4 md:p-6 transition-colors duration-300 relative overflow-hidden`}>
     
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.5"/>
              </pattern>
              <radialGradient id="fade" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#64748b" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#64748b" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <circle cx="20%" cy="30%" r="200" fill="url(#fade)" />
            <circle cx="80%" cy="70%" r="150" fill="url(#fade)" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {isMobile && (
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={`fixed top-4 right-4 z-50 p-2 rounded-lg ${buttonClass} shadow-lg`}
          >
            {showMobileMenu ? <X size={24} /> : <MoreHorizontal size={24} />}
          </button>
        )}
        
        {isMobile && showMobileMenu && (
          <div className={`fixed inset-0 z-40 ${darkMode ? 'bg-slate-900' : 'bg-white'} p-6`}>
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <h1 className={`text-2xl font-semibold ${textClass}`}>ActionBoard</h1>
                <button onClick={() => setShowMobileMenu(false)} className={subtextClass}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex flex-col gap-4 mb-8">
                <button
                  onClick={() => setShowPomodoro(!showPomodoro)}
                  className={`p-3 rounded-lg text-left flex items-center gap-3 ${buttonClass}`}
                >
                  <Clock4 size={20} />
                  Pomodoro Timer
                </button>
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={`p-3 rounded-lg text-left flex items-center gap-3 ${buttonClass}`}
                >
                  <PieChart size={20} />
                  Analytics
                </button>
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className={`p-3 rounded-lg text-left flex items-center gap-3 ${buttonClass}`}
                >
                  <FolderOpen size={20} />
                  Categories
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className={`p-3 rounded-lg text-left flex items-center gap-3 ${buttonClass}`}
                >
                  <Settings size={20} />
                  Settings
                </button>
              </div>
              
              <div className="mt-auto">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-full p-3 rounded-lg mb-3 flex items-center justify-between ${buttonClass}`}
                >
                  <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>
          </div>
        )}
   
        <div className={`${cardClass} rounded-xl shadow-lg border p-4 md:p-6 lg:p-8 mb-6 backdrop-blur-sm`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <h1 className={`text-2xl md:text-3xl font-semibold ${textClass} mb-2 flex items-center gap-3`}>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center">
                  
                </div>
                ActionBoard
                {productivityScore > 80 && (
                  <span className="text-xs bg-amber-500 text-amber-900 px-2 py-1 rounded-full ml-2 flex items-center gap-1">
                    <Trophy size={12} /> 
                  </span>
                )}
              </h1>
              <p className={`${subtextClass} text-sm md:text-base`}>Advanced task management with time tracking</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              {!isMobile && (
                <>
                  <div className="text-right mr-2 md:mr-4">
                    <div className={`text-xl md:text-2xl font-mono font-medium ${textClass}`}>
                      {formatCurrentTime()}
                    </div>
                    <div className={`${subtextClass} text-xs md:text-sm`}>
                      {currentTime.toLocaleDateString('en-US', { 
                        weekday: isMobile ? 'short' : 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 md:p-3 rounded-lg transition-colors duration-200 ${buttonClass}`}
                  >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className={`p-2 md:p-3 rounded-lg transition-colors duration-200 ${buttonClass}`}
                  >
                    <Settings size={18} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-lg p-3 md:p-4 text-center transition-all duration-200 hover:scale-105`}>
              <div className={`text-lg md:text-xl lg:text-2xl font-semibold ${textClass}`}>{tasks.filter(t => !t.completed && !t.archived).length}</div>
              <div className={`text-xs md:text-sm ${subtextClass}`}>Active Tasks</div>
            </div>
            <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-lg p-3 md:p-4 text-center transition-all duration-200 hover:scale-105`}>
              <div className={`text-lg md:text-xl lg:text-2xl font-semibold ${textClass}`}>{completedCount}</div>
              <div className={`text-xs md:text-sm ${subtextClass}`}>Completed</div>
            </div>
            <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-lg p-3 md:p-4 text-center transition-all duration-200 hover:scale-105`}>
              <div className={`text-lg md:text-xl lg:text-2xl font-semibold ${textClass}`}>{starredCount}</div>
              <div className={`text-xs md:text-sm ${subtextClass}`}>Starred</div>
            </div>
            <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-lg p-3 md:p-4 text-center transition-all duration-200 hover:scale-105`}>
              <div className={`text-lg md:text-xl lg:text-2xl font-mono font-semibold ${textClass}`}>{formatTime(totalTimeSpent)}</div>
              <div className={`text-xs md:text-sm ${subtextClass}`}>Time Spent</div>
            </div>
            <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'} rounded-lg p-3 md:p-4 text-center transition-all duration-200 hover:scale-105`}>
              <div className={`text-lg md:text-xl lg:text-2xl font-semibold ${textClass}`}>
                {productivityScore}%
              </div>
              <div className={`text-xs md:text-sm ${subtextClass}`}>Productivity</div>
            </div>
          </div>
          

          {totalCount > 0 && (
            <div className="mb-6 md:mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className={`${subtextClass} text-sm md:text-base`}>Task Completion Progress</span>
                <span className={`font-medium ${textClass} text-sm md:text-base`}>
                  {completedCount}/{totalCount} ({Math.round((completedCount / totalCount) * 100)}%)
                </span>
              </div>
              <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-full h-2 md:h-3 overflow-hidden`}>
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 md:h-3 rounded-full transition-all duration-500 relative"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
       
          {showMotivational && (
            <div className={`${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-blue-50 border-blue-200'} border rounded-lg p-3 md:p-4 mb-6 transition-all duration-300`}>
              <div className="flex items-start gap-3">
                <Lightbulb size={18} className={`mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                <div>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-blue-700'} text-xs md:text-sm italic`}>
                    "{motivationalQuote}"
                  </p>
                </div>
                <button 
                  onClick={() => setShowMotivational(false)}
                  className={`ml-auto p-1 rounded-full ${darkMode ? 'hover:bg-slate-600' : 'hover:bg-blue-100'}`}
                >
                  <X size={14} className={subtextClass} />
                </button>
              </div>
            </div>
          )}
      
          {activeTask && (
            <div className={`${darkMode ? 'bg-slate-700/70 border-slate-600' : 'bg-slate-100 border-slate-300'} border rounded-lg p-3 md:p-4 mb-6 transition-all duration-300`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className={`${subtextClass} font-medium text-sm`}>Currently working on:</span>
                  <span className={`${textClass} font-semibold text-sm md:text-base truncate`}>{activeTask.text}</span>
                </div>
                <div className={`text-lg md:text-xl font-mono font-semibold ${textClass}`}>
                  {formatTime(activeTask.timeSpent || 0)}
                </div>
              </div>
            </div>
          )}
          

          <div className="flex flex-col gap-3 md:gap-4 mb-6">
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex-1 relative">
                <Search size={18} className={`absolute left-3 top-3 ${subtextClass}`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
                  className={`w-full pl-10 pr-4 py-2 md:py-3 border ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400' 
                      : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                />
              </div>
           
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-3 md:px-4 py-2 md:py-3 border ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-slate-200' 
                    : 'bg-white border-slate-300 text-slate-800'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
              >
                <option value="all">All Tasks</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="starred">Starred</option>
              </select>
              
              <div className="flex gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-700 self-start">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 md:p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''}`}
                >
                  <List size={16} className={subtextClass} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 md:p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow-sm' : ''}`}
                >
                  <Grid size={16} className={subtextClass} />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, isMobile ? 3 : 5).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTags(prev => 
                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                    )}
                    className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Tag size={12} />
                    {tag}
                    {selectedTags.includes(tag) && <X size={12} />}
                  </button>
                ))}
               
                {tags.length > (isMobile ? 3 : 5) && (
                  <button
                    onClick={() => setShowTagManager(!showTagManager)}
                    className={`px-2 py-1 rounded-full text-xs ${buttonClass}`}
                  >
                    +{tags.length - (isMobile ? 3 : 5)} more
                  </button>
                )}
              </div>
              
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={exportTasks}
                  className={`px-3 py-2 ${buttonClass} rounded-lg transition-colors duration-200 flex items-center gap-2 text-xs md:text-sm`}
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <label className={`px-3 py-2 ${buttonClass} rounded-lg transition-colors duration-200 flex items-center gap-2 text-xs md:text-sm cursor-pointer`}>
                  <Upload size={16} />
                  <span className="hidden sm:inline">Import</span>
                  <input type="file" accept=".json" onChange={importTasks} className="hidden" />
                </label>
              </div>
            </div>
          </div>
          
          {showTagManager && (
            <div className={`${cardClass} p-4 rounded-lg mb-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-medium ${textClass}`}>Manage Tags</h3>
                <button onClick={() => setShowTagManager(false)} className={subtextClass}>
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map(tag => (
                  <div key={tag} className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm">
                    <span>{tag}</span>
                    <button 
                      onClick={() => setTags(tags.filter(t => t !== tag))}
                      className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="New tag name"
                  className={`flex-1 px-3 py-2 border ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400' 
                      : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                />
                <button
                  onClick={addNewTag}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 flex-1">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`pl-10 pr-8 py-2 md:py-3 border appearance-none ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-slate-200' 
                      : 'bg-white border-slate-300 text-slate-800'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 w-full`}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="absolute left-3 top-2.5 md:top-3.5 pointer-events-none">
                  {categories.find(c => c.id === selectedCategory)?.icon}
                </div>
                <ChevronDown size={16} className={`absolute right-3 top-2.5 md:top-3.5 pointer-events-none ${subtextClass}`} />
              </div>
              
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a new task..."
                className={`flex-1 px-4 py-2 md:py-3 border ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400' 
                    : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
              />
            </div>
            <button
              onClick={addTask}
              className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 shadow-lg text-sm md:text-base"
            >
              <Plus size={18} />
              <span>Add Task</span>
            </button>
          </div>
        </div>


        {showPomodoro && (
          <div className={`${cardClass} rounded-xl shadow-lg border p-4 md:p-6 mb-6 backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className={`text-lg md:text-xl font-semibold ${textClass} flex items-center gap-2`}>
                <Clock4 size={20} className="text-blue-500" />
                Pomodoro Timer
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowPomodoro(false)}
                  className={`p-1 md:p-2 rounded-lg ${buttonClass}`}
                >
                  <Minimize2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center mb-4 md:mb-6">
              
              <div className={`text-4xl md:text-5xl lg:text-6xl font-mono font-bold mb-4 ${pomodoroType === 'work' ? 'text-blue-600' : 'text-green-600'}`}>
                {formatPomodoroTime(pomodoroTime)}
              </div>
              <div className={`text-base md:text-lg font-medium mb-4 md:mb-6 ${subtextClass}`}>
                {pomodoroType === 'work' ? 'Focus Time' : 'Break Time'}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                {pomodoroActive ? (
                  <button
                    onClick={pausePomodoro}
                    className="px-4 py-2 md:px-6 md:py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <Pause size={16} />
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={startPomodoro}
                    className="px-4 py-2 md:px-6 md:py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <Play size={16} />
                    Start
                  </button>
                )}
                <button
                  onClick={resetPomodoro}
                  className="px-4 py-2 md:px-6 md:py-3 bg-slate-500 text-white rounded-lg font-medium hover:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base"
                  disabled={pomodoroActive}
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-xs md:text-sm ${subtextClass} mb-2`}>Completed Pomodoros</div>
              <div className="flex justify-center gap-1">
                {Array.from({ length: Math.min(pomodoroCompleted, 10) }).map((_, i) => (
                  <div key={i} className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                ))}
                {pomodoroCompleted > 10 && (
                  <div className="text-xs text-slate-500">+{pomodoroCompleted - 10}</div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className={`${cardClass} rounded-xl shadow-lg border backdrop-blur-sm`}>
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className={`text-lg md:text-xl font-semibold ${textClass}`}>
              Tasks ({filteredTasks.length})
            </h2>
            {!isMobile && (
              <div className="flex items-center gap-3 md:gap-4">
                <button
                  onClick={() => setShowPomodoro(!showPomodoro)}
                  className={`p-2 rounded-lg ${buttonClass}`}
                >
                  <Clock4 size={18} />
                </button>
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={`p-2 rounded-lg ${buttonClass}`}
                >
                  <PieChart size={18} />
                </button>
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className={`p-2 rounded-lg ${buttonClass}`}
                >
                  <FolderOpen size={18} />
                </button>
              </div>
            )}
          </div>
          
          {filteredTasks.length === 0 ? (
            <div className="p-8 md:p-16 text-center">
              <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} flex items-center justify-center`}>
                <Target size={20} className={subtextClass} />
              </div>
              <h3 className={`${subtextClass} text-base md:text-lg font-medium mb-2`}>
                {searchTerm || filter !== 'all' || selectedTags.length > 0 ? 'No tasks match your criteria' : 'No tasks yet'}
              </h3>
              <p className={`${subtextClass} text-sm md:text-base`}>
                {searchTerm || filter !== 'all' || selectedTags.length > 0 ? 'Try adjusting your search or filter' : 'Create your first task to get started'}
              </p>
            </div>
          ) : viewMode === 'list' ? (
            <div className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className={`group flex items-center gap-3 md:gap-4 p-4 md:p-6 transition-all duration-300 ${
                    darkMode ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'
                  } ${task.completed ? 'opacity-60' : ''} ${
                    activeTimer === task._id ? 
                      `${darkMode ? 'bg-slate-700/50 border-l-4 border-blue-500' : 'bg-slate-50 border-l-4 border-blue-500'}` : 
                      ''
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task._id)}
                    className="flex-shrink-0 transition-transform duration-200 hover:scale-110"
                  >
                    {task.completed ? (
                      <CheckCircle2 size={20} className="text-green-500" />
                    ) : (
                      <Circle size={20} className={`${darkMode ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`} />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {editingTaskId === task._id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className={`flex-1 px-2 py-1 border ${
                              darkMode 
                                ? 'bg-slate-700 border-slate-600 text-slate-200' 
                                : 'bg-white border-slate-300 text-slate-800'
                            } rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm md:text-base`}
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(task._id)}
                            className="p-1 text-green-500 hover:text-green-600"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-red-500 hover:text-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div
                            className={`text-base md:text-lg cursor-pointer select-none transition-colors duration-200 truncate ${
                              task.completed
                                ? `${darkMode ? 'text-slate-500' : 'text-slate-500'} line-through`
                                : `${textClass} ${darkMode ? 'hover:text-slate-300' : 'hover:text-slate-600'}`
                            }`}
                            onClick={() => toggleTask(task._id)}
                          >
                            {task.text}
                          </div>
                          {task.starred && (
                            <Star size={16} className="text-amber-500 fill-current flex-shrink-0" />
                          )}
                        </>
                      )}
                    </div>
                    
                    <div className={`flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm ${subtextClass} mb-2`}>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{formatTime(task.timeSpent || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${categories.find(c => c.id === task.category)?.color || 'bg-gray-500'}`}></div>
                        <span>{categories.find(c => c.id === task.category)?.name || 'Work'}</span>
                      </div>
                      {task.priority && task.priority !== 'medium' && (
                        <div className={`px-1.5 py-0.5 rounded-full text-xs ${priorityOptions.find(p => p.id === task.priority)?.color}`}>
                          {priorityOptions.find(p => p.id === task.priority)?.name}
                        </div>
                      )}
                      <span className="hidden sm:inline">Created {new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                   
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {task.tags.map(tag => (
                          <span 
                            key={tag}
                            className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs flex items-center gap-1"
                          >
                            <Tag size={10} />
                            {tag}
                            <button 
                              onClick={() => removeTagFromTask(task._id, tag)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Subtasks */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="mt-2 pl-3 border-l border-slate-200 dark:border-slate-700">
                        {task.subtasks.map(subtask => (
                          <div key={subtask._id} className="flex items-center gap-2 mb-1">
                            <button
                              onClick={() => toggleSubtask(task._id, subtask._id)}
                              className="flex-shrink-0"
                            >
                              {subtask.completed ? (
                                <CheckSquare size={14} className="text-green-500" />
                              ) : (
                                <Square size={14} className="text-slate-400" />
                              )}
                            </button>
                            <span className={`text-xs md:text-sm ${subtask.completed ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-300'} truncate`}>
                              {subtask.text}
                            </span>
                            <button
                              onClick={() => deleteSubtask(task._id, subtask._id)}
                              className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 flex-shrink-0">
                    <button
                      onClick={() => toggleStar(task._id)}
                      className={`p-1.5 md:p-2 rounded-lg transition-colors duration-200 ${
                        task.starred 
                          ? 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' 
                          : `${darkMode ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`
                      }`}
                    >
                      <Star size={14} className={task.starred ? 'fill-current' : ''} />
                    </button>
                    
                    {!task.completed && (
                      <>
                        <button
                          onClick={() => toggleTimer(task._id)}
                          className={`p-1.5 md:p-2 rounded-lg transition-colors duration-200 ${
                            activeTimer === task._id
                              ? `${darkMode ? 'bg-blue-600 text-slate-200 hover:bg-blue-500' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`
                              : `${darkMode ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
                          }`}
                        >
                          {activeTimer === task._id ? (
                            <Pause size={14} />
                          ) : (
                            <Play size={14} />
                          )}
                        </button>
                        
                        <button
                          onClick={() => resetTimer(task._id)}
                          className={`p-1.5 md:p-2 rounded-lg transition-colors duration-200 ${
                            darkMode ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <RotateCcw size={14} />
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => startEditing(task)}
                      className={`p-1.5 md:p-2 rounded-lg transition-colors duration-200 ${
                        darkMode ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Edit3 size={14} />
                    </button>
                    
                    <button
                      onClick={() => archiveTask(task._id)}
                      className={`p-1.5 md:p-2 rounded-lg transition-colors duration-200 ${
                        darkMode ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Archive size={14} />
                    </button>
                    
                    <button
                      onClick={() => deleteTask(task._id)}
                      className={`p-1.5 md:p-2 rounded-lg transition-colors duration-200 ${
                        darkMode ? 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                      }`}
                    >
                      <Trash2 size={14} />
                    </button>
                    
                    <button
                      onClick={() => setShowTaskDetails(showTaskDetails === task._id ? null : task._id)}
                      className={`p-1.5 md:p-2 rounded-lg transition-colors duration-200 ${
                        darkMode ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className={`rounded-lg border p-3 md:p-4 transition-all duration-300 ${
                    darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700/50' : 'bg-white border-slate-200 hover:bg-slate-50'
                  } ${task.completed ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <button
                      onClick={() => toggleTask(task._id)}
                      className="flex-shrink-0 mt-0.5 transition-transform duration-200 hover:scale-110"
                    >
                      {task.completed ? (
                        <CheckCircle2 size={18} className="text-green-500" />
                      ) : (
                        <Circle size={18} className="text-slate-400" />
                      )}
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {task.starred && (
                        <Star size={14} className="text-amber-500 fill-current" />
                      )}
                      <button
                        onClick={() => setShowTaskDetails(showTaskDetails === task._id ? null : task._id)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div
                    className={`mb-3 cursor-pointer text-sm md:text-base ${task.completed ? 'line-through text-slate-400' : textClass}`}
                    onClick={() => toggleTask(task._id)}
                  >
                    {task.text}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-xs md:text-sm text-slate-500">
                      <Clock size={12} />
                      <span>{formatTime(task.timeSpent || 0)}</span>
                    </div>
                    
                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${categories.find(c => c.id === task.category)?.color || 'bg-gray-500'}`}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleTimer(task._id)}
                      className={`px-2 py-1 rounded text-xs md:text-sm ${
                        activeTimer === task._id
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {activeTimer === task._id ? 'Stop' : 'Start'}
                    </button>
                    
                    {task.priority && task.priority !== 'medium' && (
                      <div className={`px-1.5 py-0.5 rounded-full text-xs ${priorityOptions.find(p => p.id === task.priority)?.color}`}>
                        {priorityOptions.find(p => p.id === task.priority)?.name}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${cardClass} rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg md:text-xl font-semibold ${textClass}`}>Settings</h2>
                <button onClick={() => setShowSettings(false)} className={subtextClass}>
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4 md:p-6 space-y-6">
              <div>
                <h3 className={`font-medium ${textClass} mb-3`}>Appearance</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className={subtextClass}>Dark Mode</span>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-blue-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={subtextClass}>Focus Mode</span>
                  <button
                    onClick={() => setFocusMode(!focusMode)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${focusMode ? 'bg-blue-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${focusMode ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className={`font-medium ${textClass} mb-3`}>Notifications</h3>
                <div className="flex items-center justify-between">
                  <span className={subtextClass}>Enable Notifications</span>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${notifications ? 'bg-blue-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className={`font-medium ${textClass} mb-3`}>Data</h3>
                <button
                  onClick={exportTasks}
                  className={`w-full py-2 md:py-3 rounded-lg mb-3 flex items-center justify-center gap-2 ${buttonClass} text-sm md:text-base`}
                >
                  <Download size={16} />
                  Export Tasks
                </button>
                
                <label className={`w-full py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 ${buttonClass} text-sm md:text-base cursor-pointer`}>
                  <Upload size={16} />
                  Import Tasks
                  <input type="file" accept=".json" onChange={importTasks} className="hidden" />
                </label>
              </div>
              
              <div>
                <h3 className={`font-medium ${textClass} mb-3`}>About</h3>
                <p className={`text-sm ${subtextClass} mb-4`}>
                  ActionBoard v1.0.0
                </p>
                <p className={`text-sm ${subtextClass}`}>
                  Designed by SK
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    
      {achievements.length > 0 && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-40">
          <div className={`${cardClass} rounded-lg shadow-lg p-3 md:p-4 max-w-xs mx-auto sm:mx-0`}>
            
            <div className="space-y-2">
              {achievements.includes('first_task') && (
                <div className="flex items-center gap-2">
                  <Award size={12} className="text-blue-500" />
                  <span className={`text-xs ${subtextClass}`}>First Task - Created your first task</span>
                </div>
              )}
              {achievements.includes('task_completed') && (
                <div className="flex items-center gap-2">
                  <Award size={12} className="text-green-500" />
                  <span className={`text-xs ${subtextClass}`}>Task Master - Completed your first task</span>
                </div>
              )}
              {achievements.includes('productivity_expert') && (
                <div className="flex items-center gap-2">
                  <Award size={12} className="text-purple-500" />
                  <span className={`text-xs ${subtextClass}`}>Productivity Expert - Completed 10 tasks</span>
                </div>
              )}
              {achievements.includes('pomodoro_master') && (
                <div className="flex items-center gap-2">
                  <Award size={12} className="text-red-500" />
                  <span className={`text-xs ${subtextClass}`}>Pomodoro Master - Completed a pomodoro session</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DollarSign(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
