import Image from 'next/image';

interface AppImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const AppImage: React.FC<AppImageProps> = ({
  src,
  alt,
  width,
  height,
  ...props
}) => {
  return <Image src={src} alt={alt} width={width} height={height} {...props} />;
};

export default AppImage;
