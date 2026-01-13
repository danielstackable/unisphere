
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SearchHero } from './components/SearchHero';
import { UniversityCard } from './components/UniversityCard';
import { UniversityDetail } from './components/UniversityDetail';
import { ProgramDetail } from './components/ProgramDetail';
import { University, UniversityDetails, Program, ProgramDetails } from './types';
import { GeminiService } from './services/geminiService';
import { SupabaseService } from './services/supabaseService';

const App: React.FC = () => {
  const [view, setView] = useState<'explorer' | 'repository'>('explorer');
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityDetails | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<ProgramDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (view === 'explorer') {
      handleSearch("Top ranked universities globally");
    } else {
      if (SupabaseService.isConfigured()) {
        loadRepository();
      } else {
        setError("Supabase backend is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.");
        setUniversities([]);
      }
    }
  }, [view]);

  const loadRepository = async () => {
    setIsLoading(true);
    setSelectedUniversity(null);
    setSelectedProgram(null);
    setError(null);
    try {
      const results = await SupabaseService.getSavedUniversities();
      setUniversities(results);
    } catch (err) {
      setError("Failed to load your repository.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedUniversity(null);
    setSelectedProgram(null);
    try {
      const results = await GeminiService.searchUniversities(query);
      setUniversities(results);
    } catch (err) {
      setError("Failed to fetch universities. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUniversity = async (u: University) => {
    setIsLoading(true);
    setError(null);
    try {
      const details = await GeminiService.getUniversityDetails(u.name);
      if (details) {
        setSelectedUniversity(details);
        setSelectedProgram(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError("Could not load details for this university.");
      }
    } catch (err) {
      setError("An error occurred while loading details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProgram = async (program: Program) => {
    if (!selectedUniversity) return;
    setIsLoading(true);
    setError(null);
    try {
      const details = await GeminiService.getProgramDetails(selectedUniversity.name, program);
      if (details) {
        setSelectedProgram(details);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError("Could not load program details.");
      }
    } catch (err) {
      setError("An error occurred while loading program details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout view={view} setView={setView}>
      {isLoading && !selectedUniversity && !selectedProgram && (
        <div className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-indigo-900 font-bold animate-pulse">
                {view === 'explorer' ? 'Consulting the Oracle...' : 'Accessing Secure Backend...'}
            </p>
        </div>
      )}

      {selectedProgram ? (
        <ProgramDetail 
          universityName={selectedUniversity?.name || ""}
          program={selectedProgram}
          onBack={() => setSelectedProgram(null)}
        />
      ) : selectedUniversity ? (
        <UniversityDetail 
          university={selectedUniversity} 
          onBack={() => setSelectedUniversity(null)} 
          onProgramClick={handleSelectProgram}
        />
      ) : (
        <>
          {view === 'explorer' && <SearchHero onSearch={handleSearch} isLoading={isLoading} />}
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center space-x-3 shadow-sm">
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold">Backend Notice</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                    {view === 'explorer' ? 'Explorer Feed' : 'Saved in Repository'}
                </h2>
                <div className="text-slate-400 text-sm font-medium">
                    {universities.length} institutions tracked
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {universities.map((uni) => (
                    <UniversityCard 
                    key={uni.id} 
                    university={uni} 
                    onClick={handleSelectUniversity} 
                    />
                ))}
            </div>
            
            {!isLoading && universities.length === 0 && (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-900">
                    {view === 'explorer' ? 'No universities found' : 'Repository is empty'}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    {view === 'explorer' ? 'Try adjusting your search terms.' : 'Go to the explorer to start adding institutions.'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default App;
