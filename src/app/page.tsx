'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import SearchSection from '../components/SearchSection';
import AdvancedFilters from '../components/AdvancedFilters';
import PaperList from '../components/PaperList';
import UploadModal from '../components/UploadModal';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';

export default function Home() {
  const { t } = useTranslation();
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPapers: 0,
    totalCountries: 0,
    totalDownloads: 0,
    recentSubmissions: 0,
  });
  const papersPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch papers
        const { data: papersData, error: papersError } = await supabase
          .from('global_research_repository')
          .select('*')
          .order('submitted', { ascending: false });
        
        if (papersError) throw papersError;
        
        const papers = papersData || [];
        setPapers(papers);
        setFilteredPapers(papers);
        
        // Calculate stats
        const countries = new Set(papers.map(p => p.country)).size;
        const totalDownloads = papers.reduce((sum, p) => sum + (p.downloads || 0), 0);
        const recentSubmissions = papers.filter(p => {
          const submittedDate = new Date(p.submitted);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return submittedDate >= thirtyDaysAgo;
        }).length;
        
        setStats({
          totalPapers: papers.length,
          totalCountries: countries,
          totalDownloads,
          recentSubmissions,
        });
      } catch (error) {
        console.error('Fetch data failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSubmitClick={() => setShowModal(true)} />
      <HeroSection onSearchClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })} />
      <StatsSection stats={stats} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div id="search-section">
          <SearchSection 
            papers={papers}
            setFilteredPapers={setFilteredPapers} 
            setShowAdvanced={setShowAdvanced} 
            showAdvanced={showAdvanced}
            setCurrentPage={setCurrentPage}
          />
        </div>
        
        {showAdvanced && (
          <div className="animate-slide-up">
            <AdvancedFilters 
              papers={papers}
              setFilteredPapers={setFilteredPapers} 
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
        
        <PaperList 
          papers={filteredPapers} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          papersPerPage={papersPerPage}
          loading={loading}
        />
      </main>
      
      <Footer />
      
      {showModal && (
        <UploadModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}