import { Link } from 'react-router-dom';
import { Globe2, BookOpen, Trophy, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pb-32 pt-24 lg:pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white"></div>
        <div className="container mx-auto px-4 text-center">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
            Master languages <span className="relative whitespace-nowrap text-indigo-600">
              <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute left-0 top-2/3 h-[0.58em] w-full fill-indigo-200/70" preserveAspectRatio="none"><path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path></svg>
              <span className="relative">naturally</span>
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-600">
            Immerse yourself in English, Japanese, Korean, and more. Our leveled courses and interactive modules make learning effective and engaging.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Link to="/courses" className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 hover:scale-105">
              Start Learning Now
            </Link>
            <Link to="/login" className="rounded-full px-8 py-3.5 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all duration-200">
              View Curriculum
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to reach fluency</h2>
            <p className="mt-4 text-lg text-slate-600">A comprehensive platform designed for modern language learners.</p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                  <Globe2 className="h-8 w-8 text-indigo-600" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-slate-900">Leveled Courses</dt>
                <dd className="mt-1 text-base leading-7 text-slate-600">Structured paths from beginner to advanced in multiple languages.</dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <BookOpen className="h-8 w-8 text-emerald-600" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-slate-900">Interactive Modules</dt>
                <dd className="mt-1 text-base leading-7 text-slate-600">Vocabulary, grammar, oral shadowing, and listening exercises.</dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <Trophy className="h-8 w-8 text-amber-600" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-slate-900">Progress Tracking</dt>
                <dd className="mt-1 text-base leading-7 text-slate-600">Visual insights into your learning streaks and achievements.</dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
                  <Users className="h-8 w-8 text-pink-600" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-slate-900">Active Community</dt>
                <dd className="mt-1 text-base leading-7 text-slate-600">Join leaderboards, share milestones, and practice together.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
