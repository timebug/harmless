import { useState } from 'react';
import { useStore } from '@/utils/store';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout, isLoading } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [learningGoals, setLearningGoals] = useState(user?.learning_goals || '');
  const [languagePreferences, setLanguagePreferences] = useState<string[]>(user?.language_preferences || []);

  const handleLogout = async () => {
    await logout();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the user profile in the database
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">You need to sign in</h2>
          <p className="text-lg text-indigo-700 mb-6">Please sign in to view your profile</p>
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
            <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold text-indigo-900">Your Profile</h1>
            <div className="w-12"></div> {/* Placeholder for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="h-32 bg-indigo-600"></div>
            <div className="px-6 py-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-4xl -mt-16">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-indigo-900">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-4 flex gap-3">
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Form */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-indigo-900 mb-6">Personal Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-indigo-900 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'} placeholder-gray-500 text-indigo-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-indigo-900 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-200 bg-gray-50 placeholder-gray-500 text-indigo-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
                </div>
              </div>

              <div>
                <label htmlFor="learning-goals" className="block text-sm font-medium text-indigo-900 mb-1">
                  Learning Goals
                </label>
                <textarea
                  id="learning-goals"
                  name="learning-goals"
                  rows={4}
                  value={learningGoals}
                  onChange={(e) => setLearningGoals(e.target.value)}
                  disabled={!isEditing}
                  className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'} placeholder-gray-500 text-indigo-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="What are your language learning goals?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-900 mb-3">
                  Language Preferences
                </label>
                <div className="flex flex-wrap gap-3">
                  {['English', 'Japanese', 'Korean', 'Spanish', 'French', 'German'].map((language) => (
                    <div key={language} className="flex items-center">
                      <input
                        id={`language-${language}`}
                        name="languages"
                        type="checkbox"
                        checked={languagePreferences.includes(language)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLanguagePreferences([...languagePreferences, language]);
                          } else {
                            setLanguagePreferences(languagePreferences.filter(lang => lang !== language));
                          }
                        }}
                        disabled={!isEditing}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`language-${language}`} className="ml-2 block text-sm text-indigo-900">
                        {language}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Account Settings */}
        <section>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-indigo-900 mb-6">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-indigo-900">Change Password</h3>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
                <button className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                  Change
                </button>
              </div>
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-indigo-900">Notification Preferences</h3>
                  <p className="text-sm text-gray-600">Manage email and app notifications</p>
                </div>
                <button className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                  Manage
                </button>
              </div>
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-indigo-900">Delete Account</h3>
                  <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                </div>
                <button className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;