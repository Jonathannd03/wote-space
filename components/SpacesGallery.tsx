'use client';

import AnimatedGallery from './AnimatedGallery';

interface SpacesGalleryProps {
  images: string[];
  title: string;
  subtitle: string;
}

export default function SpacesGallery({ images, title, subtitle }: SpacesGalleryProps) {
  return (
    <div className="mt-24">
      <AnimatedGallery images={images} title={title} subtitle={subtitle} />
    </div>
  );
}
