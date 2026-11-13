"use client";

import { useState } from "react";

/**
 * YouTube embed with a click-to-load facade. Before the visitor clicks, the
 * page only loads the YouTube thumbnail image. The player iframe (served from
 * youtube-nocookie.com) is created on click, so nothing autoplays and no
 * player scripts or cookies are loaded up front.
 */
export function VideoPlayer({ videoId, title }: { videoId: string; title: string }) {
  const [active, setActive] = useState(false);
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="relative aspect-video border border-border-strong bg-background-inset">
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <a
          href={watchUrl}
          onClick={(e) => {
            e.preventDefault();
            setActive(true);
          }}
          aria-label={`Play video: ${title}`}
          className="focus-ring absolute inset-0 block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 bg-black/55 sm:size-20">
            <svg viewBox="0 0 24 24" className="ml-1 size-7 fill-white sm:size-8" aria-hidden>
              <path d="M6 4l14 8-14 8z" />
            </svg>
          </span>
        </a>
      )}
    </div>
  );
}
