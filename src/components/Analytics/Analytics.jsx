import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, Calendar, Clock, Target, Award, TrendingUp } from 'lucide-react';

export default function Analytics({ tasks, darkMode }) {
  const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    productivity: 0,
    timeSpent: 0,
    categoryDistribution: {},
    dailyCompletion: {}
  });

  useEffect(() => {
    calculateStats();
  }, [tasks, timeRange]);

  const calculateStats = () => {
    const completed = tasks.filter(task => task.completed && !task.archived).length;
    const total = tasks.filter(task => !task.archived).length;
    const timeSpent = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
    
    // Calculate category distribution
    const categoryDistribution = {};
    tasks.forEach(task => {
      if (!task.archived) {
        categoryDistribution[task.category] = (categoryDistribution[task.category] || 0) + 1;
      }
    });
    
    // Calculate productivity score (simplified)
    const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    setStats({
      completed,
      total,
      productivity,
      timeSpent,
      categoryDistribution
    });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const textClass = darkMode ? 'text-slate-100' : 'text-slate-800';
  const subtextClass = darkMode ? 'text-slate-400' : 'text-slate-600';
  const cardClass = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className={`text-2xl font-semibold ${textClass} flex items-center gap-3`}>
          <BarChart3 size={24} className="text-blue-500" />
          Analytics Dashboard
        </h1>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`px-3 py-2 rounded-lg border ${
            darkMode 
              ? 'bg-slate-700 border-slate-600 text-slate-200' 
              : 'bg-white border-slate-300 text-slate-800'
          }`}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${cardClass} p-6 rounded-xl border shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${subtextClass}`}>Tasks Completed</h3>
            <Target size={18} className="text-blue-500" />
          </div>
          <div className={`text-3xl font-bold ${textClass}`}>
            {stats.completed}/{stats.total}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div className={`${cardClass} p-6 rounded-xl border shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${subtextClass}`}>Productivity Score</h3>
            <TrendingUp size={18} className="text-green-500" />
          </div>
          <div className={`text-3xl font-bold ${textClass}`}>
            {stats.productivity}%
          </div>
          <div className="text-sm mt-1">
            <span className={stats.productivity > 70 ? 'text-green-500' : 'text-amber-500'}>
              {stats.productivity > 70 ? 'Excellent' : stats.productivity > 40 ? 'Good' : 'Needs improvement'}
            </span>
          </div>
        </div>

        <div className={`${cardClass} p-6 rounded-xl border shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${subtextClass}`}>Time Invested</h3>
            <Clock size={18} className="text-purple-500" />
          </div>
          <div className={`text-3xl font-bold ${textClass}`}>
            {formatTime(stats.timeSpent)}
          </div>
          <div className={`text-sm ${subtextClass} mt-1`}>
            {Math.round(stats.timeSpent / 3600)} hours total
          </div>
        </div>

        <div className={`${cardClass} p-6 rounded-xl border shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${subtextClass}`}>Achievements</h3>
            <Award size={18} className="text-amber-500" />
          </div>
          <div className={`text-3xl font-bold ${textClass}`}>
            {Object.keys(stats.categoryDistribution).length}
          </div>
          <div className={`text-sm ${subtextClass} mt-1`}>
            Categories used
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${cardClass} p-6 rounded-xl border shadow-sm`}>
          <h3 className={`text-lg font-semibold ${textClass} mb-4 flex items-center gap-2`}>
            <PieChart size={20} className="text-blue-500" />
            Task Distribution by Category
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryDistribution).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className={`text-sm ${subtextClass}`}>{category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${textClass}`}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardClass} p-6 rounded-xl border shadow-sm`}>
          <h3 className={`text-lg font-semibold ${textClass} mb-4 flex items-center gap-2`}>
            <Calendar size={20} className="text-green-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {tasks
              .filter(task => !task.archived)
              .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
              .slice(0, 5)
              .map(task => (
                <div key={task._id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`text-sm ${textClass} truncate`}>{task.text}</p>
                    <p className={`text-xs ${subtextClass}`}>
                      {task.completed ? 'Completed' : 'Created'} • {new Date(task.updatedAt || task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    task.completed 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {task.completed ? 'Done' : 'Active'}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}