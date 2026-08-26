import Image from "next/image";
import tavernBackground from "../../docs/design/rpg/tavern-workshop-background-v1.png";

export function RpgAtmosphere() {
  return (
    <div className="rpg-atmosphere" aria-hidden="true">
      <Image
        className="rpg-background-image"
        src={tavernBackground}
        alt=""
        fill
        sizes="100vw"
        preload
        placeholder="blur"
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
