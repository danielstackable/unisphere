
import React, { useState } from 'react';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="relative bg-white pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
      <div className="absolute inset-0">
        <div className="bg-slate-50 h-1/3 sm:h-2/3" />
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl tracking-tight font-extrabold text-slate-900 sm:text-5xl">
            Find Your Future University
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-500 sm:mt-4">
            A comprehensive repository of world-class institutions and their academic offerings, classified by industry standards.
          </p>
          
          <form onSubmit={handleSubmit} className="mt-8 flex justify-center max-w-xl mx-auto">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, city, or discipline..."
                className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-2xl leading-5 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`ml-3 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-2xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Search'}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['Ivy League', 'Top Engineering', 'Affordable Public', 'Europe Business'].map((tag) => (
              <button
                key={tag}
                onClick={() => { setQuery(tag); onSearch(tag); }}
                className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
