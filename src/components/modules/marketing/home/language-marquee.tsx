import { CODE_LANGUAGES } from "@/constants/exam";

// The languages the exam editor supports, scrolling in a loop. The strip is
// two identical halves and the keyframe moves it by exactly one half, so the
// second half lands where the first began. Each half repeats the list enough
// times to be wider than the widest screen, so the strip never runs out.
const REPEATS_PER_HALF = 3;

export default function LanguageMarquee() {
  const half = Array.from(
    { length: REPEATS_PER_HALF },
    () => CODE_LANGUAGES,
  ).flat();

  return (
    <section
      aria-labelledby="languages-heading"
      className="border-y bg-muted/30 py-8"
    >
      <h2
        id="languages-heading"
        className="mb-5 text-center text-sm font-semibold tracking-wider text-muted-foreground uppercase"
      >
        Candidates answer coding problems in
      </h2>
      {/* Screen readers get the plain list; the moving copy is decorative */}
      <ul className="sr-only">
        {CODE_LANGUAGES.map((lang) => (
          <li key={lang.value}>{lang.label}</li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {half.map((lang, index) => (
                <span
                  key={`${lang.value}-${index}`}
                  // Spacing lives on each chip (not flex gap) so both halves are exactly equal
                  className="mr-4 flex items-center gap-2.5 rounded-full border bg-card px-5 py-2.5 font-mono text-base font-medium shadow-sm"
                >
                  <span className="text-primary">&lt;/&gt;</span>
                  {lang.label}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
