
import React from 'react';
import { ProgramDetails } from '../types';

interface ProgramDetailProps {
  universityName: string;
  program: ProgramDetails;
  onBack: () => void;
}

export const ProgramDetail: React.FC<ProgramDetailProps> = ({ universityName, program, onBack }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <nav className="flex mb-8 items-center space-x-2 text-sm font-medium text-slate-500">
        <button onClick={onBack} className="hover:text-indigo-600 transition-colors">University Details</button>
        <span>/</span>
        <span className="text-slate-900 truncate">{program.name}</span>
      </nav>

      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl">
        <div className="bg-indigo-600 p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500 text-indigo-100 text-xs font-bold uppercase tracking-wider mb-4">
                {program.degree} • {program.faculty}
              </span>
              <h1 className="text-3xl md:text-5xl font-black mb-2">{program.name}</h1>
              <p className="text-indigo-100 font-medium text-lg">at {universityName}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-2 gap-8 text-center md:text-left">
                <div>
                  <div className="text-indigo-200 text-xs font-bold uppercase mb-1">Duration</div>
                  <div className="text-xl font-bold">{program.duration}</div>
                </div>
                <div>
                  <div className="text-indigo-200 text-xs font-bold uppercase mb-1">Est. Tuition</div>
                  <div className="text-xl font-bold">{program.tuitionEstimate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Program Overview</h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {program.overview}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Core Curriculum</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {program.curriculum.map((item, i) => (
                    <div key={i} className="flex items-start p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 hover:bg-white transition-all">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mr-3 shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-slate-900 rounded-3xl p-8 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Career Outlook
                </h3>
                <ul className="space-y-4">
                  {program.careerProspects.map((career, i) => (
                    <li key={i} className="flex items-center text-slate-300">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3" />
                      {career}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Requirements</h3>
                <ul className="space-y-4">
                  {program.admissionRequirements.map((req, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-600">
                      <svg className="w-4 h-4 mr-3 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {req}
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md">
                  Check Eligibility
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
