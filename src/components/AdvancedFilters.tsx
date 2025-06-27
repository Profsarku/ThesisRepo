'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AdvancedFiltersProps {
  papers: any[];
  setFilteredPapers: (papers: any[]) => void;
  setCurrentPage: (page: number) => void;
}

export default function AdvancedFilters({ papers, setFilteredPapers, setCurrentPage }: AdvancedFiltersProps) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    country: '',
    subject: '',
    level: '',
    type: '',
    date: '',
    institution: '',
  });
  const [isApplying, setIsApplying] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = async () => {
    setIsApplying(true);
    setCurrentPage(1);
    
    try {
      let filtered = [...papers];
      
      if (filters.country) {
        filtered = filtered.filter(paper => paper.country === filters.country);
      }
      if (filters.subject) {
        filtered = filtered.filter(paper => paper.subject === filters.subject);
      }
      if (filters.level) {
        filtered = filtered.filter(paper => paper.level === filters.level);
      }
      if (filters.type) {
        filtered = filtered.filter(paper => paper.type === filters.type);
      }
      if (filters.institution) {
        filtered = filtered.filter(paper => 
          paper.institution?.toLowerCase().includes(filters.institution.toLowerCase())
        );
      }
      if (filters.date) {
        filtered = filtered.filter(paper => {
          const paperYear = new Date(paper.submitted).getFullYear();
          if (filters.date === 'older') {
            return paperYear < 2020;
          }
          return paperYear.toString() === filters.date;
        });
      }
      
      setFilteredPapers(filtered);
    } catch (error) {
      console.error('Filter failed:', error);
      setFilteredPapers([]);
    } finally {
      setIsApplying(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      country: '',
      subject: '',
      level: '',
      type: '',
      date: '',
      institution: '',
    });
    setFilteredPapers(papers);
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="relative bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/50 dark:from-gray-800 dark:via-indigo-900/20 dark:to-purple-900/30 rounded-3xl p-8 mb-8 shadow-xl border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-600/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Advanced Filters
            </h3>
          </div>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
              {Object.values(filters).filter(v => v !== '').length} active
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Country Filter */}
          <div className="space-y-2">
            <label htmlFor="country" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Country/Region
            </label>
            <div className="relative">
              <select
                id="country"
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                aria-label="Country/Region"
              >
                <option value="">All Countries</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Kenya">Kenya</option>
                <option value="Ghana">Ghana</option>
                <option value="South Africa">South Africa</option>
                <option value="Uganda">Uganda</option>
                <option value="India">India</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Brazil">Brazil</option>
              </select>
            </div>
          </div>

          {/* Subject Filter */}
          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Subject Area
            </label>
            <select
              id="subject"
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
              aria-label="Subject Area"
            >
              <option value="">All Subjects</option>
              <option value="agri">Agriculture</option>
              <option value="cs">Computer Science</option>
              <option value="econ">Economics</option>
              <option value="edu">Education</option>
              <option value="env">Environmental Science</option>
              <option value="med">Medicine & Health</option>
              <option value="math">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="soc">Social Sciences</option>
            </select>
          </div>

          {/* Publication Type Filter */}
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Publication Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
              aria-label="Publication Type"
            >
              <option value="">All Types</option>
              <option value="article">Journal Article</option>
              <option value="conference_paper">Conference Paper</option>
              <option value="working_paper">Working Paper</option>
              <option value="book">Book</option>
              <option value="thesis">Thesis</option>
              <option value="technical_report">Technical Report</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Publication Year
            </label>
            <select
              id="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
              aria-label="Publication Year"
            >
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="older">Before 2020</option>
            </select>
          </div>

          {/* Education Level Filter */}
          <div className="space-y-2">
            <label htmlFor="level" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Research Level
            </label>
            <select
              id="level"
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
              className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
              aria-label="Research Level"
            >
              <option value="">All Levels</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="graduate">Graduate</option>
              <option value="doctoral">Doctoral</option>
              <option value="postdoctoral">Postdoctoral</option>
            </select>
          </div>

          {/* Institution Filter */}
          <div className="space-y-2">
            <label htmlFor="institution" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Institution
            </label>
            <input
              id="institution"
              type="text"
              name="institution"
              value={filters.institution}
              onChange={handleFilterChange}
              placeholder="University or research center name"
              className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md placeholder-gray-400 dark:placeholder-gray-500"
              aria-label="Institution"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={applyFilters}
            disabled={isApplying}
            className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              {isApplying ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Applying...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Apply Filters</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
          </button>
          
          <button
            onClick={clearFilters}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Clear All</span>
          </button>
        </div>
      </div>
    </div>
  );
}