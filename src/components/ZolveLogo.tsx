import zolveLogo from '@/assets/zolve-logo.png';

interface ZolveLogoProps {
  size?: 'large' | 'medium' | 'small';
  showText?: boolean;
}

const ZolveLogo = ({ size = 'large', showText = true }: ZolveLogoProps) => {
  const sizes = {
    large: 'w-40',
    medium: 'w-10',
    small: 'w-24'
  };

  return (
    <img 
      src={zolveLogo} 
      alt="Zolve" 
      className={`${sizes[size]} h-auto ${!showText && size === 'medium' ? '' : ''}`}
    />
  );
};

export default ZolveLogo;
