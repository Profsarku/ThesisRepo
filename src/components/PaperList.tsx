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
      agri: 'from-green-500 to-emerald-500',
      cs: 'from-blue-500 to-cyan-500',
      econ: 'from-purple-500 to-pink-500',
      edu: 'from-yellow-500 to-orange-500',
      env: 'from-emerald-500 to-teal-500',
      med: 'from-red-500 to-rose-500',
      math: 'from-indigo-500 to-purple-500',
      physics: 'from-cyan-500 to-blue-500',
      soc: 'from-pink-500 to-rose-500',
    };
    return colors[subject as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getSubjectBg = (subject: string) => {
    const colors = {
      agri: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      cs: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      econ: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      edu: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      env: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
      med: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
      math: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
      physics: 'from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20',
      soc: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
    };
    return colors[subject as keyof typeof colors] || 'from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20';
  };

  const LoadingSkeleton = () => (
    <div className="space-y-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 animate-pulse">
          <div className="flex justify-between items-start mb-6">
            <div className="flex space-x-3">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="space-y-3 mb-6">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {papers.length === 0 ? 'No Publications Found' : 'Research Publications'}
          </h2>
          {papers.length > 0 && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Showing {Math.min(startIndex + 1, papers.length)}-{Math.min(endIndex, papers.length)} of {papers.length} publications
            </p>
          )}
        </div>
        
        {papers.length > 0 && (
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by</label>
            <select
              onChange={(e) => {
                // TODO: Implement sorting logic
              }}
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
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
        <div className="text-center py-20">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No research publications found</h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your search terms or filters to find relevant research publications.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {papersToShow.map((paper, index) => (
            <article 
              key={paper.id} 
              className={`group relative bg-gradient-to-br ${getSubjectBg(paper.subject)} rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm animate-fade-in overflow-hidden`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                {/* Paper Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getSubjectColor(paper.subject)} text-white shadow-lg`}>
                      {paper.subject === 'agri' && 'Agriculture'}
                      {paper.subject === 'cs' && 'Computer Science'}
                      {paper.subject === 'econ' && 'Economics'}
                      {paper.subject === 'env' && 'Environmental Science'}
                      {paper.subject === 'med' && 'Medicine'}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 backdrop-blur-sm border border-gray-200 dark:border-gray-600">
                      {paper.type === 'article' && 'Journal Article'}
                      {paper.type === 'conference_paper' && 'Conference Paper'}
                      {paper.type === 'working_paper' && 'Working Paper'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <time dateTime={paper.submitted}>
                      {new Date(paper.submitted).toLocaleDateString()}
                    </time>
                  </div>
                </div>

                {/* Paper Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-serif hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-tight">
                  <Link href={`/paper/${paper.id}`}>
                    {paper.title}
                  </Link>
                </h3>

                {/* Authors */}
                <div className="text-lg text-gray-600 dark:text-gray-400 font-medium mb-6">
                  {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                  {paper.institution && (
                    <div className="flex items-center space-x-2 bg-white/40 dark:bg-gray-700/40 px-3 py-1 rounded-lg backdrop-blur-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{paper.institution}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 bg-white/40 dark:bg-gray-700/40 px-3 py-1 rounded-lg backdrop-blur-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{paper.country}</span>
                  </div>
                  {paper.journal && (
                    <div className="flex items-center space-x-2 bg-white/40 dark:bg-gray-700/40 px-3 py-1 rounded-lg backdrop-blur-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>{paper.journal}</span>
                    </div>
                  )}
                  {paper.doi && (
                    <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">DOI: {paper.doi}</span>
                    </div>
                  )}
                </div>

                {/* Abstract */}
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed font-serif mb-8 text-lg">
                  {paper.abstract.length > 300 
                    ? `${paper.abstract.substring(0, 300)}...` 
                    : paper.abstract
                  }
                </div>

                {/* Actions and Stats */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="flex items-center space-x-6">
                    <Link 
                      href={`/api/global_research_repository/${paper.id}/download`} 
                      className="group flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <div className="p-2 bg-white/60 dark:bg-gray-700/60 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="font-medium">PDF</span>
                    </Link>
                    <Link 
                      href={`/paper/${paper.id}`} 
                      className="group flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <div className="p-2 bg-white/60 dark:bg-gray-700/60 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <span className="font-medium">View</span>
                    </Link>
                    <button className="group flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <div className="p-2 bg-white/60 dark:bg-gray-700/60 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <span className="font-medium">Cite</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2 bg-white/40 dark:bg-gray-700/40 px-3 py-2 rounded-lg backdrop-blur-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-medium">{paper.downloads || 0} downloads</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/40 dark:bg-gray-700/40 px-3 py-2 rounded-lg backdrop-blur-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="font-medium">{paper.views || 0} views</span>
                    </div>
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
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
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
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
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
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </nav>
      )}
    </section>
  );
}