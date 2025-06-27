'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

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
      agri: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      cs: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      econ: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      edu: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      env: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
      med: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      math: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      physics: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      soc: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-2 mb-4">
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-4/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {papers.length === 0 ? 'No Publications Found' : 'Recent Publications'}
          </h2>
          {papers.length > 0 && (
            <p className="text-gray-600 dark:text-gray-400">
              Showing {Math.min(startIndex + 1, papers.length)}-{Math.min(endIndex, papers.length)} of {papers.length} publications
            </p>
          )}
        </div>
        
        {papers.length > 0 && (
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by</label>
            <select
              onChange={(e) => {
                // TODO: Implement sorting logic
              }}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              aria-label="Sort by"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="citations">Most Cited</option>
              <option value="downloads">Most Downloaded</option>
            </select>
          </div>
        )}
      </div>

      {/* Papers Grid */}
      {papers.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📄</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No research publications found</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your search terms or filters to find relevant research publications.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {papersToShow.map((paper, index) => (
            <article 
              key={paper.id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Paper Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubjectColor(paper.subject)}`}>
                    {paper.subject === 'agri' && 'Agriculture'}
                    {paper.subject === 'cs' && 'Computer Science'}
                    {paper.subject === 'econ' && 'Economics'}
                    {paper.subject === 'env' && 'Environmental Science'}
                    {paper.subject === 'med' && 'Medicine'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {paper.type === 'article' && 'Journal Article'}
                    {paper.type === 'conference_paper' && 'Conference Paper'}
                    {paper.type === 'working_paper' && 'Working Paper'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>📅</span>
                  <time dateTime={paper.submitted}>
                    {new Date(paper.submitted).toLocaleDateString()}
                  </time>
                </div>
              </div>

              {/* Paper Title */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 font-serif hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Link href={`/paper/${paper.id}`}>
                  {paper.title}
                </Link>
              </h3>

              {/* Authors */}
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-4">
                {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
                {paper.institution && (
                  <div className="flex items-center space-x-1">
                    <span>🏛️</span>
                    <span>{paper.institution}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <span>🌍</span>
                  <span>{paper.country}</span>
                </div>
                {paper.journal && (
                  <div className="flex items-center space-x-1">
                    <span>📖</span>
                    <span>{paper.journal}</span>
                  </div>
                )}
                {paper.doi && (
                  <div className="flex items-center space-x-1">
                    <span>🔗</span>
                    <span className="text-blue-600 dark:text-blue-400">DOI: {paper.doi}</span>
                  </div>
                )}
              </div>

              {/* Abstract */}
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-serif mb-6">
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
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm flex items-center space-x-1 transition-colors"
                  >
                    <span>📄</span>
                    <span>PDF</span>
                  </Link>
                  <Link 
                    href={`/paper/${paper.id}`} 
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm flex items-center space-x-1 transition-colors"
                  >
                    <span>👁️</span>
                    <span>View</span>
                  </Link>
                  <button className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm flex items-center space-x-1 transition-colors">
                    <span>📋</span>
                    <span>Cite</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <span>⬇️</span>
                    <span>{paper.downloads || 0} downloads</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>👁️</span>
                    <span>{paper.views || 0} views</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-12 flex justify-center" aria-label="Pagination">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </section>
  );
}