import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

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
  // Collapsed by default so the comments never take space from the map
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  // Load Disqus the first time the section is opened, then keep it mounted
  useEffect(() => {
    if (!hasOpened) return;

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
  }, [hasOpened]);

  return (
    <section
      id="feedback-comments"
      className={`border-t border-slate-800/80 px-3 sm:px-4 shrink-0 ${
        isOpen ? 'py-3 max-h-[40vh] overflow-y-auto' : 'py-1.5'
      }`}
      // Disqus cannot parse Tailwind v4's oklch() colors, so give it plain rgb values to read
      style={{ backgroundColor: 'rgb(2, 6, 23)', color: 'rgb(203, 213, 225)' }}
    >
      <button
        id="btn-toggle-comments"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="disqus_thread"
        className="w-full flex items-center justify-between gap-2 text-left text-xs sm:text-sm text-slate-300 hover:text-white min-h-[32px]"
      >
        <span className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 shrink-0" />
          Tried the app? Tell us what worked for you and what did not.
        </span>
        <span className="flex items-center gap-1 shrink-0 font-semibold">
          {isOpen ? 'Hide comments' : 'Show comments'}
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </span>
      </button>
      <div
        id="disqus_thread"
        hidden={!isOpen}
        className="mt-2"
        style={{ color: 'rgb(203, 213, 225)' }}
      />
    </section>
  );
}
