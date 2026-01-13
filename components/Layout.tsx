
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  view: 'explorer' | 'repository';
  setView: (view: 'explorer' | 'repository') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, view, setView }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">UniSphere</span>
            </div>
            
            <nav className="hidden md:flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setView('explorer')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === 'explorer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                AI Explorer
              </button>
              <button 
                onClick={() => setView('repository')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === 'repository' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                My Repository
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">U</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-white">UniSphere</span>
              </div>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                Empowering students and researchers with the world's most intelligent university repository.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4">Repository</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Top Universities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">MBA Programs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Engineering Schools</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
            © {new Date().getFullYear()} UniSphere AI. Powered by Gemini & Supabase.
          </div>
        </div>
      </footer>
    </div>
  );
};
