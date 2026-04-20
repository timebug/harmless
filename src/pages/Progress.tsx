import { useEffect } from 'react';
import { useStore } from '@/utils/store';
import { Link } from 'react-router-dom';

const Progress = () => {
  const { user, progress, achievements, loadProgress, loadAchievements, isLoading } = useStore();

  useEffect(() => {
    if (user) {
      loadProgress();
      loadAchievements();
    }
  }, [user, loadProgress, loadAchievements]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">You need to sign in</h2>
          <p className="text-lg text-indigo-700 mb-6">Please sign in to view your progress</p>
          <Link to="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const statistics = {
    totalTimeSpent: 1250,
    completedModules: 45,
    streak: 7,
    totalCourses: 3,
    averageScore: 85
  };

  const recentActivities = [
    {
      id: '1',
      activity: 'Completed Vocabulary Module',
      course: 'Japanese Intermediate',
      date: '2 hours ago',
      score: 90
    },
    {
      id: '2',
      activity: 'Practiced Listening Skills',
      course: 'English Advanced',
      date: 'Yesterday',
      score: 75
    },
    {
      id: '3',
      activity: 'Grammar Exercise Completed',
      course: 'Korean Beginner',
      date: '2 days ago',
      score: 85
    }
  ];

  const mockAchievements = [
    {
      id: '1',
      name: 'First Step',
      description: 'Complete your first module',
      icon: '🎯',
      unlockedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Vocabulary Master',
      description: 'Learn 50 new words',
      icon: '📝',
      unlockedAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Listening Pro',
      description: 'Complete 10 listening exercises',
      icon: '👂',
      unlockedAt: '2024-01-25'
    },
    {
      id: '4',
      name: 'Grammar Guru',
      description: 'Score 90+ on 5 grammar quizzes',
      icon: '📚',
      unlockedAt: '2024-02-01'
    },
    {
      id: '5',
      name: '7-Day Streak',
      description: 'Learn for 7 consecutive days',
      icon: '🔥',
      unlockedAt: '2024-02-07'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold text-indigo-900">Your Learning Progress</h1>
            <div className="w-12"></div> {/* Placeholder for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Dashboard */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Learning Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Time Spent</h3>
              <p className="text-3xl font-bold text-indigo-600">{Math.floor(statistics.totalTimeSpent / 60)}h {statistics.totalTimeSpent % 60}m</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Modules Completed</h3>
              <p className="text-3xl font-bold text-indigo-600">{statistics.completedModules}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Current Streak</h3>
              <p className="text-3xl font-bold text-indigo-600">{statistics.streak} days</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Courses Enrolled</h3>
              <p className="text-3xl font-bold text-indigo-600">{statistics.totalCourses}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Average Score</h3>
              <p className="text-3xl font-bold text-indigo-600">{statistics.averageScore}%</p>
            </div>
          </div>
        </section>

        {/* Progress Chart */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Progress Over Time</h2>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="h-64 bg-indigo-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Progress chart placeholder</p>
            </div>
          </div>
        </section>

        {/* Recent Activities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Recent Activities</h2>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-indigo-900">{activity.activity}</h3>
                      <p className="text-gray-600 text-sm">{activity.course}</p>
                      <p className="text-gray-400 text-xs mt-1">{activity.date}</p>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {activity.score}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {mockAchievements.map((achievement) => (
              <div key={achievement.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center">
                <div className="text-4xl mb-4">{achievement.icon}</div>
                <h3 className="font-semibold text-indigo-900 mb-2">{achievement.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>
                <p className="text-gray-400 text-xs">Unlocked on {achievement.unlockedAt}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Progress;