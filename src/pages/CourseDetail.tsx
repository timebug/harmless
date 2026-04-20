import { useEffect } from 'react';
import { useStore } from '@/utils/store';
import { Link, useParams } from 'react-router-dom';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, courses, selectCourse, selectedCourse, isLoading } = useStore();

  useEffect(() => {
    if (courseId && courses.length > 0) {
      const course = courses.find(c => c.id === courseId);
      if (course) {
        selectCourse(course);
      }
    }
  }, [courseId, courses, selectCourse]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">You need to sign in</h2>
          <p className="text-lg text-indigo-700 mb-6">Please sign in to access this course</p>
          <Link to="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !selectedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Mock lessons data for demonstration
  const lessons = [
    {
      id: '1',
      title: 'Introduction to Basic Vocabulary',
      description: 'Learn essential words and phrases for everyday conversation',
      modules: [
        { id: '1', type: 'vocabulary', title: 'Greetings and Introductions' },
        { id: '2', type: 'grammar', title: 'Basic Sentence Structure' },
        { id: '3', type: 'oral', title: 'Pronunciation Practice' }
      ]
    },
    {
      id: '2',
      title: 'Everyday Conversations',
      description: 'Practice common dialogues for daily situations',
      modules: [
        { id: '4', type: 'listening', title: 'Ordering Food at a Restaurant' },
        { id: '5', type: 'vocabulary', title: 'Shopping and Numbers' },
        { id: '6', type: 'grammar', title: 'Present Tense Verbs' }
      ]
    },
    {
      id: '3',
      title: 'Travel and Transportation',
      description: 'Learn vocabulary and phrases for traveling',
      modules: [
        { id: '7', type: 'listening', title: 'At the Airport' },
        { id: '8', type: 'vocabulary', title: 'Directions and Locations' },
        { id: '9', type: 'oral', title: 'Asking for Help' }
      ]
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
            <h1 className="text-2xl font-bold text-indigo-900">Course Details</h1>
            <div className="w-12"></div> {/* Placeholder for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="h-64 bg-indigo-100 flex items-center justify-center">
              <span className="text-8xl">📚</span>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-indigo-900 mb-2">{selectedCourse.title}</h2>
                  <p className="text-gray-600">{selectedCourse.description}</p>
                </div>
                <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium self-start md:self-center">
                  {selectedCourse.level}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  {selectedCourse.language}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  {lessons.length} lessons
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  {lessons.reduce((acc, lesson) => acc + lesson.modules.length, 0)} modules
                </span>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Start Course
                </button>
                <button className="px-6 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Course Lessons */}
        <section>
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Lessons</h2>
          <div className="space-y-6">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-indigo-900">{lesson.title}</h3>
                      <p className="text-gray-600">{lesson.description}</p>
                    </div>
                  </div>
                  <div className="pl-14 space-y-3">
                    {lesson.modules.map((module) => (
                      <Link 
                        key={module.id} 
                        to={`/modules/${module.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          {module.type === 'vocabulary' && '📝'}
                          {module.type === 'grammar' && '📚'}
                          {module.type === 'oral' && '🎤'}
                          {module.type === 'listening' && '👂'}
                        </div>
                        <div>
                          <h4 className="font-medium text-indigo-900">{module.title}</h4>
                          <span className="text-xs text-gray-500">{module.type.charAt(0).toUpperCase() + module.type.slice(1)}</span>
                        </div>
                        <div className="ml-auto">
                          <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CourseDetail;