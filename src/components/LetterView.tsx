import React, { useRef } from 'react';
import { ArrowUp, RotateCcw } from 'lucide-react';
import { getResolvedLetterText, isPlaceholderName } from '../letterConfig';

interface LetterViewProps {
  recipientName: string;
  senderName: string;
  letterText: string;
  onCloseToEnvelope: () => void;
}

export const LetterView: React.FC<LetterViewProps> = ({
  recipientName,
  senderName,
  letterText,
  onCloseToEnvelope,
}) => {
  const letterTopRef = useRef<HTMLDivElement | null>(null);

  const resolvedText = getResolvedLetterText(letterText);
  const showRecipient = !isPlaceholderName(recipientName);
  const showSender = !isPlaceholderName(senderName);

  // Preserve exact paragraph structure and internal linebreaks
  // Split on double newlines for distinct paragraphs, while keeping single newlines as line breaks
  const paragraphs = resolvedText.split(/\n\s*\n/);

  const handleScrollToTop = () => {
    if (letterTopRef.current) {
      letterTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-14 animate-fade-in">
      {/* Top anchor for smooth scrolling back to start */}
      <div ref={letterTopRef} className="scroll-mt-6" />

      {/* Warm, Softly Lit Physical Letter Surface */}
      <article className="paper-sheet rounded-md sm:rounded-lg p-6 sm:p-10 md:p-14 lg:p-16 transition-all duration-300">
        {/* Subtle Top Lunar Emblem / Stationery Header */}
        <div className="flex flex-col items-center justify-center pb-8 sm:pb-12 border-b border-[#DDD5C8]/80">
          <div className="w-6 h-6 sm:w-7 sm:h-7 mb-3 text-[#7A7299] opacity-75">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12.3 2a10 10 0 0 0-1.9 19.8 10 10 0 0 0 11.2-8.5 7.5 7.5 0 0 1-9.3-11.3z" />
            </svg>
          </div>
          <span className="font-serif italic text-xs tracking-widest text-[#70685D] uppercase">
            Сарны гэрэлд
          </span>
        </div>

        {/* Recipient Greeting if specified */}
        {showRecipient && (
          <div className="pt-8 sm:pt-10 pb-4">
            <h2 className="font-serif text-xl sm:text-2xl text-[#1E1B18] font-medium tracking-wide">
              {recipientName} чамд,
            </h2>
          </div>
        )}

        {/* Letter Body - Pristine legibility, 18px+ mobile, ~1.8 line height */}
        <div className="pt-6 sm:pt-8 space-y-6 sm:space-y-7 text-[18px] sm:text-[19px] md:text-[20px] leading-[1.8] sm:leading-[1.85] text-[#24211D] font-sans font-normal selection:bg-[#E2DCF0] selection:text-[#191624]">
          {paragraphs.map((paragraph, pIdx) => {
            // Split individual paragraph by single newline to preserve stanza/poetry breaks
            const lines = paragraph.split('\n');
            return (
              <p key={pIdx} className="text-pretty">
                {lines.map((line, lIdx) => (
                  <React.Fragment key={lIdx}>
                    {line}
                    {lIdx < lines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            );
          })}
        </div>

        {/* Sender Sign-off */}
        <div className="pt-12 sm:pt-16 pb-4 flex flex-col items-end">
          <div className="text-right">
            <p className="font-serif italic text-sm text-[#70685D] mb-1">
              {showSender ? 'Хүндэтгэсэн,' : 'Сэтгэлээс,'}
            </p>
            {showSender && (
              <p className="font-serif text-lg sm:text-xl text-[#1E1B18] font-medium tracking-wide">
                {senderName}
              </p>
            )}
          </div>
        </div>

        {/* Delicate divider inside stationery */}
        <div className="mt-12 pt-8 border-t border-[#E5DFD3] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#AAA0C8]/60" />
        </div>
      </article>

      {/* Closing Section Required:
          Display: “Уншсанд баярлалаа.”
          Supporting text: “Хариулах гэж яарах хэрэггүй.”
          Provide a subtle “Дахин унших” control that scrolls back to the start of the letter.
      */}
      <section className="mt-14 sm:mt-20 text-center pb-12 sm:pb-20">
        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#F4EFE7] tracking-tight mb-3">
          Уншсанд баярлалаа.
        </h3>
        <p className="font-sans text-sm sm:text-base text-[#AAA0C8] tracking-wide mb-8 font-light">
          Хариулах гэж яарах хэрэггүй.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleScrollToTop}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#F4EFE7] bg-[#162030] hover:bg-[#1E2B40] border border-[#AAA0C8]/25 hover:border-[#AAA0C8]/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AAA0C8]"
            aria-label="Дахин унших - Захианы эхлэл рүү очих"
          >
            <ArrowUp className="w-4 h-4 text-[#AAA0C8]" />
            <span>Дахин унших</span>
          </button>

          <button
            type="button"
            onClick={onCloseToEnvelope}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm text-[#AAA0C8] hover:text-[#F4EFE7] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#AAA0C8]"
            aria-label="Захиаг буцааж хаах"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Захиаг буцааж хаах</span>
          </button>
        </div>
      </section>
    </div>
  );
};
