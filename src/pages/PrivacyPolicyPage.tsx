import React, { useEffect } from 'react';
import { Shield, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { navigate } = useRouter();

  useEffect(() => {
    document.title = 'Privacy Policy - Wheel Spinner';
  }, []);

  return (
    <div id="privacy-policy-page" className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>Effective Date: September 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          At Wheel Spinner, your privacy is our top priority. We operate under a simple principle: your data belongs to you.
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg">
            <Lock className="w-5 h-5 text-indigo-500" />
            <h2>1. Zero Server-Side Data Collection</h2>
          </div>
          <p>
            Wheel Spinner does not transmit, store, or process your entered choices or custom list items on any external server. All text, entries, and random calculations happen strictly inside your local web browser.
          </p>
          <ul className="space-y-1.5 pt-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>No user accounts or logins required</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>No personal identifying information (PII) is gathered</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>No backend database holds your decisions or list entries</span>
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg">
            <EyeOff className="w-5 h-5 text-indigo-500" />
            <h2>2. Local Storage Usage</h2>
          </div>
          <p>
            To provide a seamless experience, Wheel Spinner utilizes your browser&apos;s standard <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">localStorage</code> to remember your entered list items and chosen theme across page refreshes.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You can delete this data at any time by clicking the &ldquo;Clear all&rdquo; button or by clearing your browser cache.
          </p>
        </section>

        {/* Section 3 */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h2>3. Advertising Partners & Cookies</h2>
          </div>
          <p>
            We may show advertisements served by third-party ad networks such as Google AdSense. Third-party vendors may use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.
          </p>
          <p>
            You may opt out of personalized advertising by visiting Google&apos;s Ads Settings (<a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">www.google.com/settings/ads</a>).
          </p>
        </section>

        {/* Section 4 */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-slate-900 dark:text-white font-bold text-lg">
            4. Changes to This Policy
          </h2>
          <p>
            We may update our Privacy Policy periodically. Any revisions will be reflected on this page with an updated effective date.
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h2 className="text-slate-900 dark:text-white font-bold text-lg">
            5. Contact Us
          </h2>
          <p>
            If you have questions regarding this privacy policy, please reach out to our team via our{' '}
            <button
              id="privacy-contact-link"
              onClick={() => navigate('/contact')}
              className="text-indigo-600 dark:text-indigo-400 underline font-medium"
            >
              Contact page
            </button>
            {' '}or email <span className="font-semibold text-slate-900 dark:text-white">support@wheelspinner.app</span>.
          </p>
        </section>
      </div>
    </div>
  );
};
