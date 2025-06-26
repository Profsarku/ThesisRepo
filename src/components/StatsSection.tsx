'use client';

import { useTranslation } from 'react-i18next';
import { 
  DocumentTextIcon, 
  GlobeAltIcon, 
  ArrowDownTrayIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface StatsSectionProps {
  stats: {
    totalPapers: number;
    totalCountries: number;
    totalDownloads: number;
    recentSubmissions: number;
  };
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const { t } = useTranslation();

  const statItems = [
    {
      icon: DocumentTextIcon,
      value: stats.totalPapers.toLocaleString(),
      label: 'Research Papers',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: GlobeAltIcon,
      value: stats.totalCountries.toString(),
      label: 'Countries',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: ArrowDownTrayIcon,
      value: stats.totalDownloads.toLocaleString(),
      label: 'Downloads',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: ClockIcon,
      value: stats.recentSubmissions.toString(),
      label: 'Recent Submissions',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <section className="bg-white py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Research Impact at a Glance
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of researchers sharing knowledge and driving innovation across the developing world
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.label}
                className="text-center group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {item.value}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}