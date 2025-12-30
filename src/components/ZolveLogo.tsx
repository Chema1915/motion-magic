interface ZolveLogoProps {
  size?: 'large' | 'medium' | 'small';
}

const ZolveLogo = ({ size = 'large' }: ZolveLogoProps) => {
  const sizes = {
    large: { box: 'w-40 h-40', text: 'text-5xl' },
    medium: { box: 'w-10 h-10', text: 'text-xl' },
    small: { box: 'w-12 h-12', text: 'text-xl' }
  };

  const { box, text } = sizes[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${box} bg-primary flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" className="w-full h-full p-3">
          <path
            d="M15 15 L85 15 L85 32 L50 32 L85 68 L85 85 L15 85 L15 68 L50 68 L15 32 Z"
            fill="currentColor"
            className="text-primary-foreground"
          />
        </svg>
      </div>
      {size !== 'medium' && (
        <div className={`${text} font-light tracking-tight text-foreground`}>
          Zolve
        </div>
      )}
    </div>
  );
};

export default ZolveLogo;
