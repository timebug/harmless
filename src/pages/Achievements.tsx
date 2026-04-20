import { useEffect } from 'react';
import { useStore } from '@/utils/store';
import { Link } from 'react-router-dom';

const Achievements = () => {
  const { user, achievements, loadAchievements, isLoading } = useStore();

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user, loadAchievements]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">You need to sign in</h2>
          <p className="text-lg text-indigo-700 mb-6">Please sign in to view your achievements</p>
          <Link to="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Mock data for all achievements
  const allAchievements = [
    {
      id: '1',
      name: 'First Step',
      description: 'Complete your first module',
      icon: '🎯',
      rarity: 'Common',
      unlocked: true,
      unlockedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Vocabulary Master',
      description: 'Learn 50 new words',
      icon: '📝',
      rarity: 'Uncommon',
      unlocked: true,
      unlockedAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Listening Pro',
      description: 'Complete 10 listening exercises',
      icon: '👂',
      rarity: 'Uncommon',
      unlocked: true,
      unlockedAt: '2024-01-25'
    },
    {
      id: '4',
      name: 'Grammar Guru',
      description: 'Score 90+ on 5 grammar quizzes',
      icon: '📚',
      rarity: 'Rare',
      unlocked: true,
      unlockedAt: '2024-02-01'
    },
    {
      id: '5',
      name: '7-Day Streak',
      description: 'Learn for 7 consecutive days',
      icon: '🔥',
      rarity: 'Rare',
      unlocked: true,
      unlockedAt: '2024-02-07'
    },
    {
      id: '6',
      name: 'Polyglot',
      description: 'Learn 3 different languages',
      icon: '🌍',
      rarity: 'Epic',
      unlocked: false
    },
    {
      id: '7',
      name: 'Perfect Score',
      description: 'Score 100% on a module',
      icon: '💯',
      rarity: 'Epic',
      unlocked: false
    },
    {
      id: '8',
      name: 'Community Helper',
      description: 'Answer 10 community questions',
      icon: '🤝',
      rarity: 'Rare',
      unlocked: false
    },
    {
      id: '9',
      name: '30-Day Streak',
      description: 'Learn for 30 consecutive days',
      icon: '⭐',
      rarity: 'Legendary',
      unlocked: false
    },
    {
      id: '10',
      name: 'Fluency Master',
      description: 'Complete all advanced modules in a language',
      icon: '🏆',
      rarity: 'Legendary',
      unlocked: false
    }
  ];

  // Group achievements by rarity
  const groupedAchievements = allAchievements.reduce((groups, achievement) => {
    const rarity = achievement.rarity;
    if (!groups[rarity]) {
      groups[rarity] = [];
    }
    groups[rarity].push(achievement);
    return groups;
  }, {} as Record<string, typeof allAchievements>);

  // Calculate statistics
  const totalAchievements = allAchievements.length;
  const unlockedAchievements = allAchievements.filter(a => a.unlocked).length;
  const completionPercentage = Math.round((unlockedAchievements / totalAchievements) * 100);

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
            <h1 className="text-2xl font-bold text-indigo-900">Achievements</h1>
            <div className="w-12"></div> {/* Placeholder for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Achievement Statistics */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold text-indigo-900 mb-2">Your Achievement Progress</h2>
                <p className="text-gray-600">{unlockedAchievements} out of {totalAchievements} achievements unlocked</p>
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-indigo-900">Completion</span>
                  <span className="text-sm font-medium text-indigo-600">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements by Rarity */}
        <section>
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">All Achievements</h2>
          <div className="space-y-8">
            {/* Legendary */}
            <div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                Legendary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {groupedAchievements['Legendary']?.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`rounded-xl border ${achievement.unlocked ? 'bg-white shadow-md border-gray-100' : 'bg-gray-50 border-gray-200'} overflow-hidden transition-all duration-300`}
                  >
                    <div className={`h-3 ${achievement.unlocked ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                    <div className="p-6">
                      <div className="text-4xl mb-4">{achievement.icon}</div>
                      <h4 className={`font-semibold mb-2 ${achievement.unlocked ? 'text-indigo-900' : 'text-gray-500'}`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-sm mb-4 ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && (
                        <p className="text-xs text-gray-400">
                          Unlocked on {achievement.unlockedAt}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Epic */}
            <div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">💎</span>
                Epic
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {groupedAchievements['Epic']?.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`rounded-xl border ${achievement.unlocked ? 'bg-white shadow-md border-gray-100' : 'bg-gray-50 border-gray-200'} overflow-hidden transition-all duration-300`}
                  >
                    <div className={`h-3 ${achievement.unlocked ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                    <div className="p-6">
                      <div className="text-4xl mb-4">{achievement.icon}</div>
                      <h4 className={`font-semibold mb-2 ${achievement.unlocked ? 'text-indigo-900' : 'text-gray-500'}`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-sm mb-4 ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && (
                        <p className="text-xs text-gray-400">
                          Unlocked on {achievement.unlockedAt}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rare */}
            <div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔷</span>
                Rare
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {groupedAchievements['Rare']?.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`rounded-xl border ${achievement.unlocked ? 'bg-white shadow-md border-gray-100' : 'bg-gray-50 border-gray-200'} overflow-hidden transition-all duration-300`}
                  >
                    <div className={`h-3 ${achievement.unlocked ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className="p-6">
                      <div className="text-4xl mb-4">{achievement.icon}</div>
                      <h4 className={`font-semibold mb-2 ${achievement.unlocked ? 'text-indigo-900' : 'text-gray-500'}`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-sm mb-4 ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && (
                        <p className="text-xs text-gray-400">
                          Unlocked on {achievement.unlockedAt}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Uncommon */}
            <div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Uncommon
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {groupedAchievements['Uncommon']?.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`rounded-xl border ${achievement.unlocked ? 'bg-white shadow-md border-gray-100' : 'bg-gray-50 border-gray-200'} overflow-hidden transition-all duration-300`}
                  >
                    <div className={`h-3 ${achievement.unlocked ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="p-6">
                      <div className="text-4xl mb-4">{achievement.icon}</div>
                      <h4 className={`font-semibold mb-2 ${achievement.unlocked ? 'text-indigo-900' : 'text-gray-500'}`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-sm mb-4 ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && (
                        <p className="text-xs text-gray-400">
                          Unlocked on {achievement.unlockedAt}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common */}
            <div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📌</span>
                Common
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {groupedAchievements['Common']?.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`rounded-xl border ${achievement.unlocked ? 'bg-white shadow-md border-gray-100' : 'bg-gray-50 border-gray-200'} overflow-hidden transition-all duration-300`}
                  >
                    <div className={`h-3 ${achievement.unlocked ? 'bg-gray-500' : 'bg-gray-300'}`}></div>
                    <div className="p-6">
                      <div className="text-4xl mb-4">{achievement.icon}</div>
                      <h4 className={`font-semibold mb-2 ${achievement.unlocked ? 'text-indigo-900' : 'text-gray-500'}`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-sm mb-4 ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && (
                        <p className="text-xs text-gray-400">
                          Unlocked on {achievement.unlockedAt}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Achievements;