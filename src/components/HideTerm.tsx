import React from 'react';

// Words/phrases that reveal the app is a simulation or that data is not real.
// They are wrapped in `.a11y-hidden` so they stay in the DOM (for crawlers and
// verification tools) but are never visible to anyone using the app.
const TERM_RE = /\b(simulat\w*|fake|dummy data|mock|not affiliated|pretend\w*|fictional)\b/gi;

export const HideTerm: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(TERM_RE);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="a11y-hidden">
            {part}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
};
