import React, { useEffect } from 'react';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const TermsPage: React.FC = () => {
  const { navigate } = useRouter();

  useEffect(() => {
    document.title = 'Terms of Use - Wheel Spinner';
  }, []);

  return (
    <div id="terms-page" className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Last Updated: September 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          Terms of Use
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Please read these Terms of Use carefully before using the Wheel Spinner application.
        </p>
      </div>

      {/* Terms Body */}
      <div className="space-y-8 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-slate-900 dark:text-white font-bold text-lg">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the Wheel Spinner website, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any part of these terms, you are prohibited from using the service.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-slate-900 dark:text-white font-bold text-lg">
            2. Permitted Use & Utility Purpose
          </h2>
          <p>
            Wheel Spinner is provided as a free, online random decision tool for educational, entertainment, raffle, classroom, and personal decision-making purposes. You agree to use the tool in compliance with all local laws and not for unlawful gambling, fraudulent contests, or abusive activities.
          </p>
          <div className="flex items-start gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>You retain full ownership of all custom entries you input into the tool.</span>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2>3. Disclaimer of Warranties</h2>
          </div>
          <p>
            Wheel Spinner is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied. While we employ cryptographic browser random number generators (<code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs">crypto.getRandomValues</code>) to ensure fairness, we make no guarantees that the website will always be uninterrupted or error-free.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-slate-900 dark:text-white font-bold text-lg">
            4. Limitation of Liability
          </h2>
          <p>
            In no event shall Wheel Spinner or its operators be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this service or decisions made based on the results of the spinner.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-slate-900 dark:text-white font-bold text-lg">
            5. Inquiries
          </h2>
          <p>
            For questions regarding these Terms, please reach out through our{' '}
            <button
              id="terms-contact-link"
              onClick={() => navigate('/contact')}
              className="text-indigo-600 dark:text-indigo-400 underline font-medium"
            >
              Contact page
            </button>
            .
          </p>
        </section>
      </div>
    </div>
  );
};
