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
          <polygon
            points="15,15 85,15 85,30 40,30 85,70 85,85 15,85 15,70 60,70 15,30"
            fill="currentColor"
            className="text-primary-foreground"
            transform="translate(100 0) scale(-1 1)"
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
