import React, { useEffect, useState } from 'react';
import { UniversityDetails, Program } from '../types';
import { GeminiService } from '../services/geminiService';
import { SupabaseService } from '../services/supabaseService';

interface UniversityDetailProps {
  university: UniversityDetails;
  onBack: () => void;
  onProgramClick: (program: Program) => void;
}

export const UniversityDetail: React.FC<UniversityDetailProps> = ({ university, onBack, onProgramClick }) => {
  const [mapInfo, setMapInfo] = useState<{ text: string, mapUrl: string | null } | null>(null);
  const [loadingMap, setLoadingMap] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const info = await GeminiService.getMapsInfo(university.name);
      setMapInfo(info);
      setLoadingMap(false);

      const saved = await SupabaseService.isSaved(university.name);
      setIsSaved(saved);
    };
    init();
  }, [university.name]);

  const handleToggleSave = async () => {
    setIsSaving(true);
    try {
      if (isSaved) {
        await SupabaseService.removeUniversity(university.name);
        setIsSaved(false);
      } else {
        await SupabaseService.saveUniversity(university);
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Failed to update repository", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-indigo-600 font-medium transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <button
          onClick={handleToggleSave}
          disabled={isSaving}
          className={`flex items-center px-6 py-2.5 rounded-2xl font-bold transition-all ${isSaved
            ? 'bg-rose-50 text-rose-600 border border-rose-100'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
            } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg className={`w-5 h-5 mr-2 ${isSaved ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {isSaving ? 'Updating...' : isSaved ? 'In Repository' : 'Save to Repository'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{university.name}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {university.type}
                  </span>
                  <span className="text-slate-500 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {university.location}, {university.country}
                  </span>
                  {university.worldRanking && (
                    <span className="text-amber-600 font-bold text-sm bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                      World Rank: #{university.worldRanking}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={university.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl font-bold hover:bg-indigo-100 transition-all text-center"
              >
                Visit Website
              </a>
            </div>

            <div className="prose prose-slate max-w-none">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About the University</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {university.description}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Classifications</h3>
              <div className="flex flex-wrap gap-2">
                {(university.classification || "").split(',').map((c, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-sm font-medium border border-slate-200">
                    {c.trim()}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Academic Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(university.programs || []).map((program, idx) => (
                <div
                  key={idx}
                  onClick={() => onProgramClick(program)}
                  className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {program.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 uppercase">
                      {program.degree}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-500">
                    <p className="flex justify-between">
                      <span className="font-medium">Faculty:</span>
                      <span>{program.faculty}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span>{program.duration}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Est. Tuition:</span>
                      <span className="text-indigo-600 font-bold">{program.tuitionEstimate}</span>
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    LEARN MORE →
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Location & Access</h2>
            {loadingMap ? (
              <div className="h-48 animate-pulse bg-slate-100 rounded-2xl flex items-center justify-center">
                <span className="text-slate-400">Loading map data...</span>
              </div>
            ) : mapInfo?.mapUrl ? (
              <div className="space-y-4">
                <div className="relative group overflow-hidden rounded-2xl aspect-video bg-slate-100">
                  <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors">
                    <svg className="w-12 h-12 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {mapInfo.text}
                </p>
                <a
                  href={mapInfo.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm"
                >
                  Open in Google Maps
                </a>
              </div>
            ) : (
              <p className="text-slate-400 text-sm italic">Map information unavailable.</p>
            )}

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Verified Sources</h3>
              <div className="space-y-3">
                {(university.sources || []).map((source, i) => (
                  <a
                    key={i}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
