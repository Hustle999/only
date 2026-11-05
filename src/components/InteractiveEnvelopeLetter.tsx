import React, { useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { getResolvedLetterText, isPlaceholderName, LetterConfig } from '../letterConfig';

interface InteractiveEnvelopeLetterProps {
  config: LetterConfig;
  isOpen: boolean;
  isOpening: boolean;
  isClosing: boolean;
  onOpen: () => void;
  onClose: () => void;
  reducedMotion?: boolean;
}

export const InteractiveEnvelopeLetter: React.FC<InteractiveEnvelopeLetterProps> = ({
  config,
  isOpen,
  isOpening,
  isClosing,
  onOpen,
  onClose,
  reducedMotion = false,
}) => {
  const letterTopRef = useRef<HTMLDivElement | null>(null);

  const resolvedText = getResolvedLetterText(config.letterText);
  const showRecipient = !isPlaceholderName(config.recipientName);
  const showSender = !isPlaceholderName(config.senderName);
  const paragraphs = resolvedText.split(/\n\s*\n/);

  // Staged choreography:
  //  1) opening  -> header fades/collapses, flap opens, paper peeks out of the pocket
  //  2) opened   -> the full letter slides up slowly to its real height
  //  3) closing  -> letter retracts first, flap closes only after that
  const flapOpen = isOpening || isOpen || isClosing;
  const letterShown = isOpen;
  const introVisible = !isOpening && !isOpen && !isClosing;
  const isExpanded = flapOpen;
  const SMOOTH_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

  const handleScrollToTop = () => {
    if (letterTopRef.current) {
      letterTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* =========================================================================
          1. OPENING SCREEN HEADER (Visible only when closed)
          Main title: “Хэлж амжаагүй үг.”
          Supporting line: a short, well-known English quote about love
          ========================================================================= */}
      <div
        aria-hidden={!introVisible}
        className={`grid w-full transition-[grid-template-rows,opacity,transform] ${
          reducedMotion ? 'duration-0' : 'duration-700'
        } ${introVisible ? 'grid-rows-[1fr] opacity-100 translate-y-0' : 'grid-rows-[0fr] opacity-0 -translate-y-3 pointer-events-none'}`}
        style={{ transitionTimingFunction: SMOOTH_EASE }}
      >
        <div className="min-h-0 overflow-hidden">
        <div className="w-full max-w-xl mx-auto mb-8 sm:mb-12 text-center space-y-3 sm:space-y-4 animate-fade-in">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#F4EFE7] tracking-tight text-balance leading-tight">
            Хэлж амжаагүй үг.
          </h1>

          <figure className="max-w-md mx-auto">
            <blockquote
              lang="en"
              className="font-serif italic text-base sm:text-lg text-[#AAA0C8]/90 leading-relaxed"
            >
              “Whatever our souls are made of, her and mine are the same.”
            </blockquote>
          </figure>
        </div>
        </div>
      </div>

      {/* =========================================================================
          2. INTEGRATED LETTER & ENVELOPE CONTAINER
          ========================================================================= */}
      <div className="relative w-full max-w-[360px] sm:max-w-[480px] md:max-w-[560px] flex flex-col items-center">
        {/* Top anchor for smooth scrolling */}
        <div ref={letterTopRef} className="scroll-mt-6" />

        {/* =====================================================================
            LETTER PAPER (Emerges upwards lengthwise out of the envelope)
            Its bottom edge is nestled inside the envelope pocket below!
            ===================================================================== */}
        <div
          aria-hidden={!letterShown}
          className={`relative grid w-full max-w-[340px] sm:max-w-[460px] md:max-w-[520px] z-10 transition-[grid-template-rows,opacity,transform] ${
            reducedMotion ? 'duration-0' : letterShown ? 'duration-[1600ms]' : 'duration-700'
          } ${
            letterShown
              ? 'grid-rows-[1fr] opacity-100 translate-y-0'
              : 'grid-rows-[0fr] opacity-0 translate-y-12 pointer-events-none'
          }`}
          style={{ transitionTimingFunction: SMOOTH_EASE }}
        >
          <div className="min-h-0 overflow-hidden">
          <article className="paper-sheet rounded-t-lg rounded-b-none p-6 pb-0 sm:p-10 sm:pb-0 md:p-12 md:pb-0 transition-all duration-300">
            {/* Stationery Header */}
            <div className="flex flex-col items-center justify-center pb-6 sm:pb-10 border-b border-[#DDD5C8]/80">
              <div className="w-6 h-6 sm:w-7 sm:h-7 mb-2.5 text-[#7A7299] opacity-75">
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
              <div className="pt-6 sm:pt-8 pb-3">
                <h2 className="font-signature text-[28px] sm:text-[32px] leading-tight text-[#1E1B18]">
                  {config.recipientName} чамд,
                </h2>
                <p className="font-signature text-lg sm:text-xl text-[#70685D] text-right mt-1">
                  2026/11/06
                </p>
              </div>
            )}

            {/* Letter Body - Pristine legibility, 18px+ mobile, ~1.8 line height */}
            <div className="pt-5 sm:pt-7 space-y-6 sm:space-y-7 text-[18px] sm:text-[19px] md:text-[20px] leading-[1.8] sm:leading-[1.85] text-[#2A2622] font-letter selection:bg-[#E2DCF0] selection:text-[#191624]">
              {paragraphs.map((paragraph, pIdx) => {
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
            <div className="pt-10 sm:pt-14 pb-4 flex flex-col items-end">
              <div className="text-right">
                <p className="font-signature text-xl sm:text-2xl text-[#70685D] mb-0.5">
                  {showSender ? 'Хүндэтгэсэн,' : 'Сэтгэлээс,'}
                </p>
                {showSender && (
                  <p className="font-signature text-[30px] sm:text-[34px] leading-tight text-[#1E1B18]">
                    {config.senderName}
                  </p>
                )}
              </div>
            </div>

            {/* Closing text block inside letter */}
            <div className="mt-10 sm:mt-14 pt-8 border-t border-[#E5DFD3] text-center pb-2">
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1E1B18] tracking-tight mb-2">
                PART 2?
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#70685D] tracking-wide mb-6 font-light">
                I never thought I’d feel this way.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleScrollToTop}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[#1E1B18] bg-[#EAE4D8] hover:bg-[#DFD8CB] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AAA0C8]"
                  aria-label="Дахин унших - Захианы эхлэл рүү очих"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-[#70685D]" />
                  <span>Дахин унших</span>
                </button>
              </div>
            </div>

            {/* Empty bottom strip of paper that sits hidden inside the envelope pocket */}
            <div aria-hidden="true" style={{ paddingBottom: '36%' }} />
          </article>
          </div>
        </div>

        {/* =====================================================================
            3. THE ENVELOPE — built from separate layers so the paper can
            slide INSIDE it:  back wall (z-0) < paper (z-10) < front pocket (z-20)
            When open, the envelope rises over the bottom of the paper so the
            sheet's lower edge is tucked behind the front pocket flaps.
            ===================================================================== */}
        <button
          type="button"
          onClick={isExpanded ? onClose : onOpen}
          aria-label={isExpanded ? 'Дугтуйн дээр дарж захиаг хаах' : 'Захиаг нээх'}
          title={isExpanded ? 'Дугтуйн дээр дарж захиаг хаах' : 'Захиаг нээх'}
          className={`group relative block w-full aspect-[16/10] select-none text-left rounded-lg cursor-pointer transition-[margin] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AAA0C8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1019] ${
            reducedMotion ? 'duration-0' : letterShown ? 'duration-[1600ms]' : 'duration-700'
          }`}
          style={{
            // Percent margins are relative to width: 30% of width ≈ 48% of the envelope's height
            marginTop: letterShown ? '-30%' : '0%',
            transitionTimingFunction: SMOOTH_EASE,
          }}
        >
          {/* Deep ambient shadow under envelope */}
          <div
            className="absolute -inset-2 sm:-inset-3 rounded-2xl opacity-60 pointer-events-none z-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 65%, rgba(0, 0, 0, 0.75) 0%, rgba(11, 16, 25, 0) 75%)',
              filter: 'blur(10px)',
            }}
          />

          {/* BACK WALL of the envelope (behind the paper) */}
          <div
            className="absolute inset-0 rounded-lg bg-[#121927] border border-[#232F42] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] pointer-events-none z-0 transition-colors duration-300 group-hover:border-[#2E3B52]"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 30%, #1A2338 0%, #101623 80%)',
            }}
          >
            {/* soft inner shade where the paper slides in */}
            <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-lg bg-gradient-to-b from-black/30 to-transparent" />
          </div>

          {/* TOP FLAP — closed: folded down over the pocket (in front).
              open: flipped up behind the paper. */}
          <div
            className={`absolute top-0 left-0 right-0 origin-top transition-transform duration-700 ease-in-out pointer-events-none ${
              flapOpen ? '-scale-y-100 z-[1]' : 'scale-y-100 z-30'
            }`}
            style={{ height: '55%' }}
          >
            <svg className="w-full h-full" viewBox="0 0 440 155" preserveAspectRatio="none">
              <polygon
                points="0,0 440,0 220,155"
                fill={flapOpen ? '#111A29' : '#162235'}
                stroke="#29374E"
                strokeWidth="1"
              />
              <line x1="0" y1="1" x2="440" y2="1" stroke="rgba(170, 160, 200, 0.25)" strokeWidth="1" />
            </svg>
          </div>

          {/* Small preview sheet peeking out during the opening phase (clipped to the envelope) */}
          {!reducedMotion && (
            <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none z-[5]">
              <div
                className={`absolute left-4 right-4 sm:left-6 sm:right-6 bottom-3 bg-[#FAF7F2] rounded-t-sm shadow-md transition-all duration-700 ${
                  isOpening
                    ? '-translate-y-16 sm:-translate-y-20 opacity-95'
                    : isOpen
                    ? '-translate-y-28 sm:-translate-y-36 opacity-0'
                    : 'translate-y-2 opacity-0'
                }`}
                style={{ height: '70%', transitionTimingFunction: SMOOTH_EASE }}
              >
                <div className="p-4 sm:p-5 flex flex-col gap-2">
                  <div className="w-12 h-0.5 bg-[#DDD5C8] rounded" />
                  <div className="w-24 h-0.5 bg-[#DDD5C8] rounded" />
                </div>
              </div>
            </div>
          )}

          {/* FRONT POCKET: left, right & bottom flaps — drawn IN FRONT of the paper */}
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none z-20">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 440 280" preserveAspectRatio="none">
              {/* Left flap */}
              <polygon points="0,0 220,165 0,280" fill="#141E2F" stroke="#212C3F" strokeWidth="0.8" />
              {/* Right flap */}
              <polygon points="440,0 220,165 440,280" fill="#131C2C" stroke="#212C3F" strokeWidth="0.8" />
              {/* Bottom flap */}
              <polygon points="0,280 220,140 440,280" fill="#0F1724" stroke="#253247" strokeWidth="0.8" />
            </svg>
            {/* thin highlight along the pocket rim, so the opening edge reads clearly */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 440 280" preserveAspectRatio="none">
              <polyline
                points="0,0 220,165 440,0"
                fill="none"
                stroke="rgba(170, 160, 200, 0.18)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {/* Side & bottom rim only — a top border here would cut across the paper */}
            <div className="absolute inset-0 rounded-lg border border-t-0 border-[#232F42]" />
          </div>

          {/* Hint on the closed envelope face: tap the envelope to open */}
          <div
            className={`absolute bottom-4 sm:bottom-5 left-0 right-0 text-center transition-opacity duration-300 z-30 pointer-events-none ${
              flapOpen ? 'opacity-0' : 'opacity-85'
            }`}
          >
            <span className="font-serif italic text-xs sm:text-sm text-[#F4EFE7]/80 tracking-widest border-b border-[#AAA0C8]/25 pb-0.5 animate-pulse [animation-duration:3s]">
              Дугтуйн дээр дарж нээнэ үү
            </span>
          </div>

          {/* Central Silver Moon Wax Seal (sits on the front pocket) */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-700 ease-out pointer-events-none ${
              flapOpen ? 'top-[66%] scale-90 opacity-90' : 'top-[50%] scale-100 opacity-100'
            }`}
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full silver-moon-seal flex items-center justify-center">
              <div className="absolute inset-1 rounded-full border border-white/30" />
              <div className="absolute inset-2 rounded-full border border-black/20" />
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 sm:w-6 sm:h-6 text-[#252B38] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]"
                fill="currentColor"
              >
                <path d="M12.3 2a10 10 0 0 0-1.9 19.8 10 10 0 0 0 11.2-8.5 7.5 7.5 0 0 1-9.3-11.3z" />
              </svg>
            </div>
          </div>

          {/* Hint (on the front pocket) that clicking the envelope closes the letter */}
          {isExpanded && (
            <div
              className={`absolute bottom-3 sm:bottom-4 left-0 right-0 text-center z-30 pointer-events-none transition-opacity duration-700 delay-500 ${
                letterShown ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="font-sans text-[10px] sm:text-[11px] text-[#AAA0C8] tracking-wider uppercase opacity-85 bg-[#0B1019]/70 px-3 py-1 rounded-full border border-[#AAA0C8]/20">
                Дугтуйн дээр дарж захиаг хаах
              </span>
            </div>
          )}
        </button>

      </div>
    </div>
  );
};
