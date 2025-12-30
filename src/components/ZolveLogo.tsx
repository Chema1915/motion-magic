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
            d="M20 20 L80 20 L80 25 L30 25 L30 75 L80 75 L80 80 L20 80 L20 75 L70 75 L70 25 L20 25 Z"
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
