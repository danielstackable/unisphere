
import React from 'react';
import { University } from '../types';

interface UniversityCardProps {
  university: University;
  onClick: (university: University) => void;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ university, onClick }) => {
  return (
    <div 
      onClick={() => onClick(university)}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
    >
      <div className="h-40 bg-gradient-to-br from-indigo-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${university.type === 'Public' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
            {university.type}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-2xl font-bold text-indigo-600 group-hover:scale-110 transition-transform">
                {university.name.charAt(0)}
            </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {university.name}
        </h3>
        <p className="text-slate-500 text-sm mb-3 flex items-center">
          <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {university.location}, {university.country}
        </p>
        <div className="mb-4">
            <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                {university.classification}
            </span>
        </div>
        <button className="w-full py-2.5 bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
          View Programs
        </button>
      </div>
    </div>
  );
};
