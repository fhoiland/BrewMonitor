// Import blog images for use in components
import firstBrewingImg from './first-brewing.png';
import winterBrewingImg from './winter-brewing.png';

export const blogImages = {
  '/src/assets/first-brewing.png': firstBrewingImg,
  '/src/assets/winter-brewing.png': winterBrewingImg,
} as const;

export function getBlogImage(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null;
  return blogImages[imageUrl as keyof typeof blogImages] || null;
}