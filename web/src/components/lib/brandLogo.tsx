import { twMerge } from 'tailwind-merge';

export type BrandLogoProps = {
  className?: string;
  imgClassName?: string;
};

function BrandLogo(props: BrandLogoProps) {
  return (
    <div
      className={twMerge('flex items-center justify-center', props.className)}
    >
      <img
        src='/logo.png'
        className={twMerge('rounded-lg h-24 w-24', props.imgClassName)}
      />
    </div>
  );
}

export default BrandLogo;
