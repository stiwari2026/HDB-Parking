import React, { useEffect } from 'react';

const DISQUS_SHORTNAME = 'hdbparking';
const PAGE_URL = 'https://hdbparkinglots.vercel.app/';
const PAGE_IDENTIFIER = 'home';
const SCRIPT_ID = 'disqus-embed-script';

declare global {
  interface Window {
    disqus_config?: (this: { page: { url: string; identifier: string } }) => void;
    DISQUS?: { reset: (options: { reload: boolean; config: Window['disqus_config'] }) => void };
  }
}

export function DisqusComments() {
  useEffect(() => {
    window.disqus_config = function () {
      this.page.url = PAGE_URL;
      this.page.identifier = PAGE_IDENTIFIER;
    };

    // Load embed.js only once; if it is already on the page, re-attach the thread instead
    if (document.getElementById(SCRIPT_ID)) {
      window.DISQUS?.reset({ reload: true, config: window.disqus_config });
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
    script.setAttribute('data-timestamp', String(+new Date()));
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section
      id="feedback-comments"
      className="border-t border-slate-800/80 px-3 sm:px-4 py-3 max-h-[40vh] overflow-y-auto shrink-0"
      // Disqus cannot parse Tailwind v4's oklch() colors, so give it plain rgb values to read
      style={{ backgroundColor: 'rgb(2, 6, 23)', color: 'rgb(203, 213, 225)' }}
    >
      <p className="text-xs sm:text-sm text-slate-300 mb-2">
        Tried the app? Tell us what worked for you and what did not.
      </p>
      <div id="disqus_thread" style={{ color: 'rgb(203, 213, 225)' }} />
    </section>
  );
}
