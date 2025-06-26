'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FunnelIcon, 
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

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
    <div className="card p-6 mb-8 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FunnelIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{t('advancedSearchFilters')}</h3>
        </div>
        {hasActiveFilters && (
          <span className="badge badge-primary">
            {Object.values(filters).filter(v => v !== '').length} active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Country Filter */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            {t('countryRegion')}
          </label>
          <select
            id="country"
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
            className="input"
            aria-label={t('countryRegion')}
          >
            <option value="">{t('allCountries')}</option>
            <option value="Nigeria">{t('nigeria')}</option>
            <option value="Kenya">{t('kenya')}</option>
            <option value="Ghana">{t('ghana')}</option>
            <option value="South Africa">{t('southAfrica')}</option>
            <option value="Egypt">{t('egypt')}</option>
            <option value="India">{t('india')}</option>
            <option value="Bangladesh">{t('bangladesh')}</option>
            <option value="Pakistan">{t('pakistan')}</option>
            <option value="Indonesia">{t('indonesia')}</option>
            <option value="Philippines">{t('philippines')}</option>
            <option value="Brazil">{t('brazil')}</option>
            <option value="Mexico">{t('mexico')}</option>
            <option value="Colombia">{t('colombia')}</option>
            <option value="Peru">{t('peru')}</option>
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            {t('subjectClassification')}
          </label>
          <select
            id="subject"
            name="subject"
            value={filters.subject}
            onChange={handleFilterChange}
            className="input"
            aria-label={t('subjectClassification')}
          >
            <option value="">{t('allSubjects')}</option>
            <option value="agri">{t('agriculture')}</option>
            <option value="cs">{t('computerScience')}</option>
            <option value="econ">{t('economics')}</option>
            <option value="edu">{t('education')}</option>
            <option value="env">{t('environmentalScience')}</option>
            <option value="med">{t('medicineHealth')}</option>
            <option value="math">{t('mathematics')}</option>
            <option value="physics">{t('physics')}</option>
            <option value="soc">{t('socialSciences')}</option>
          </select>
        </div>

        {/* Education Level Filter */}
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
            {t('educationLevel')}
          </label>
          <select
            id="level"
            name="level"
            value={filters.level}
            onChange={handleFilterChange}
            className="input"
            aria-label={t('educationLevel')}
          >
            <option value="">{t('allLevels')}</option>
            <option value="high-school">{t('highSchool')}</option>
            <option value="undergraduate">{t('undergraduate')}</option>
            <option value="community">{t('communityBased')}</option>
          </select>
        </div>

        {/* Publication Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            {t('publicationType')}
          </label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="input"
            aria-label={t('publicationType')}
          >
            <option value="">{t('allTypes')}</option>
            <option value="article">{t('journalArticle')}</option>
            <option value="conference_paper">{t('conferencePaper')}</option>
            <option value="book">{t('book')}</option>
            <option value="thesis">{t('thesis')}</option>
            <option value="dissertation">{t('dissertation')}</option>
            <option value="technical_report">{t('technicalReport')}</option>
            <option value="community_report">{t('communityReport')}</option>
            <option value="other">{t('other')}</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            {t('dateRange')}
          </label>
          <select
            id="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="input"
            aria-label={t('dateRange')}
          >
            <option value="">{t('allDates')}</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="older">{t('before2020')}</option>
          </select>
        </div>

        {/* Institution Filter */}
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
            {t('institution')}
          </label>
          <input
            id="institution"
            type="text"
            name="institution"
            value={filters.institution}
            onChange={handleFilterChange}
            placeholder={t('institutionPlaceholder')}
            className="input"
            aria-label={t('institution')}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={applyFilters}
          disabled={isApplying}
          className="btn btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isApplying ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Applying...</span>
            </>
          ) : (
            <>
              <CheckIcon className="w-4 h-4" />
              <span>{t('applyFilters')}</span>
            </>
          )}
        </button>
        
        <button
          onClick={clearFilters}
          className="btn btn-secondary flex items-center justify-center space-x-2"
        >
          <XMarkIcon className="w-4 h-4" />
          <span>{t('clearAll')}</span>
        </button>
      </div>
    </div>
  );
}