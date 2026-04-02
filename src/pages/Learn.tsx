import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Volume2, Mic, CheckCircle2 } from 'lucide-react';

export default function Learn() {
  const { moduleId } = useParams();
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-4 sticky top-0 z-10">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
            <ChevronLeft className="h-6 w-6 mr-1" />
            <span className="font-medium">Back</span>
          </Link>
          <div className="flex-1 mx-8">
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
          <div className="font-bold text-slate-400">3 / 10</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl px-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-2xl text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Learn new vocabulary</h2>
          <p className="text-slate-500 mt-2">Listen and repeat the word below.</p>
        </div>

        {/* Flashcard */}
        <div 
          className={`w-full max-w-2xl h-80 relative preserve-3d cursor-pointer transition-transform duration-500 ${flipped ? 'rotate-y-180' : ''}`}
          onClick={() => setFlipped(!flipped)}
          style={{ perspective: '1000px' }}
        >
          {/* Front */}
          <div className={`absolute inset-0 w-full h-full bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center justify-center backface-hidden ${flipped ? 'hidden' : 'block'}`}>
            <button 
              className="absolute top-6 right-6 p-3 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              onClick={(e) => { e.stopPropagation(); /* Play audio */ }}
            >
              <Volume2 className="h-6 w-6" />
            </button>
            <h1 className="text-6xl font-bold text-slate-900 mb-4">ありがとう</h1>
            <p className="text-xl text-slate-400 font-medium">Arigatou</p>
          </div>

          {/* Back */}
          <div className={`absolute inset-0 w-full h-full bg-indigo-600 text-white rounded-3xl shadow-lg flex flex-col items-center justify-center backface-hidden ${!flipped ? 'hidden' : 'block'}`} style={{ transform: 'rotateY(180deg)' }}>
            <h1 className="text-5xl font-bold mb-4">Thank you</h1>
            <p className="text-xl text-indigo-200 font-medium">Used to express gratitude.</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-12 flex items-center gap-6">
          <button className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-white border-2 border-slate-200 text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all">
            <Mic className="h-8 w-8 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Record</span>
          </button>
          
          <button className="bg-indigo-600 text-white font-bold text-lg px-12 py-4 rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-2">
            Got it <CheckCircle2 className="h-6 w-6" />
          </button>
        </div>
      </main>
    </div>
  );
}