
import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import MatchCard from './components/MatchCard';
import { getLiveMatchData } from './services/geminiService';
import { MatchUpdate, SportCategory } from './types';

const App: React.FC = () => {
  const [featuredMatches, setFeaturedMatches] = useState<MatchUpdate | null>(null);
  const [searchResults, setSearchResults] = useState<MatchUpdate | null>(null);
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SportCategory>(SportCategory.ALL);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatured = useCallback(async (category: SportCategory) => {
    setIsLoading(true);
    setError(null);
    try {
      // Default query prioritized to be "World Cup" or major tournament matches
      let query = "";
      if (category === SportCategory.ALL) {
        query = "Live scores for current World Cup Qualifiers, FIFA matches, or major international tournament finals today";
      } else {
        query = `Live ${category} match scores for major professional leagues and international tournaments today`;
      }
      
      const data = await getLiveMatchData(query);
      setFeaturedMatches(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch latest scores. Retrying...");
      // Auto retry after a short delay
      setTimeout(() => fetchFeatured(category), 10000);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentSearchTerm(query);
    try {
      const data = await getLiveMatchData(query);
      setSearchResults(data);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError(`Could not find live data for "${query}".`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured(activeCategory);
    // Real-time apps update frequently. 2 minutes for a balance.
    const interval = setInterval(() => fetchFeatured(activeCategory), 120000);
    return () => clearInterval(interval);
  }, [activeCategory, fetchFeatured]);

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 pb-20 selection:bg-emerald-500/30">
      {/* Dynamic Background Element */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* Header Section */}
      <header className="pt-16 pb-10 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Global Sports Data
        </div>
        
        <h1 className="font-sport text-7xl md:text-9xl tracking-tighter mb-4 text-white">
          LIVE<span className="text-emerald-500">SCORE</span>
        </h1>
        
        <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-light">
          Real-time insights for World Cup Qualifiers, Major Leagues, and Global Tournaments.
        </p>
        
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {Object.values(SportCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSearchResults(null);
                setCurrentSearchTerm('');
              }}
              className={`px-6 py-2.5 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                activeCategory === cat && !searchResults
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-500 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Feed */}
      <main className="max-w-4xl mx-auto px-4 space-y-10">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button onClick={() => fetchFeatured(activeCategory)} className="text-xs font-bold underline">Retry</button>
          </div>
        )}

        {searchResults && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                Results: <span className="text-emerald-400 font-sport tracking-wider text-2xl">{currentSearchTerm}</span>
              </h2>
              <button 
                onClick={() => setSearchResults(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-400 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                Close Search
              </button>
            </div>
            <MatchCard match={searchResults} title="Search Result" />
          </section>
        )}

        <section className="relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-6 bg-slate-600 rounded-full"></span>
              {activeCategory === SportCategory.ALL ? 'International Highlights' : `${activeCategory} Central`}
            </h2>
            <div className="flex items-center gap-4">
               {isLoading && !featuredMatches && <span className="text-[10px] font-bold text-slate-500 uppercase animate-pulse">Updating...</span>}
               <button 
                onClick={() => fetchFeatured(activeCategory)}
                disabled={isLoading}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors group"
                title="Refresh Scores"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-emerald-500 transition-transform ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {featuredMatches ? (
            <MatchCard match={featuredMatches} title={activeCategory === SportCategory.ALL ? "Global Live Feed" : `${activeCategory} Live`} />
          ) : (
            <div className="h-80 flex flex-col items-center justify-center bg-slate-800/20 border border-dashed border-slate-700 rounded-3xl">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-8 h-8 bg-emerald-500/10 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-slate-500 font-medium text-center max-w-xs leading-relaxed">
                Contacting stadium servers for the latest World Cup scores...
              </p>
            </div>
          )}
        </section>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10">
          {[
            { label: "GROUNDED", value: "Verified by Google Search" },
            { label: "REAL-TIME", value: "Auto-refreshing every 2m" },
            { label: "COVERAGE", value: "World Cup, UEFA, NBA, more" }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
              <span className="text-[10px] font-black text-emerald-500 tracking-[0.2em] mb-1">{stat.label}</span>
              <span className="text-slate-300 text-sm font-medium">{stat.value}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-800/50 pt-10 text-center">
        <div className="flex justify-center gap-6 mb-4">
           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 hover:text-emerald-500 transition-colors cursor-pointer">⚽</div>
           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 hover:text-emerald-500 transition-colors cursor-pointer">🏀</div>
           <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 hover:text-emerald-500 transition-colors cursor-pointer">🎾</div>
        </div>
        <p className="text-slate-600 text-xs font-bold tracking-widest uppercase">
          &copy; {new Date().getFullYear()} LIVESCORE AI • DATA GROUNDED BY GEMINI
        </p>
      </footer>
    </div>
  );
};

export default App;
