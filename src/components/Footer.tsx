'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { 
  GlobeAltIcon,
  EnvelopeIcon,
  HeartIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

export default function Footer() {
  const { t } = useTranslation();

  const footerLinks = {
    platform: [
      { name: t('browse'), href: '/browse' },
      { name: t('search'), href: '/search' },
      { name: t('statistics'), href: '/stats' },
      { name: 'API Documentation', href: '/api-docs' },
    ],
    support: [
      { name: t('help'), href: '/help' },
      { name: 'Guidelines', href: '/guidelines' },
      { name: 'FAQ', href: '/faq' },
      { name: t('contact'), href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Copyright Policy', href: '/copyright' },
      { name: 'Open Access', href: '/open-access' },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <GlobeAltIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Global Research</h3>
                <p className="text-xs text-gray-500">by inested.com</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Empowering research from developing nations. Connecting researchers, 
              students, and communities worldwide through open access to knowledge.
            </p>
            <div className="flex items-center space-x-2">
              <EnvelopeIcon className="w-4 h-4 text-gray-400" />
              <a 
                href="mailto:research@inested.com" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                research@inested.com
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>© 2024 inested.com. All rights reserved.</span>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <HeartIcon className="w-4 h-4 text-red-500" />
                <span>for global research</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://inested.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span>Powered by inested.com</span>
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}