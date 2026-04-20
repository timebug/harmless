import { useState, useEffect } from 'react';
import { useStore } from '@/utils/store';
import { Link, useParams } from 'react-router-dom';

const ModuleDetail = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user, updateProgress, isLoading } = useStore();
  const [module, setModule] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  // Mock module data based on moduleId
  useEffect(() => {
    if (moduleId) {
      // Mock data for different module types
      const mockModules: { [key: string]: any } = {
        '1': {
          id: '1',
          type: 'vocabulary',
          title: 'Greetings and Introductions',
          content: {
            words: [
              { id: '1', word: 'Hello', translation: 'こんにちは', pronunciation: 'Konnichiwa' },
              { id: '2', word: 'Goodbye', translation: 'さようなら', pronunciation: 'Sayonara' },
              { id: '3', word: 'Thank you', translation: 'ありがとう', pronunciation: 'Arigatou' },
              { id: '4', word: 'Yes', translation: 'はい', pronunciation: 'Hai' },
              { id: '5', word: 'No', translation: 'いいえ', pronunciation: 'Iie' }
            ]
          }
        },
        '2': {
          id: '2',
          type: 'grammar',
          title: 'Basic Sentence Structure',
          content: {
            exercises: [
              {
                id: '1',
                question: 'Complete the sentence: I ___ a student',
                options: ['am', 'is', 'are', 'be'],
                correctAnswer: 'am'
              },
              {
                id: '2',
                question: 'Choose the correct form: She ___ to school every day',
                options: ['go', 'goes', 'going', 'went'],
                correctAnswer: 'goes'
              },
              {
                id: '3',
                question: 'Fill in the blank: They ___ watching a movie',
                options: ['is', 'are', 'am', 'be'],
                correctAnswer: 'are'
              }
            ]
          }
        },
        '3': {
          id: '3',
          type: 'oral',
          title: 'Pronunciation Practice',
          content: {
            phrases: [
              { id: '1', phrase: 'Nice to meet you', pronunciation: 'Hajimemashite' },
              { id: '2', phrase: 'How are you?', pronunciation: 'Ogenkidesuka?' },
              { id: '3', phrase: 'I am fine', pronunciation: 'Genkidesu' }
            ]
          }
        },
        '4': {
          id: '4',
          type: 'listening',
          title: 'Ordering Food at a Restaurant',
          content: {
            audioClips: [
              {
                id: '1',
                audioUrl: 'https://example.com/audio1.mp3',
                transcript: 'Waiter: Welcome to our restaurant. What would you like to order?',
                questions: [
                  {
                    id: '1',
                    question: 'Who is speaking?',
                    options: ['A customer', 'A waiter', 'A chef', 'A manager'],
                    correctAnswer: 'A waiter'
                  }
                ]
              },
              {
                id: '2',
                audioUrl: 'https://example.com/audio2.mp3',
                transcript: 'Customer: I would like a hamburger and fries, please.',
                questions: [
                  {
                    id: '1',
                    question: 'What does the customer want?',
                    options: ['Pizza', 'Hamburger and fries', 'Salad', 'Soup'],
                    correctAnswer: 'Hamburger and fries'
                  }
                ]
              }
            ]
          }
        }
      };

      setModule(mockModules[moduleId] || null);
    }
  }, [moduleId]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    if (!module) return;

    let newScore = 0;
    if (module.type === 'grammar') {
      module.content.exercises.forEach((exercise: any) => {
        if (answers[exercise.id] === exercise.correctAnswer) {
          newScore++;
        }
      });
      setScore(newScore);
    } else if (module.type === 'listening') {
      module.content.audioClips.forEach((clip: any) => {
        clip.questions.forEach((question: any) => {
          if (answers[question.id] === question.correctAnswer) {
            newScore++;
          }
        });
      });
      setScore(newScore);
    } else {
      // For vocabulary and oral modules, we'll just mark them as completed
      newScore = 100;
      setScore(newScore);
    }

    setCompleted(true);
    if (user) {
      updateProgress(module.id, true, newScore);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">You need to sign in</h2>
          <p className="text-lg text-indigo-700 mb-6">Please sign in to access this module</p>
          <Link to="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/courses/1" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Course</span>
            </Link>
            <h1 className="text-2xl font-bold text-indigo-900">{module.title}</h1>
            <div className="w-12"></div> {/* Placeholder for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Content */}
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {completed ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-indigo-900 mb-2">Congratulations!</h2>
              <p className="text-gray-600 mb-6">You've completed this module</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-indigo-600">{score}</span>
                <span className="text-xl text-indigo-600">/100</span>
              </div>
              <Link to="/courses/1" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Back to Course
              </Link>
            </div>
          ) : (
            <>
              {module.type === 'vocabulary' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-indigo-900 mb-6">Vocabulary Practice</h2>
                  <div className="space-y-4">
                    {module.content.words.map((word: any) => (
                      <div key={word.id} className="bg-indigo-50 rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-indigo-900">{word.word}</h3>
                            <p className="text-gray-600">{word.translation}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">{word.pronunciation}</span>
                            <button className="p-2 bg-indigo-100 rounded-full text-indigo-600 hover:bg-indigo-200 transition-colors">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Complete Module
                    </button>
                  </div>
                </div>
              )}

              {module.type === 'grammar' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-indigo-900 mb-6">Grammar Exercises</h2>
                  <div className="space-y-6">
                    {module.content.exercises.map((exercise: any, index: number) => (
                      <div key={exercise.id} className="bg-indigo-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-indigo-900 mb-4">Exercise {index + 1}</h3>
                        <p className="text-gray-900 mb-4">{exercise.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {exercise.options.map((option: string, optionIndex: number) => (
                            <button
                              key={optionIndex}
                              onClick={() => handleAnswer(exercise.id, option)}
                              className={`p-3 rounded-lg transition-colors ${answers[exercise.id] === option
                                ? 'bg-indigo-200 text-indigo-900'
                                : 'bg-white text-gray-900 hover:bg-indigo-100'
                                }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Submit Answers
                    </button>
                  </div>
                </div>
              )}

              {module.type === 'oral' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-indigo-900 mb-6">Pronunciation Practice</h2>
                  <div className="space-y-4">
                    {module.content.phrases.map((phrase: any) => (
                      <div key={phrase.id} className="bg-indigo-50 rounded-lg p-4">
                        <h3 className="text-xl font-semibold text-indigo-900 mb-2">{phrase.phrase}</h3>
                        <p className="text-gray-600 mb-4">Pronunciation: {phrase.pronunciation}</p>
                        <div className="flex gap-4">
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            Listen
                          </button>
                          <button className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center gap-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            Record
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Complete Module
                    </button>
                  </div>
                </div>
              )}

              {module.type === 'listening' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-indigo-900 mb-6">Listening Comprehension</h2>
                  <div className="space-y-6">
                    {module.content.audioClips.map((clip: any, index: number) => (
                      <div key={clip.id} className="bg-indigo-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-indigo-900 mb-4">Audio Clip {index + 1}</h3>
                        <div className="mb-4">
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Play Audio
                          </button>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Transcript:</h4>
                          <p className="text-gray-600 bg-white p-3 rounded-lg">{clip.transcript}</p>
                        </div>
                        <div className="space-y-4">
                          {clip.questions.map((question: any) => (
                            <div key={question.id}>
                              <p className="text-gray-900 mb-3">{question.question}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {question.options.map((option: string, optionIndex: number) => (
                                  <button
                                    key={optionIndex}
                                    onClick={() => handleAnswer(question.id, option)}
                                    className={`p-3 rounded-lg transition-colors ${answers[question.id] === option
                                      ? 'bg-indigo-200 text-indigo-900'
                                      : 'bg-white text-gray-900 hover:bg-indigo-100'
                                      }`}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={handleSubmit}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Submit Answers
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default ModuleDetail;