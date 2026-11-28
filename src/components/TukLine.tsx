import React from 'react';
import type { Tuk } from '../types/pothi';
import { toLarivaar, transliterateGurmukhi } from '../utils/gurbaniSearch';

interface TukLineProps {
  tuk: Tuk;
  larivaar: boolean;
  showTransliteration: boolean;
  fontSize: number;
  highlighted?: boolean;
  centered?: boolean;
  onSelect?: () => void;
}

export const TukLine: React.FC<TukLineProps> = ({
  tuk,
  larivaar,
  showTransliteration,
  fontSize,
  highlighted = false,
  centered = false,
  onSelect,
}) => {
  const phoneticRoman = showTransliteration ? transliterateGurmukhi(tuk.gurmukhi) : '';

  return (
    <article
      onClick={onSelect}
      className={`py-5 border-b pothi-divider last:border-b-0 ${
        highlighted
          ? 'bg-[var(--accent-gold-soft)] -mx-4 px-4 rounded-xl border-transparent'
          : ''
      } ${centered ? 'text-center' : 'text-left'} ${
        onSelect ? 'cursor-pointer' : ''
      }`}
    >
      <p
        lang="pa"
        className={`font-gurmukhi-noto ${larivaar ? 'larivaar-mode' : ''} leading-[1.85] text-[var(--ink-primary)] break-words`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {larivaar ? toLarivaar(tuk.gurmukhi) : tuk.gurmukhi}
      </p>

      {showTransliteration && phoneticRoman && (
        <p
          className={`mt-2.5 text-[15px] leading-relaxed text-[var(--accent-gold)] ${
            centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'
          }`}
        >
          {phoneticRoman}
        </p>
      )}

      {tuk.inHouseTranslation && (
        <p
          className={`mt-1.5 text-[15px] leading-relaxed text-[var(--ink-secondary)] ${
            centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'
          }`}
        >
          {tuk.inHouseTranslation}
        </p>
      )}

      {tuk.faridkotTeeka && (
        <div
          className={`mt-3 pt-2.5 border-t pothi-divider text-sm leading-relaxed text-[var(--ink-muted)] ${
            centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'
          }`}
        >
          <span className="font-semibold text-[var(--ink-secondary)] mr-2">
            Faridkot Vala Teeka (Public Domain):
          </span>
          <span lang="pa" className="font-gurmukhi-noto">
            {tuk.faridkotTeeka}
          </span>
        </div>
      )}
    </article>
  );
};
