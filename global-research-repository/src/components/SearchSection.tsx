'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

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
    <section className="mb-12">
      <div className="card p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {t('searchTheRepository')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search through thousands of research papers from developing nations. 
            Find studies by title, author, abstract, or subject area.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-4xl mx-auto mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              aria-label={t('searchPlaceholder')}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="btn btn-primary text-lg px-8 py-3 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t('search')}
          >
            {isSearching ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="w-5 h-5" />
                <span>{t('search')}</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`btn ${showAdvanced ? 'btn-primary' : 'btn-secondary'} text-lg px-6 py-3 flex items-center space-x-2`}
            aria-label={t('toggleAdvancedSearch')}
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            <span>{showAdvanced ? t('hideAdvancedSearch') : t('showAdvancedSearch')}</span>
          </button>
        </div>

        {/* Quick Search Suggestions */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Solar Energy', 'Agriculture', 'Education', 'Healthcare', 'Water Management'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchTerm(term);
                  handleSearch(term);
                }}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}