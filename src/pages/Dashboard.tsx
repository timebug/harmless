import { useEffect, useState } from 'react';
import { useStore } from '@/utils/store';
import { Link, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const { user, languages, courses, loadLanguages, loadCourses, selectedLanguage, isLoading } = useStore();
  const [selectedLangId, setSelectedLangId] = useState<string | null>(null);

  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const langId = params.get('language');
    if (langId) {
      setSelectedLangId(langId);
      loadCourses(langId);
    } else if (languages.length > 0 && !selectedLangId) {
      setSelectedLangId(languages[0].id);
      loadCourses(languages[0].id);
    }
  }, [location.search, languages, selectedLangId, loadCourses]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">You need to sign in</h2>
          <p className="text-lg text-indigo-700 mb-6">Please sign in to access your dashboard</p>
          <Link to="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-indigo-900 font-medium">Welcome, {user.name}</span>
              <Link to="/profile" className="text-indigo-600 hover:text-indigo-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Language Selection */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Select Language</h2>
          <div className="flex flex-wrap gap-4">
            {languages.map((language) => (
              <button
                key={language.id}
                onClick={() => {
                  setSelectedLangId(language.id);
                  loadCourses(language.id);
                }}
                className={`px-6 py-3 rounded-lg transition-colors ${selectedLangId === language.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-indigo-900 hover:bg-indigo-50 border border-indigo-100'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{language.flag}</span>
                  <span>{language.name}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Course Levels */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Course Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="group">
                  <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-indigo-900 group-hover:text-indigo-600 transition-colors">
                        {course.title}
                      </h3>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                        {course.level}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">12 lessons</span>
                      <span className="text-sm font-medium text-indigo-600">Start Learning</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : isLoading ? (
              <div className="col-span-3 flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                No courses available for this language
              </div>
            )}
          </div>
        </section>

        {/* Learning Path Visualization */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Your Learning Path</h2>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="relative">
              {/* Path line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-200"></div>
              
              {/* Path steps */}
              <div className="space-y-8">
                <div className="relative pl-12">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">1</div>
                  <h3 className="text-lg font-semibold text-indigo-900">Beginner Level</h3>
                  <p className="text-gray-600 mt-1">Master basic vocabulary and grammar</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Completed</span>
                    <span className="text-sm text-gray-500">100% complete</span>
                  </div>
                </div>
                
                <div className="relative pl-12">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">2</div>
                  <h3 className="text-lg font-semibold text-indigo-900">Intermediate Level</h3>
                  <p className="text-gray-600 mt-1">Build conversational skills and expand vocabulary</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">In Progress</span>
                    <span className="text-sm text-gray-500">60% complete</span>
                  </div>
                </div>
                
                <div className="relative pl-12">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">3</div>
                  <h3 className="text-lg font-semibold text-gray-500">Advanced Level</h3>
                  <p className="text-gray-400 mt-1">Develop fluency and cultural understanding</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Locked</span>
                    <span className="text-sm text-gray-400">0% complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-indigo-900">Completed Vocabulary Module</h3>
                  <p className="text-gray-600 text-sm">Finished learning 20 new words in the Intermediate level</p>
                  <p className="text-gray-400 text-xs mt-1">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-indigo-900">Practiced Listening Skills</h3>
                  <p className="text-gray-600 text-sm">Listened to 3 audio clips and answered comprehension questions</p>
                  <p className="text-gray-400 text-xs mt-1">Yesterday</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-indigo-900">Grammar Exercise Completed</h3>
                  <p className="text-gray-600 text-sm">Finished 15 grammar exercises with 85% accuracy</p>
                  <p className="text-gray-400 text-xs mt-1">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;