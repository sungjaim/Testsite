"use client";

import Image from "next/image";
import { useState } from "react";
import { format, type Dictionary } from "@/lib/i18n";

export default function Gallery({ images, name, dict }: { images: string[]; name: string; dict: Dictionary }) {
  const [index, setIndex] = useState(0);
  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-blush-soft">
        <Image
          key={images[index]}
          src={images[index]}
          alt={format(dict.detail.photo, { name, n: index + 1 })}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="animate-fade-up object-cover"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={format(dict.detail.gallery, { n: i + 1 })}
                aria-current={i === index}
                className={`relative block aspect-[4/5] w-full overflow-hidden bg-blush-soft ring-offset-2 transition ${
                  i === index ? "ring-2 ring-brand" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
