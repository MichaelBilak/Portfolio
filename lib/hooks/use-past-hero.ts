"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";

/** True once the homepage hero (#top) has left the viewport; always true on other pages. */
export function usePastHero() {
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) {
      setPastHero(true);
      return;
    }

    setPastHero(false);

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  return pastHero;
}
