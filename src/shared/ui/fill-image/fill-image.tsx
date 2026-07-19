import type { ImgHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { resolvePublicAssetUrl } from "@/shared/lib/url";

type FillImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "src"> & {
  alt: string;
  src: string;
};

export function FillImage({ alt, className, src, ...props }: FillImageProps) {
  return (
    <img
      alt={alt}
      className={cn("block h-full w-full object-cover", className)}
      src={resolvePublicAssetUrl(src)}
      {...props}
    />
  );
}
