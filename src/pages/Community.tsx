import { useEffect, useState } from 'react';
import { useStore } from '@/utils/store';
import { Link } from 'react-router-dom';

const Community = () => {
  const { user, posts, loadPosts, createPost, isLoading } = useStore();
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostTitle && newPostContent) {
      await createPost(newPostTitle, newPostContent);
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPostForm(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-4">You need to sign in</h2>
          <p className="text-lg text-indigo-700 mb-6">Please sign in to access the community</p>
          <Link to="/login" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const mockLeaderboard = [
    { id: '1', name: 'Sarah Johnson', points: 1250, rank: 1 },
    { id: '2', name: 'Michael Chen', points: 1120, rank: 2 },
    { id: '3', name: 'Emma Rodriguez', points: 980, rank: 3 },
    { id: '4', name: 'David Kim', points: 850, rank: 4 },
    { id: '5', name: 'Olivia Wang', points: 720, rank: 5 },
    { id: '6', name: 'James Wilson', points: 680, rank: 6 },
    { id: '7', name: 'Ava Brown', points: 550, rank: 7 },
    { id: '8', name: 'Ethan Davis', points: 420, rank: 8 },
    { id: '9', name: 'Sophia Garcia', points: 380, rank: 9 },
    { id: '10', name: 'Noah Martinez', points: 320, rank: 10 }
  ];

  const mockPosts = [
    {
      id: '1',
      user_id: '1',
      title: 'Tips for learning Japanese kanji',
      content: 'I\'ve been learning Japanese for 6 months now, and I\'ve found that using mnemonics has been really helpful for remembering kanji. Does anyone else have any tips?',
      created_at: '2024-02-10T14:30:00Z',
      likes: 24,
      user: { name: 'Sarah Johnson', avatar_url: '' }
    },
    {
      id: '2',
      user_id: '2',
      title: 'Looking for language exchange partners',
      content: 'I\'m looking for someone to practice Korean with. I\'m a native English speaker and intermediate in Korean. Let me know if you\'re interested!',
      created_at: '2024-02-09T09:15:00Z',
      likes: 18,
      user: { name: 'Michael Chen', avatar_url: '' }
    },
    {
      id: '3',
      user_id: '3',
      title: 'What\'s your favorite listening practice resource?',
      content: 'I\'m struggling with listening comprehension in Spanish. What resources do you all use to improve your listening skills?',
      created_at: '2024-02-08T16:45:00Z',
      likes: 15,
      user: { name: 'Emma Rodriguez', avatar_url: '' }
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
            <h1 className="text-2xl font-bold text-indigo-900">Community</h1>
            <div className="w-12"></div> {/* Placeholder for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discussion Forums */}
          <div className="lg:col-span-2">
            <section className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-indigo-900">Discussion Forums</h2>
                <button 
                  onClick={() => setShowNewPostForm(!showNewPostForm)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  {showNewPostForm ? 'Cancel' : 'New Post'}
                </button>
              </div>

              {showNewPostForm && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-6">
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                      <label htmlFor="post-title" className="block text-sm font-medium text-indigo-900 mb-1">
                        Title
                      </label>
                      <input
                        id="post-title"
                        name="post-title"
                        type="text"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-indigo-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="What would you like to discuss?"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="post-content" className="block text-sm font-medium text-indigo-900 mb-1">
                        Content
                      </label>
                      <textarea
                        id="post-content"
                        name="post-content"
                        rows={4}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-indigo-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Share your thoughts..."
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-6">
                {mockPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          {post.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-indigo-900">{post.user.name}</h3>
                          <p className="text-gray-400 text-xs">{new Date(post.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                        <span className="text-sm text-gray-500">{post.likes}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-indigo-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.content}</p>
                    <div className="flex justify-between items-center">
                      <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Comment
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Leaderboard */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6">Leaderboard</h2>
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-4 bg-indigo-600 text-white">
                  <h3 className="font-semibold">Top Learners</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {mockLeaderboard.map((entry) => (
                    <div key={entry.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${entry.rank <= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                          {entry.rank}
                        </div>
                        <span className="font-medium text-indigo-900">{entry.name}</span>
                      </div>
                      <span className="font-bold text-indigo-600">{entry.points} pts</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-gray-100 text-gray-600">
                        42
                      </div>
                      <span className="font-medium text-indigo-900">You</span>
                    </div>
                    <span className="font-bold text-indigo-600">120 pts</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Community Guidelines */}
            <section>
              <h2 className="text-2xl font-bold text-indigo-900 mb-6">Community Guidelines</h2>
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-indigo-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Be respectful and supportive of other learners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-indigo-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Share helpful resources and tips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-indigo-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ask questions and offer assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-indigo-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Keep discussions on-topic and relevant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-indigo-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Report any inappropriate content</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;