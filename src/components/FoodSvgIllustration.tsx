import React from 'react';

interface FoodSvgIllustrationProps {
  imageKey: string;
  name: string;
  className?: string;
}

export const FoodSvgIllustration: React.FC<FoodSvgIllustrationProps> = ({
  imageKey,
  name,
  className = 'w-full h-full',
}) => {
  // If user selected/captured a real data URL or blob URL via Camera/Gallery picker
  if (
    imageKey &&
    (imageKey.startsWith('data:image/') ||
      imageKey.startsWith('blob:') ||
      imageKey.startsWith('http'))
  ) {
    return (
      <img
        src={imageKey}
        alt={name}
        referrerPolicy="no-referrer"
        className={`${className} object-cover`}
      />
    );
  }

  switch (imageKey) {
    case 'svg_burger':
      return (
        <svg
          viewBox="0 0 240 180"
          className={className}
          role="img"
          aria-label={name}
        >
          <defs>
            <linearGradient id="bgBurger" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF0E5" />
              <stop offset="100%" stopColor="#FED7AA" />
            </linearGradient>
            <linearGradient id="bunGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
          </defs>
          <rect width="240" height="180" fill="url(#bgBurger)" />
          <ellipse cx="120" cy="148" rx="68" ry="12" fill="#E2E8F0" opacity="0.7" />
          {/* Bottom bun */}
          <path
            d="M64 126 H176 C176 138 164 144 120 144 C76 144 64 138 64 126 Z"
            fill="#D97706"
          />
          {/* Double beef patties */}
          <rect x="58" y="108" width="124" height="16" rx="8" fill="#572314" />
          {/* Melted cheese */}
          <path d="M62 108 L86 118 L108 108 L142 120 L178 108 Z" fill="#FACC15" />
          <rect x="60" y="92" width="120" height="15" rx="7" fill="#6B2B18" />
          {/* Lettuce & Tomato */}
          <rect x="64" y="84" width="112" height="8" rx="4" fill="#DC2626" />
          <path
            d="M56 84 Q72 76 88 84 T120 84 T152 84 T184 84"
            stroke="#16A34A"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          {/* Top Brioche Bun */}
          <path
            d="M62 80 C62 44 178 44 178 80 Z"
            fill="url(#bunGrad)"
          />
          {/* Sesame seeds */}
          <ellipse cx="98" cy="58" rx="4" ry="2" fill="#FEF3C7" />
          <ellipse cx="120" cy="52" rx="4" ry="2" fill="#FEF3C7" />
          <ellipse cx="142" cy="58" rx="4" ry="2" fill="#FEF3C7" />
          <ellipse cx="110" cy="65" rx="4" ry="2" fill="#FEF3C7" />
          <ellipse cx="132" cy="65" rx="4" ry="2" fill="#FEF3C7" />
        </svg>
      );

    case 'svg_biryani':
      return (
        <svg
          viewBox="0 0 240 180"
          className={className}
          role="img"
          aria-label={name}
        >
          <defs>
            <linearGradient id="bgBiryani" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
          </defs>
          <rect width="240" height="180" fill="url(#bgBiryani)" />
          {/* Traditional Handi / Platter */}
          <ellipse cx="120" cy="122" rx="76" ry="28" fill="#78350F" />
          <ellipse cx="120" cy="112" rx="72" ry="26" fill="#F59E0B" />
          {/* Saffron rice mound */}
          <path
            d="M52 112 C62 66 178 66 188 112 Z"
            fill="#FBBF24"
          />
          {/* Mutton & Potato pieces */}
          <ellipse cx="96" cy="96" rx="18" ry="11" fill="#7C2D12" />
          <ellipse cx="142" cy="98" rx="16" ry="10" fill="#9A3412" />
          <circle cx="118" cy="86" r="11" fill="#D97706" />
          {/* Egg & garnish */}
          <ellipse cx="118" cy="106" rx="12" ry="8" fill="#FFFFFF" />
          <circle cx="118" cy="106" r="5" fill="#F97316" />
          <circle cx="84" cy="106" r="4" fill="#16A34A" />
          <circle cx="154" cy="108" r="4" fill="#16A34A" />
        </svg>
      );

    case 'svg_pizza':
      return (
        <svg
          viewBox="0 0 240 180"
          className={className}
          role="img"
          aria-label={name}
        >
          <rect width="240" height="180" fill="#FFEDD5" />
          <circle cx="120" cy="90" r="64" fill="#D97706" />
          <circle cx="120" cy="90" r="55" fill="#DC2626" />
          <circle cx="120" cy="90" r="50" fill="#FDE047" />
          {/* Pepperoni slices */}
          <circle cx="96" cy="72" r="10" fill="#B91C1C" />
          <circle cx="140" cy="70" r="10" fill="#B91C1C" />
          <circle cx="120" cy="94" r="11" fill="#B91C1C" />
          <circle cx="94" cy="110" r="9" fill="#B91C1C" />
          <circle cx="144" cy="108" r="10" fill="#B91C1C" />
          {/* Basil leaves */}
          <ellipse cx="118" cy="68" rx="6" ry="3" fill="#15803D" />
          <ellipse cx="106" cy="92" rx="6" ry="3" fill="#15803D" />
          <ellipse cx="132" cy="90" rx="6" ry="3" fill="#15803D" />
        </svg>
      );

    case 'svg_chicken_burger':
      return (
        <svg
          viewBox="0 0 240 180"
          className={className}
          role="img"
          aria-label={name}
        >
          <rect width="240" height="180" fill="#FEE2E2" />
          <path d="M64 128 H176 C176 140 162 146 120 146 C78 146 64 140 64 128 Z" fill="#D97706" />
          <path d="M54 96 Q75 86 92 98 T130 94 T186 98 L178 124 H62 Z" fill="#EA580C" />
          <rect x="64" y="84" width="112" height="10" rx="5" fill="#FEF08A" />
          <path d="M62 82 C62 46 178 46 178 82 Z" fill="#F59E0B" />
        </svg>
      );

    case 'svg_platter':
      return (
        <svg
          viewBox="0 0 240 180"
          className={className}
          role="img"
          aria-label={name}
        >
          <rect width="240" height="180" fill="#ECFDF5" />
          <rect x="44" y="34" width="152" height="112" rx="18" fill="#1F2937" />
          <rect x="54" y="44" width="76" height="92" rx="10" fill="#FBBF24" />
          <ellipse cx="158" cy="72" rx="26" ry="18" fill="#B45309" />
          <circle cx="158" cy="116" r="16" fill="#FEF9C3" />
          <circle cx="158" cy="116" r="6" fill="#16A34A" />
        </svg>
      );

    case 'svg_drink':
    default:
      return (
        <svg
          viewBox="0 0 240 180"
          className={className}
          role="img"
          aria-label={name}
        >
          <rect width="240" height="180" fill="#FEF9C3" />
          <path d="M92 46 H148 L140 144 C140 150 132 154 120 154 C108 154 100 150 100 144 Z" fill="#F59E0B" />
          <ellipse cx="120" cy="46" rx="28" ry="8" fill="#FEF3C7" />
          <path d="M126 44 L142 20" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" />
          <circle cx="112" cy="46" r="5" fill="#15803D" />
        </svg>
      );
  }
};
