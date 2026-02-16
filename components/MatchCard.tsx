
import React from 'react';
import { MatchUpdate } from '../types';

interface MatchCardProps {
  match: MatchUpdate;
  title: string;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, title }) => {
  // Enhanced parser to detect scores and team names for better styling
  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return null;
      
      // Highlight lines that look like a match header (Team vs Team)
      if (line.toLowerCase().includes(' vs ')) {
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '$1');
        return (
          <div key={i} className="mt-4 mb-2 first:mt-0">
            <h3 className="text-xl md:text-2xl font-sport tracking-wide text-white border-l-4 border-emerald-500 pl-3">
              {formatted}
            </h3>
          </div>
        );
      }

      // Highlight scores
      if (line.toLowerCase().includes('score:')) {
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<span class="text-3xl font-bold text-emerald-400">$1</span>');
        return (
          <div key={i} className="bg-slate-900/60 p-4 rounded-xl my-2 border border-slate-700/50 flex items-center justify-between">
            <div dangerouslySetInnerHTML={{ __html: formatted }} className="flex items-center gap-4" />
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Live</span>
            </div>
          </div>
        );
      }

      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-400">$1</strong>');
      return <p key={i} className="text-slate-300 text-sm md:text-base leading-relaxed mb-1" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl hover:border-emerald-500/30 transition-all">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-sport tracking-widest text-lg md:text-xl uppercase text-slate-100">{title}</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">Last Sync</span>
          <span className="text-xs font-mono text-emerald-500">
            {match.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>
      <div className="p-6 md:p-8">
        <div className="space-y-1">
          {formatContent(match.content)}
        </div>
        
        {match.sources.length > 0 && (
          <div className="border-t border-slate-700/50 pt-6 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verified Sources</h4>
              <div className="h-[1px] flex-grow mx-4 bg-slate-700/50"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {match.sources.map((source, idx) => (
                // Only render source link if the uri is available
                source.web?.uri && (
                  <a
                    key={idx}
                    href={source.web.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-xs bg-slate-900/80 hover:bg-emerald-500/10 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 px-3 py-2 rounded-xl transition-all border border-slate-700"
                  >
                    <span className="truncate max-w-[150px]">{source.web.title || 'Source'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;