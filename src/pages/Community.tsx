import { Trophy, Medal, Award, Star } from 'lucide-react';

export default function Community() {
  const leaderboard = [
    { name: 'Sarah Jenkins', xp: 12450, rank: 1, avatar: 'SJ' },
    { name: 'Ken Matsuda', xp: 11200, rank: 2, avatar: 'KM' },
    { name: 'Elena R.', xp: 10500, rank: 3, avatar: 'ER' },
    { name: 'David Kim', xp: 9800, rank: 4, avatar: 'DK' },
    { name: 'You', xp: 1450, rank: 142, avatar: 'ME' },
  ];

  const achievements = [
    { title: 'First Steps', desc: 'Complete your first lesson', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-100', unlocked: true },
    { title: '7 Day Streak', desc: 'Learn for 7 consecutive days', icon: FlameIcon, color: 'text-orange-500', bg: 'bg-orange-100', unlocked: true },
    { title: 'Vocab Master', desc: 'Learn 500 words', icon: BookOpenIcon, color: 'text-emerald-500', bg: 'bg-emerald-100', unlocked: false },
    { title: 'Perfect Pitch', desc: 'Score 100% in shadowing', icon: MicIcon, color: 'text-purple-500', bg: 'bg-purple-100', unlocked: false },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Community & Achievements</h1>
        <p className="text-xl text-slate-600">Compete with friends and earn badges along your journey.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Leaderboard */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Medal className="h-7 w-7 text-indigo-600" />
              Global Leaderboard
            </h2>
            <select className="bg-slate-50 border-none text-sm font-medium rounded-xl px-4 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500">
              <option>This Week</option>
              <option>All Time</option>
            </select>
          </div>

          <div className="space-y-4">
            {leaderboard.map((user) => (
              <div 
                key={user.rank} 
                className={`flex items-center p-4 rounded-2xl transition-colors ${
                  user.name === 'You' ? 'bg-indigo-600 text-white shadow-md transform scale-[1.02]' : 'bg-slate-50 hover:bg-slate-100 text-slate-900'
                }`}
              >
                <div className={`w-8 font-bold text-lg text-center ${user.name === 'You' ? 'text-indigo-200' : user.rank <= 3 ? 'text-amber-500' : 'text-slate-400'}`}>
                  {user.rank}
                </div>
                <div className="flex-1 flex items-center gap-4 ml-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${user.name === 'You' ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-700'}`}>
                    {user.avatar}
                  </div>
                  <span className="font-bold text-lg">{user.name}</span>
                </div>
                <div className="font-bold text-lg">
                  {user.xp.toLocaleString()} <span className={`text-sm ${user.name === 'You' ? 'text-indigo-200' : 'text-slate-500'}`}>XP</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Award className="h-7 w-7 text-indigo-600" />
            Your Badges
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {achievements.map((ach, idx) => {
              const Icon = ach.icon;
              return (
                <div key={idx} className={`p-6 rounded-3xl border ${ach.unlocked ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-transparent opacity-60 grayscale'}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${ach.unlocked ? ach.bg : 'bg-slate-200'}`}>
                    <Icon className={`h-7 w-7 ${ach.unlocked ? ach.color : 'text-slate-400'}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{ach.title}</h3>
                  <p className="text-sm text-slate-500">{ach.desc}</p>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

// Temporary inline icons to avoid extra imports while developing
function FlameIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>; }
function BookOpenIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>; }
function MicIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>; }