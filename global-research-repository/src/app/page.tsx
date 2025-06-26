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
        
        // For demo purposes, create some mock data if Supabase is not available
        const mockPapers = [
          {
            id: 1,
            title: "Solar Energy Solutions for Rural Communities in Nigeria",
            authors: ["Dr. Amina Kano", "Prof. Ibrahim Lagos"],
            abstract: "This research explores innovative solar energy solutions specifically designed for rural communities in Nigeria. Our study demonstrates how locally-manufactured solar panels can provide sustainable electricity access to remote villages, improving education and healthcare outcomes.",
            institution: "University of Lagos",
            country: "Nigeria",
            subject: "env",
            level: "undergraduate",
            type: "article",
            submitted: "2024-01-15",
            downloads: 245,
            views: 1203
          },
          {
            id: 2,
            title: "Community-Based Water Management in Kenya",
            authors: ["Sarah Nairobi", "Community Leaders of Kibera"],
            abstract: "A collaborative study between university researchers and community leaders examining sustainable water management practices in urban slums. This research highlights community-driven solutions that have improved water access for over 10,000 residents.",
            institution: "Kibera Community Center",
            country: "Kenya",
            subject: "env",
            level: "community",
            type: "community_report",
            submitted: "2024-01-10",
            downloads: 189,
            views: 892
          },
          {
            id: 3,
            title: "Mobile Banking Adoption in Rural Ghana",
            authors: ["Kwame Asante", "Ama Osei"],
            abstract: "This study investigates the factors influencing mobile banking adoption among rural populations in Ghana. Our findings reveal key barriers and opportunities for financial inclusion in underserved communities.",
            institution: "University of Ghana",
            country: "Ghana",
            subject: "econ",
            level: "undergraduate",
            type: "thesis",
            submitted: "2024-01-05",
            downloads: 156,
            views: 743
          }
        ];

        // Try to fetch from Supabase, fallback to mock data
        try {
          const { data: papersData, error: papersError } = await supabase
            .from('global_research_repository')
            .select('*')
            .order('submitted', { ascending: false });
          
          if (papersError) throw papersError;
          
          const papers = papersData && papersData.length > 0 ? papersData : mockPapers;
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
        } catch (supabaseError) {
          console.log('Using mock data for demo');
          setPapers(mockPapers);
          setFilteredPapers(mockPapers);
          setStats({
            totalPapers: mockPapers.length,
            totalCountries: 3,
            totalDownloads: 590,
            recentSubmissions: 3,
          });
        }
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