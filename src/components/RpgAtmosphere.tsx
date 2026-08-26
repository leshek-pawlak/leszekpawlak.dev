import Image from "next/image";
import { rpgImages } from "@/lib/rpgImages";

export function RpgAtmosphere() {
  return (
    <div className="rpg-atmosphere" aria-hidden="true">
      <Image
        className="rpg-background-image"
        src={rpgImages.background.src}
        alt=""
        fill
        sizes="100vw"
        preload
        placeholder="blur"
        blurDataURL={rpgImages.background.blurDataURL}
        draggable={false}
      />
      <div className="rpg-background-veil" />
      <div className="rpg-motes">
        {Array.from({ length: 6 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
    </div>
  );
}
