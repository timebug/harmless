import { useEffect } from 'react';
import { useStore } from '@/utils/store';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user, languages, courses, loadLanguages, isLoading } = useStore();

  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-900 mb-6">
            Learn Languages Immersively
          </h1>
          <p className="text-xl md:text-2xl text-indigo-700 mb-10 max-w-3xl mx-auto">
            Master English, Japanese, Korean, and more with interactive lessons and a supportive community
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link to="/dashboard" className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Continue Learning
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-8 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Language Selection */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-indigo-900 mb-12">Choose Your Language</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {languages.length > 0 ? (
              languages.map((language) => (
                <Link 
                  key={language.id} 
                  to={`/dashboard?language=${language.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-md p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
                    <div className="text-4xl mb-4">{language.flag}</div>
                    <h3 className="text-xl font-semibold text-indigo-900 group-hover:text-indigo-600 transition-colors">
                      {language.name}
                    </h3>
                  </div>
                </Link>
              ))
            ) : isLoading ? (
              <div className="col-span-4 flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="col-span-4 text-center py-12 text-gray-500">
                No languages available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-indigo-900 mb-12">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.length > 0 ? (
              courses.slice(0, 3).map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="group">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="h-48 bg-indigo-100 flex items-center justify-center">
                      <span className="text-6xl">📚</span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-indigo-900 group-hover:text-indigo-600 transition-colors mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-indigo-600">{course.level}</span>
                        <span className="text-sm text-gray-500">Beginner</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                No courses available
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Progress Overview (for logged-in users) */}
      {user && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-indigo-900 mb-12">Your Learning Progress</h2>
            <div className="bg-indigo-50 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-2">Courses Enrolled</h3>
                  <p className="text-3xl font-bold text-indigo-600">3</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-2">Modules Completed</h3>
                  <p className="text-3xl font-bold text-indigo-600">12</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-2">Learning Streak</h3>
                  <p className="text-3xl font-bold text-indigo-600">7 days</p>
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <Link to="/progress" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  View Detailed Progress
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Language Journey?</h2>
          <p className="text-xl mb-10">Join thousands of learners who are mastering new languages every day</p>
          {user ? (
            <Link to="/dashboard" className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Continue Learning
            </Link>
          ) : (
            <Link to="/register" className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Get Started for Free
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;