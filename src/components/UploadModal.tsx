'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

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
    { id: 1, name: 'Basic Information', description: 'Title, authors, and classification' },
    { id: 2, name: 'Details & Upload', description: 'Abstract and file upload' },
    { id: 3, name: 'Review & Submit', description: 'Final review and submission' },
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
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Submission failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Publication Title *
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-sm border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.title ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter the full title of your research publication"
              />
              {errors.title && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.title}</span>
                </p>
              )}
            </div>

            {/* Authors */}
            <div className="space-y-2">
              <label htmlFor="authors" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Authors *
              </label>
              <input
                id="authors"
                type="text"
                name="authors"
                value={formData.authors}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-sm border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.authors ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="e.g., Dr. Amina Kano, Prof. Ibrahim Lagos"
              />
              {errors.authors && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.authors}</span>
                </p>
              )}
            </div>

            {/* Subject and Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Subject Area *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 text-sm border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.subject ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select Subject</option>
                  <option value="agri">Agriculture</option>
                  <option value="cs">Computer Science</option>
                  <option value="econ">Economics</option>
                  <option value="edu">Education</option>
                  <option value="env">Environmental Science</option>
                  <option value="med">Medicine & Health</option>
                  <option value="math">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="soc">Social Sciences</option>
                </select>
                {errors.subject && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="level" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Research Level *
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 text-sm border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.level ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select Level</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="doctoral">Doctoral</option>
                  <option value="postdoctoral">Postdoctoral</option>
                </select>
                {errors.level && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.level}</p>
                )}
              </div>
            </div>

            {/* Country and Institution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="country" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 text-sm border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    errors.country ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select Country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Ghana">Ghana</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Uganda">Uganda</option>
                  <option value="India">India</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Brazil">Brazil</option>
                </select>
                {errors.country && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.country}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="institution" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Institution
                </label>
                <input
                  id="institution"
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="University or research center name"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Abstract */}
            <div className="space-y-2">
              <label htmlFor="abstract" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Abstract *
              </label>
              <textarea
                id="abstract"
                name="abstract"
                value={formData.abstract}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 text-sm border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
                  errors.abstract ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Provide a concise summary of your research"
              />
              {errors.abstract && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.abstract}</span>
                </p>
              )}
            </div>

            {/* Publication Type */}
            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Publication Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 text-sm border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.type ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select Type</option>
                <option value="article">Journal Article</option>
                <option value="conference_paper">Conference Paper</option>
                <option value="working_paper">Working Paper</option>
                <option value="book">Book</option>
                <option value="thesis">Thesis</option>
                <option value="technical_report">Technical Report</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.type}</span>
                </p>
              )}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Upload PDF *
              </label>
              <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                errors.file 
                  ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {formData.file ? formData.file.name : 'Choose PDF File'}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">PDF only, max 5MB</p>
                </label>
              </div>
              {errors.file && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.file}</span>
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300">Review Your Submission</h3>
              </div>
              <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="grid grid-cols-3 gap-4 py-2 border-b border-blue-200 dark:border-blue-800">
                  <div className="font-semibold">Title:</div>
                  <div className="col-span-2">{formData.title}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-2 border-b border-blue-200 dark:border-blue-800">
                  <div className="font-semibold">Authors:</div>
                  <div className="col-span-2">{formData.authors}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-2 border-b border-blue-200 dark:border-blue-800">
                  <div className="font-semibold">Subject:</div>
                  <div className="col-span-2">{formData.subject}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-2 border-b border-blue-200 dark:border-blue-800">
                  <div className="font-semibold">Level:</div>
                  <div className="col-span-2">{formData.level}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-2 border-b border-blue-200 dark:border-blue-800">
                  <div className="font-semibold">Country:</div>
                  <div className="col-span-2">{formData.country}</div>
                </div>
                {formData.institution && (
                  <div className="grid grid-cols-3 gap-4 py-2 border-b border-blue-200 dark:border-blue-800">
                    <div className="font-semibold">Institution:</div>
                    <div className="col-span-2">{formData.institution}</div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 py-2 border-b border-blue-200 dark:border-blue-800">
                  <div className="font-semibold">Type:</div>
                  <div className="col-span-2">{formData.type}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="font-semibold">File:</div>
                  <div className="col-span-2">{formData.file?.name}</div>
                </div>
              </div>
            </div>

            {submitStatus === 'success' && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-green-800 dark:text-green-300 font-semibold text-lg">Submission successful!</span>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-red-800 dark:text-red-300 font-semibold text-lg">Submission failed. Please try again.</span>
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full mx-auto max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Submit Research Publication
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all ${
                        isCompleted 
                          ? 'bg-white text-green-600 border-white' 
                          : isActive 
                          ? 'bg-white text-blue-600 border-white' 
                          : 'border-white/40 text-white/60'
                      }`}>
                        {isCompleted ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="font-bold">{step.id}</span>
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <div className={`text-sm font-semibold ${
                          isActive ? 'text-white' : isCompleted ? 'text-white' : 'text-white/60'
                        }`}>
                          {step.name}
                        </div>
                        <div className="text-xs text-white/60 mt-1">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-1 mx-4 rounded-full ${
                        isCompleted ? 'bg-white' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 max-h-[60vh] overflow-y-auto">
          {renderStepContent()}
        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700 flex justify-between bg-gray-50 dark:bg-gray-900/50">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : prevStep}
            className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <div className="flex space-x-4">
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg transform hover:scale-105"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || submitStatus === 'success'}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}