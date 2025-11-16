import Image from "next/image";
import {
  BookHeart,
  Zap,
  Palette,
} from "lucide-react";

export const TechTalksIcon = ({ className }: { className?: string }) => (
  <Image
    src="/tech-talks-logo.png"
    alt="Tech Talks"
    width={28}
    height={28}
    className={className}
  />
);

export const PersonalBlogIcon = ({ className }: { className?: string }) => (
  <Image
    src="/me.jpg"
    alt="Personal Blog"
    width={56}
    height={56}
    className={`rounded-full ${className}`}
  />
);

export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "personal-blog": PersonalBlogIcon,
  personal: PersonalBlogIcon,
  technology: TechTalksIcon,
  teknologi: TechTalksIcon,
  tutorial: Zap,
  design: Palette,
};

export const getIcon = (slug: string) => {
  return iconMap[slug] || PersonalBlogIcon;
};
