import React from 'react';
import { useRouter } from '../context/RouterContext';
import { PageRoute } from '../types';
import { Disc, Shield, FileText, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  const handleNav = (route: PageRoute) => {
    navigate(route);
  };

  return (
    <footer id="site-footer" className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 transition-colors mt-12 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
          {/* Brand info */}
          <div className="max-w-sm">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <Disc className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white tracking-tight">
                Wheel Spinner
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A fair, private, and customizable random decision maker. Powered by browser cryptography, zero tracking, and no account required.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <button
              id="footer-link-wheel"
              onClick={() => handleNav('/wheel-spinner')}
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
            >
              <Disc className="w-4 h-4" />
              Wheel Spinner
            </button>
            <button
              id="footer-link-privacy"
              onClick={() => handleNav('/privacy-policy')}
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Privacy Policy
            </button>
            <button
              id="footer-link-terms"
              onClick={() => handleNav('/terms')}
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Terms of Use
            </button>
            <button
              id="footer-link-contact"
              onClick={() => handleNav('/contact')}
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Wheel Spinner. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for fair random decisions <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
