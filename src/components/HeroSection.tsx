'use client';

import { useTranslation } from 'react-i18next';
import { 
  MagnifyingGlassIcon, 
  GlobeAltIcon, 
  AcademicCapIcon,
  UsersIcon,
  BookOpenIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface HeroSectionProps {
  onSearchClick: () => void;
}

export default function HeroSection({ onSearchClick }: HeroSectionProps) {
  const { t } = useTranslation();

  const features = [
    {
      icon: GlobeAltIcon,
      title: 'Global Reach',
      description: 'Research from 50+ developing nations'
    },
    {
      icon: AcademicCapIcon,
      title: 'All Levels',
      description: 'High school to community research'
    },
    {
      icon: UsersIcon,
      title: 'Inclusive',
      description: 'Supporting underrepresented voices'
    },
    {
      icon: BookOpenIcon,
      title: 'Open Access',
      description: 'Free knowledge for everyone'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Empowering Research from
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Developing Nations
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover groundbreaking research from underrepresented communities worldwide. 
              Connect with researchers, access open knowledge, and contribute to global innovation.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onSearchClick}
              className="btn btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              <span>Explore Research</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn btn-secondary text-lg px-8 py-4">
              Learn More
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="text-center group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-soft flex items-center justify-center mx-auto mb-4 group-hover:shadow-medium transition-all">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="rgb(249, 250, 251)"
          />
        </svg>
      </div>
    </section>
  );
}