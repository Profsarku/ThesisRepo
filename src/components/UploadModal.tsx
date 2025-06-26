'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { 
  XMarkIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface UploadModalProps {
  onClose: () => void;
}

export default function UploadModal({ onClose }: UploadModalProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    subject: '',
    level: '',
    country: '',
    institution: '',
    abstract: '',
    type: '',
    file: null as File | null,
    language: 'en',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, name: 'Basic Information', icon: DocumentTextIcon },
    { id: 2, name: 'Details & Upload', icon: CloudArrowUpIcon },
    { id: 3, name: 'Review & Submit', icon: CheckCircleIcon },
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.authors.trim()) newErrors.authors = 'Authors are required';
      if (!formData.subject) newErrors.subject = 'Subject is required';
      if (!formData.level) newErrors.level = 'Education level is required';
      if (!formData.country) newErrors.country = 'Country is required';
    }
    
    if (step === 2) {
      if (!formData.abstract.trim()) newErrors.abstract = 'Abstract is required';
      if (!formData.type) newErrors.type = 'Publication type is required';
      if (!formData.file) newErrors.file = 'PDF file is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (name === 'language') {
      i18n.changeLanguage(value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, file: 'File size must be less than 5MB' });
        return;
      }
      if (file.type !== 'application/pdf') {
        setErrors({ ...errors, file: 'Only PDF files are allowed' });
        return;
      }
      setFormData({ ...formData, file });
      if (errors.file) {
        setErrors({ ...errors, file: '' });
      }
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Verify user via inested.com's JWT
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${document.cookie.split('inested_token=')[1]?.split(';')[0]}`,
        },
      });
      
      if (!response.ok) {
        router.push('https://inested.com/login');
        return;
      }
      
      const { userId } = await response.json();

      if (!formData.file) throw new Error('No file selected');

      // Upload file to Supabase Storage
      const filePath = `papers/${Date.now()}_${formData.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('papers')
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      // Save metadata to Supabase
      const { error } = await supabase.from('global_research_repository').insert({
        title: formData.title,
        authors: formData.authors.split(',').map((author) => author.trim()),
        abstract: formData.abstract,
        institution: formData.institution || null,
        country: formData.country,
        subject: formData.subject,
        level: formData.level,
        type: formData.type,
        file_path: filePath,
        user_id: userId,
      });

      if (error) throw error;

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Submission failed:', error);
      setSubmitStatus('error');
      localStorage.setItem('pendingSubmission', JSON.stringify(formData));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Language Selector */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                {t('formLanguage')}
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="input"
              >
                <option value="en">English</option>
                <option value="sw">Swahili</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                {t('paperTitle')} *
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`input ${errors.title ? 'input-error' : ''}`}
                placeholder={t('paperTitlePlaceholder')}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  <span>{errors.title}</span>
                </p>
              )}
            </div>

            {/* Authors */}
            <div>
              <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-2">
                {t('authors')} *
              </label>
              <input
                id="authors"
                type="text"
                name="authors"
                value={formData.authors}
                onChange={handleInputChange}
                className={`input ${errors.authors ? 'input-error' : ''}`}
                placeholder={t('authorsPlaceholder')}
              />
              {errors.authors && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  <span>{errors.authors}</span>
                </p>
              )}
            </div>

            {/* Subject and Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('subjectArea')} *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`input ${errors.subject ? 'input-error' : ''}`}
                >
                  <option value="">{t('selectSubject')}</option>
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
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('educationLevel')} *
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className={`input ${errors.level ? 'input-error' : ''}`}
                >
                  <option value="">{t('selectLevel')}</option>
                  <option value="high-school">{t('highSchool')}</option>
                  <option value="undergraduate">{t('undergraduate')}</option>
                  <option value="community">{t('communityBased')}</option>
                </select>
                {errors.level && (
                  <p className="mt-1 text-sm text-red-600">{errors.level}</p>
                )}
              </div>
            </div>

            {/* Country and Institution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('country')} *
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`input ${errors.country ? 'input-error' : ''}`}
                >
                  <option value="">{t('selectCountry')}</option>
                  <option value="Nigeria">{t('nigeria')}</option>
                  <option value="Kenya">{t('kenya')}</option>
                  <option value="Ghana">{t('ghana')}</option>
                  <option value="India">{t('india')}</option>
                  <option value="Brazil">{t('brazil')}</option>
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
              </div>

              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('institution')}
                </label>
                <input
                  id="institution"
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className="input"
                  placeholder={t('institutionPlaceholder')}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Abstract */}
            <div>
              <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
                {t('summary')} *
              </label>
              <textarea
                id="abstract"
                name="abstract"
                value={formData.abstract}
                onChange={handleInputChange}
                rows={6}
                className={`input ${errors.abstract ? 'input-error' : ''}`}
                placeholder={t('summaryPlaceholder')}
              />
              {errors.abstract && (
                <p className="mt-1 text-sm text-red-600">{errors.abstract}</p>
              )}
            </div>

            {/* Publication Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                {t('typeOfWork')} *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`input ${errors.type ? 'input-error' : ''}`}
              >
                <option value="">{t('selectType')}</option>
                <option value="article">{t('journalArticle')}</option>
                <option value="conference_paper">{t('conferencePaper')}</option>
                <option value="book">{t('book')}</option>
                <option value="thesis">{t('thesis')}</option>
                <option value="community_report">{t('communityReport')}</option>
                <option value="other">{t('other')}</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('uploadFile')} *
              </label>
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                errors.file ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    {formData.file ? formData.file.name : t('choosePDF')}
                  </div>
                  <p className="text-sm text-gray-600">{t('maxFileSize')}</p>
                </label>
              </div>
              {errors.file && (
                <p className="mt-2 text-sm text-red-600">{errors.file}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <InformationCircleIcon className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Review Your Submission</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div><strong>Title:</strong> {formData.title}</div>
                <div><strong>Authors:</strong> {formData.authors}</div>
                <div><strong>Subject:</strong> {t(formData.subject)}</div>
                <div><strong>Level:</strong> {t(formData.level)}</div>
                <div><strong>Country:</strong> {formData.country}</div>
                {formData.institution && <div><strong>Institution:</strong> {formData.institution}</div>}
                <div><strong>Type:</strong> {t(formData.type)}</div>
                <div><strong>File:</strong> {formData.file?.name}</div>
              </div>
            </div>

            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">Submission successful!</span>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium">Submission failed. Please try again.</span>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay flex items-center justify-center p-4" role="dialog" aria-labelledby="upload-modal-title">
      <div className="modal-content">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 id="upload-modal-title" className="text-xl font-semibold text-gray-900">
              {t('submitResearch')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                      isCompleted 
                        ? 'bg-green-600 border-green-600 text-white' 
                        : isActive 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`ml-4 w-8 h-0.5 ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 max-h-96 overflow-y-auto">
          {renderStepContent()}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : prevStep}
            className="btn btn-secondary"
          >
            {currentStep === 1 ? t('cancel') : 'Previous'}
          </button>
          
          <div className="flex space-x-3">
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || submitStatus === 'success'}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  t('submit')
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}