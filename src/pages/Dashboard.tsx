import { Link } from 'react-router-dom';
import { Flame, Star, BookOpen, Clock, Target } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, Learner!</h1>
          <p className="text-slate-600 mt-1">Ready to continue your language journey?</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-bold text-slate-700">12 Day Streak</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <Star className="h-5 w-5 text-amber-500" />
            <span className="font-bold text-slate-700">1,450 XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personalized Path */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Target className="h-6 w-6 text-indigo-600" />
              Up Next for You
            </h2>
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-2 uppercase tracking-wider">Vocabulary</span>
                  <h3 className="text-xl font-bold text-slate-900">Travel Essentials</h3>
                  <p className="text-slate-600 mt-1">Learn 20 new words for your next trip to Tokyo.</p>
                </div>
                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-600 font-bold">
                  JP
                </div>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-2.5 mb-6">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <Link to="/learn/vocab-1" className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
                Continue Lesson
              </Link>
            </div>
          </section>

          {/* Recent Courses */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Courses</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'Japanese A1', progress: 80, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
                { title: 'Korean Basics', progress: 30, color: 'bg-rose-500', bg: 'bg-rose-50' }
              ].map((course, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-indigo-100 transition-colors cursor-pointer">
                  <div className={`w-14 h-14 ${course.bg} rounded-xl flex items-center justify-center`}>
                    <BookOpen className={`h-6 w-6 ${course.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{course.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className={`${course.color} h-1.5 rounded-full`} style={{ width: `${course.progress}%` }}></div>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{course.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Daily Goals */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6 text-indigo-600" />
              Daily Goals
            </h2>
            <div className="space-y-4">
              {[
                { task: 'Complete 1 Lesson', done: true },
                { task: 'Review 50 flashcards', done: false },
                { task: '5 minutes shadowing', done: false }
              ].map((goal, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${goal.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                    {goal.done && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                  </div>
                  <span className={`text-sm font-medium ${goal.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{goal.task}</span>
                </div>
              ))}
            </div>
          </section>
          
          {/* Leaderboard Snippet */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
              Leaderboard
              <Link to="/community" className="text-sm font-medium text-indigo-600 hover:underline">View All</Link>
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Sarah J.', xp: 2450, rank: 1 },
                { name: 'You', xp: 1450, rank: 2 },
                { name: 'Ken M.', xp: 1200, rank: 3 }
              ].map((user, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${user.name === 'You' ? 'bg-indigo-50 border border-indigo-100' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold w-4 text-center ${user.rank === 1 ? 'text-amber-500' : 'text-slate-400'}`}>{user.rank}</span>
                    <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                    <span className={`font-medium ${user.name === 'You' ? 'text-indigo-700' : 'text-slate-700'}`}>{user.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-500">{user.xp} XP</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}