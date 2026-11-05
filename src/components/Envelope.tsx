import React from 'react';

interface EnvelopeProps {
  isOpening: boolean;
  onOpen: () => void;
  recipientName?: string;
}

export const Envelope: React.FC<EnvelopeProps> = ({
  isOpening,
  onOpen,
  recipientName,
}) => {
  const hasCustomRecipient =
    recipientName &&
    recipientName.trim() !== '' &&
    recipientName !== '[HER_NAME]' &&
    recipientName !== 'HER_NAME';

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] aspect-[16/11] select-none mx-auto">
      {/* Interactive Envelope Wrapper */}
      <button
        type="button"
        onClick={onOpen}
        disabled={isOpening}
        aria-label="Захиаг нээх"
        className="group relative w-full h-full text-left rounded-lg transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AAA0C8] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0B1019] cursor-pointer"
        style={{ perspective: '1200px' }}
      >
        {/* Deep ambient shadow under envelope */}
        <div
          className="absolute -inset-2 sm:-inset-3 rounded-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-85 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 65%, rgba(0, 0, 0, 0.75) 0%, rgba(11, 16, 25, 0) 75%)',
            filter: 'blur(10px)',
          }}
        />

        {/* Envelope Container */}
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#121927] border border-[#232F42] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]">
          {/* Subtle interior lining texture / deep midnight purple shimmer */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 30%, #1A2338 0%, #101623 80%)',
            }}
          />

          {/* Letter Peeking / Rising from inside during opening */}
          <div
            className={`absolute left-4 right-4 sm:left-6 sm:right-6 bottom-3 bg-[#FAF7F2] rounded-t-sm shadow-md transition-all duration-700 ease-out ${
              isOpening
                ? '-translate-y-24 sm:-translate-y-32 opacity-95 scale-100'
                : 'translate-y-2 opacity-0'
            }`}
            style={{ height: '70%' }}
          >
            <div className="p-4 sm:p-5 flex flex-col gap-2">
              <div className="w-12 h-0.5 bg-[#DDD5C8] rounded" />
              <div className="w-24 h-0.5 bg-[#DDD5C8] rounded" />
            </div>
          </div>

          {/* Envelope Pocket Geometry (Left & Right Flaps) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 440 300"
            preserveAspectRatio="none"
          >
            {/* Left triangle flap */}
            <polygon
              points="0,0 220,175 0,300"
              fill="#141E2F"
              stroke="#212C3F"
              strokeWidth="0.8"
              opacity="0.95"
            />
            {/* Right triangle flap */}
            <polygon
              points="440,0 220,175 440,300"
              fill="#131C2C"
              stroke="#212C3F"
              strokeWidth="0.8"
              opacity="0.95"
            />
            {/* Bottom triangle flap */}
            <polygon
              points="0,300 220,150 440,300"
              fill="#0F1724"
              stroke="#253247"
              strokeWidth="0.8"
            />
          </svg>

          {/* Recipient name label on the envelope face if configured */}
          {hasCustomRecipient && (
            <div
              className={`absolute bottom-5 sm:bottom-6 left-0 right-0 text-center transition-opacity duration-300 ${
                isOpening ? 'opacity-0' : 'opacity-85'
              }`}
            >
              <span className="font-serif italic text-xs sm:text-sm text-[#F4EFE7]/80 tracking-widest border-b border-[#AAA0C8]/25 pb-0.5">
                {recipientName}
              </span>
            </div>
          )}

          {/* Top Envelope Flap with 3D Fold Transition */}
          <div
            className={`absolute top-0 left-0 right-0 origin-top transition-transform duration-700 ease-in-out pointer-events-none ${
              isOpening ? '-scale-y-100 -translate-y-1' : ''
            }`}
            style={{ transformStyle: 'preserve-3d', height: '55%' }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 440 165"
              preserveAspectRatio="none"
            >
              <polygon
                points="0,0 440,0 220,165"
                fill="#162235"
                stroke="#29374E"
                strokeWidth="1"
              />
              {/* Subtle top flap highlight */}
              <line
                x1="0"
                y1="1"
                x2="440"
                y2="1"
                stroke="rgba(170, 160, 200, 0.25)"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Central Silver Moon Wax Seal */}
          <div
            className={`absolute top-[48%] sm:top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-500 ease-out ${
              isOpening
                ? 'scale-125 opacity-0 rotate-12'
                : 'scale-100 opacity-100'
            }`}
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full silver-moon-seal flex items-center justify-center cursor-pointer">
              {/* Embossed concentric ring */}
              <div className="absolute inset-1 rounded-full border border-white/30" />
              <div className="absolute inset-2 rounded-full border border-black/20" />

              {/* Engraved Silver Crescent Icon */}
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 sm:w-7 sm:h-7 text-[#252B38] drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]"
                fill="currentColor"
              >
                <path d="M12.3 2a10 10 0 0 0-1.9 19.8 10 10 0 0 0 11.2-8.5 7.5 7.5 0 0 1-9.3-11.3z" />
              </svg>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
