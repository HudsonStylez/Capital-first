import React from 'react';
import { SmartImage } from './SmartImage';

/**
 * Renders a support message. Any `[[img:<url|key>]]` marker is shown as an inline
 * image (cloud URL or IndexedDB key), the rest as text.
 */
export const MessageText: React.FC<{ text: string }> = ({ text }) => {
  const parts = (text || '').split(/(\[\[img:[^\]]+\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = /^\[\[img:(.+)\]\]$/.exec(part);
        if (m) {
          const ref = m[1];
          const isUrl = /^(https?:|data:)/.test(ref);
          return (
            <div key={i} className="my-1">
              <SmartImage
                imageUrl={isUrl ? ref : undefined}
                imageKey={!isUrl ? ref : undefined}
                alt="attachment"
                className="max-h-60 max-w-full rounded-lg border border-slate-300 bg-black/5"
                downloadName="attachment.jpg"
              />
            </div>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};

export default MessageText;