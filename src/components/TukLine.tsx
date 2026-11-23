import React from 'react';
import type { GurmukhiFont, Tuk } from '../types/pothi';
import { toLarivaar, tokenizeWithVishraam } from '../utils/gurbaniSearch';

interface TukLineProps {
  tuk: Tuk;
  larivaar: boolean;
  vishraam: boolean;
  showTransliteration: boolean;
  showEnglish: boolean;
  showTeeka: boolean;
  fontSize: number;
  gurmukhiFont: GurmukhiFont;
  highlighted?: boolean;
  centered?: boolean;
  onSelect?: () => void;
}

export const TukLine: React.FC<TukLineProps> = ({
  tuk,
  larivaar,
  vishraam,
  showTransliteration,
  showEnglish,
  showTeeka,
  fontSize,
  gurmukhiFont,
  highlighted = false,
  centered = false,
  onSelect,
}) => {
  const fontClass =
    gurmukhiFont === 'GurbaniAkharThick'
      ? 'font-gurmukhi-akhar'
      : 'font-gurmukhi-noto';

  const tokens = tokenizeWithVishraam(tuk.gurmukhi, tuk.vishraam);

  return (
    <article
      onClick={onSelect}
      className={`py-5 border-b pothi-divider last:border-b-0 transition-colors ${
        highlighted
          ? 'bg-[var(--accent-gold-soft)] -mx-4 px-4 rounded-xl border-transparent'
          : ''
      } ${centered ? 'text-center' : 'text-left'} ${
        onSelect ? 'cursor-pointer' : ''
      }`}
    >
      <p
        lang="pa"
        className={`${fontClass} ${larivaar ? 'larivaar-mode' : ''} leading-[1.85] text-[var(--ink-primary)] break-words`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {larivaar ? (
          vishraam && tuk.vishraam && tuk.vishraam.length > 0 ? (
            tokens.map((tok, idx) => (
              <span
                key={`${tuk.id}-lv-${idx}`}
                className={
                  tok.vishraamType === 'primary'
                    ? 'vishraam-primary'
                    : tok.vishraamType === 'secondary'
                      ? 'vishraam-secondary'
                      : undefined
                }
                title={
                  tok.vishraamType === 'primary'
                    ? 'Primary Vishraam (Heavy Pause)'
                    : tok.vishraamType === 'secondary'
                      ? 'Secondary Vishraam (Light Pause)'
                      : undefined
                }
              >
                {tok.word}
              </span>
            ))
          ) : (
            toLarivaar(tuk.gurmukhi)
          )
        ) : (
          tokens.map((tok, idx) => (
            <React.Fragment key={`${tuk.id}-pc-${idx}`}>
              <span
                className={
                  vishraam && tok.vishraamType === 'primary'
                    ? 'vishraam-primary'
                    : vishraam && tok.vishraamType === 'secondary'
                      ? 'vishraam-secondary'
                      : undefined
                }
                title={
                  vishraam && tok.vishraamType === 'primary'
                    ? 'Primary Vishraam (Heavy Pause)'
                    : vishraam && tok.vishraamType === 'secondary'
                      ? 'Secondary Vishraam (Light Pause)'
                      : undefined
                }
              >
                {tok.word}
              </span>
              {idx < tokens.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))
        )}
      </p>

      {showTransliteration && tuk.transliteration && (
        <p
          className={`mt-2.5 text-[15px] leading-relaxed text-[var(--accent-gold)] ${
            centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'
          }`}
        >
          {tuk.transliteration}
        </p>
      )}

      {showEnglish && tuk.english && (
        <p
          className={`mt-1.5 text-[15px] leading-relaxed text-[var(--ink-secondary)] ${
            centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'
          }`}
        >
          {tuk.english}
        </p>
      )}

      {showTeeka && tuk.teeka && (
        <div
          className={`mt-3 pt-2.5 border-t pothi-divider text-sm leading-relaxed text-[var(--ink-muted)] ${
            centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'
          }`}
        >
          <span className="font-semibold text-[var(--ink-secondary)] mr-2">
            Teeka / Arth:
          </span>
          <span lang="pa" className="font-gurmukhi-noto">
            {tuk.teeka}
          </span>
        </div>
      )}
    </article>
  );
};
