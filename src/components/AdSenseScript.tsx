import React, { useEffect } from 'react';

interface AdSenseScriptProps {
  publisherId?: string; // Placeholder e.g. "ca-pub-0000000000000000"
  enabled?: boolean;
}

/**
 * Script loader component for Google AdSense.
 * Defaults to inactive placeholder mode so no live script executes without real credentials.
 */
export const AdSenseScript: React.FC<AdSenseScriptProps> = ({
  publisherId = 'ca-pub-0000000000000000',
  enabled = false,
}) => {
  useEffect(() => {
    if (!enabled || !publisherId || publisherId === 'ca-pub-0000000000000000') {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [publisherId, enabled]);

  return null;
};
