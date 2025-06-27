'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchSectionProps {
  papers: any[];
  setFilteredPapers: (papers: any[]) => void;
  setShowAdvanced: (show: boolean) => void;
  showAdvanced: boolean;
  setCurrentPage: (page: number) => void;
}

export default function SearchSection({
  papers,
  setFilteredPapers,
  setShowAdvanced,
  showAdvanced,
  setCurrentPage,
}: SearchSectionProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (term: string = searchTerm) => {
    setIsSearching(true);
    setCurrentPage(1);
    
    try {
      if (!term.trim()) {
        setFilteredPapers(papers);
        return;
      }

      const filtered = papers.filter(paper => {
        const searchLower = term.toLowerCase();
        return (
          paper.title?.toLowerCase().includes(searchLower) ||
          paper.authors?.some((author: string) => author.toLowerCase().includes(searchLower)) ||
          paper.abstract?.toLowerCase().includes(searchLower) ||
          paper.subject?.toLowerCase().includes(searchLower) ||
          paper.country?.toLowerCase().includes(searchLower) ||
          paper.institution?.toLowerCase().includes(searchLower)
        );
      });
      
      setFilteredPapers(filtered);
    } catch (error) {
      console.error('Search failed:', error);
      setFilteredPapers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredPapers(papers);
    setCurrentPage(1);
  };

  return (
    <section className="mb-12" id="search-section">
      <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-gray-800 dark:via-blue-900/20 dark:to-indigo-900/30 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-blue-600/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Search Scientific Publications
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Access peer-reviewed research from leading institutions worldwide
            </p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-4xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                <div className="flex items-center">
                  <div className="pl-6 pr-4 py-4">
                    <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search by title, author, keywords, or institution..."
                    className="flex-1 py-4 pr-4 text-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                    aria-label="Search publications"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="p-2 mr-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      aria-label="Clear search"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              aria-label="Search"
            >
              <span className="relative z-10 flex items-center space-x-2">
                {isSearching ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Search</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            </button>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`relative px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                showAdvanced 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800'
              }`}
              aria-label="Toggle advanced search"
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                <span>{showAdvanced ? 'Hide Filters' : 'Show Filters'}</span>
              </span>
            </button>
          </div>

          {/* Quick Search Tags */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Machine Learning', 'Climate Science', 'Public Health', 'Sustainable Agriculture', 'Renewable Energy', 'Biotechnology'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchTerm(term);
                    handleSearch(term);
                  }}
                  className="px-4 py-2 text-sm bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-full hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}