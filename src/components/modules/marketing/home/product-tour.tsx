"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TOUR_SLIDES } from "@/constants/marketing";
import { cn } from "@/lib/utils";
import SectionHeading from "../section-heading";
import BrowserFrame from "./browser-frame";
import ThemedShot from "./themed-shot";

const DELAY = 6000;

export default function ProductTour() {
  const reduce = useReducedMotion();
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "center" }, [
    Autoplay({
      delay: DELAY,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: !reduce,
    }),
  ]);
  const [index, setIndex] = useState(0);
  // Starts false on server and client alike; the carousel reports the real
  // state once it mounts (a reduce-dependent start would mismatch on hydration)
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    const autoplay = embla.plugins().autoplay;
    const onPlay = () => setPlaying(true);
    const onStop = () => setPlaying(false);
    embla.on("select", onSelect);
    embla.on("autoplay:play", onPlay);
    embla.on("autoplay:stop", onStop);
    setPlaying(autoplay?.isPlaying() ?? false);
    return () => {
      embla.off("select", onSelect);
      embla.off("autoplay:play", onPlay);
      embla.off("autoplay:stop", onStop);
    };
  }, [embla]);

  const goTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);
  const togglePlay = () => {
    const autoplay = embla?.plugins().autoplay;
    if (!autoplay) return;
    if (autoplay.isPlaying()) autoplay.stop();
    else autoplay.play();
  };

  const slide = TOUR_SLIDES[index];

  return (
    <section
      id="tour"
      aria-roledescription="carousel"
      aria-label="Product tour"
      className="border-y bg-muted/30 py-24"
    >
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6">
        <SectionHeading
          eyebrow="Product tour"
          title="See every screen, not a mock-up"
          description="Screenshots from the seeded demo workspace, in whichever theme you're using."
        />

        {/* Tabs double as slide indicators */}
        <div
          role="tablist"
          aria-label="Choose a screen"
          className="flex flex-wrap justify-center gap-2"
        >
          {TOUR_SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-controls="tour-viewport"
              onClick={() => goTo(i)}
              className={cn(
                "relative overflow-hidden rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                i === index
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {s.label}
              {i === index && playing && (
                <span
                  key={index}
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary-foreground/70 motion-safe:animate-[progress-fill_linear_forwards]"
                  style={{ animationDuration: `${DELAY}ms` }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="relative">
          <div ref={emblaRef} id="tour-viewport" className="overflow-hidden">
            <div className="flex touch-pan-y">
              {TOUR_SLIDES.map((s, i) => (
                <div
                  key={s.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${TOUR_SLIDES.length}: ${s.label}`}
                  className="min-w-0 shrink-0 grow-0 basis-full px-2 sm:basis-[88%] lg:basis-[78%]"
                >
                  <div
                    className={cn(
                      "transition-[opacity,scale] duration-500 motion-reduce:transition-none",
                      i === index ? "opacity-100" : "scale-95 opacity-40",
                    )}
                  >
                    <BrowserFrame url={`devbench / ${s.label.toLowerCase()}`}>
                      <ThemedShot
                        id={s.id}
                        alt={s.title}
                        sizes="(min-width: 1024px) 78vw, 100vw"
                      />
                    </BrowserFrame>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon-lg"
            aria-label="Previous screen"
            onClick={() => embla?.scrollPrev()}
            className="absolute top-1/2 left-2 hidden -translate-y-1/2 bg-background/90 shadow-md md:inline-flex"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-lg"
            aria-label="Next screen"
            onClick={() => embla?.scrollNext()}
            className="absolute top-1/2 right-2 hidden -translate-y-1/2 bg-background/90 shadow-md md:inline-flex"
          >
            <ChevronRight />
          </Button>
        </div>

        <div className="mx-auto flex max-w-3xl items-start gap-4">
          <div className="flex-1 space-y-2 text-center" aria-live="polite">
            <h3 className="text-h3 font-semibold">{slide.title}</h3>
            <p className="text-lg text-muted-foreground">{slide.description}</p>
          </div>
        </div>
        <div className="flex justify-center">
          <Button variant="ghost" size="sm" onClick={togglePlay}>
            {playing ? <Pause /> : <Play />}
            {playing ? "Pause tour" : "Play tour"}
          </Button>
        </div>
      </div>
    </section>
  );
}
