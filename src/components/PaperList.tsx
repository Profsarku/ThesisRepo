'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { 
  DocumentArrowDownIcon, 
  EyeIcon, 
  LinkIcon,
  CalendarIcon,
  MapPinIcon,
  AcademicCapIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';

interface PaperListProps {
  papers: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  papersPerPage: number;
  loading: boolean;
}

export default function PaperList({
  papers,
  currentPage,
  setCurrentPage,
  papersPerPage,
  loading,
}: PaperListProps) {
  const { t } = useTranslation();
  const startIndex = (currentPage - 1) * papersPerPage;
  const endIndex = startIndex + papersPerPage;
  const papersToShow = papers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(papers.length / papersPerPage);

  const getSubjectColor = (subject: string) => {
    const colors = {
      agri: 'bg-green-100 text-green-800',
      cs: 'bg-blue-100 text-blue-800',
      econ: 'bg-purple-100 text-purple-800',
      edu: 'bg-yellow-100 text-yellow-800',
      env: 'bg-emerald-100 text-emerald-800',
      med: 'bg-red-100 text-red-800',
      math: 'bg-indigo-100 text-indigo-800',
      physics: 'bg-cyan-100 text-cyan-800',
      soc: 'bg-pink-100 text-pink-800',
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card p-6 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="skeleton h-6 w-24 rounded-full"></div>
            <div className="skeleton h-4 w-20"></div>
          </div>
          <div className="skeleton h-6 w-3/4 mb-3"></div>
          <div className="skeleton h-4 w-1/2 mb-4"></div>
          <div className="space-y-2 mb-4">
            <div className="skeleton h-3 w-full"></div>
            <div className="skeleton h-3 w-5/6"></div>
            <div className="skeleton h-3 w-4/6"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="skeleton h-4 w-12"></div>
              <div className="skeleton h-4 w-12"></div>
              <div className="skeleton h-4 w-12"></div>
            </div>
            <div className="skeleton h-4 w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <section>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {papers.length === 0 ? 'No Results Found' : t('recentSubmissions')}
          </h2>
          {papers.length > 0 && (
            <p className="text-gray-600">
              {t('showingPapers', {
                start: Math.min(startIndex + 1, papers.length),
                end: Math.min(endIndex, papers.length),
                total: papers.length,
              })}
            </p>
          )}
        </div>
        
        {papers.length > 0 && (
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">{t('sortBy')}</label>
            <select
              onChange={(e) => {
                // TODO: Implement sorting logic
              }}
              className="input text-sm py-2"
              aria-label={t('sortBy')}
            >
              <option value="date-desc">{t('newestFirst')}</option>
              <option value="date-asc">{t('oldestFirst')}</option>
              <option value="title-asc">{t('titleAZ')}</option>
              <option value="relevance">{t('relevance')}</option>
            </select>
          </div>
        )}
      </div>

      {/* Papers Grid */}
      {papers.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <DocumentArrowDownIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No research papers found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Try adjusting your search terms or filters to find relevant research papers.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {papersToShow.map((paper, index) => (
            <article 
              key={paper.id} 
              className="paper-item animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Paper Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center space-x-3">
                  <span className={`badge ${getSubjectColor(paper.subject)}`}>
                    {t(paper.subject)}
                  </span>
                  <span className="badge badge-secondary flex items-center space-x-1">
                    <AcademicCapIcon className="w-3 h-3" />
                    <span>{t(paper.level)}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <CalendarIcon className="w-4 h-4" />
                  <time dateTime={paper.submitted}>
                    {new Date(paper.submitted).toLocaleDateString()}
                  </time>
                </div>
              </div>

              {/* Paper Title */}
              <h3 className="paper-title mb-3">
                <Link href={`/paper/${paper.id}`} className="hover:text-blue-600 transition-colors">
                  {paper.title}
                </Link>
              </h3>

              {/* Authors */}
              <div className="paper-authors mb-4">
                {paper.authors.join(', ')}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
                {paper.institution && (
                  <div className="flex items-center space-x-1">
                    <BuildingLibraryIcon className="w-4 h-4" />
                    <span>{paper.institution}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{paper.country}</span>
                </div>
                <span className="badge badge-secondary">{t(paper.type)}</span>
              </div>

              {/* Abstract */}
              <div className="paper-abstract mb-6">
                {paper.abstract.length > 300 
                  ? `${paper.abstract.substring(0, 300)}...` 
                  : paper.abstract
                }
              </div>

              {/* Actions and Stats */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <Link 
                    href={`/api/global_research_repository/${paper.id}/download`} 
                    className="btn btn-ghost text-sm flex items-center space-x-1 hover:text-blue-600"
                  >
                    <DocumentArrowDownIcon className="w-4 h-4" />
                    <span>{t('pdf')}</span>
                  </Link>
                  <Link 
                    href={`/paper/${paper.id}`} 
                    className="btn btn-ghost text-sm flex items-center space-x-1 hover:text-blue-600"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>{t('view')}</span>
                  </Link>
                  <button className="btn btn-ghost text-sm flex items-center space-x-1 hover:text-blue-600">
                    <LinkIcon className="w-4 h-4" />
                    <span>{t('cite')}</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <DocumentArrowDownIcon className="w-4 h-4" />
                    <span>{paper.downloads || 0} {t('downloads')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="w-4 h-4" />
                    <span>{paper.views || 0} {t('views')}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-12 flex justify-center" aria-label={t('pagination')}>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </section>
  );
}