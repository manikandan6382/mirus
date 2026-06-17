"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MotionEffects() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const moveGlow = (event: PointerEvent) => {
      if (!glowRef.current) return;
      gsap.to(glowRef.current, {
        x: event.clientX - 160,
        y: event.clientY - 160,
        duration: 0.55,
        ease: "power3.out",
      });
    };

    window.addEventListener("pointermove", moveGlow);

    const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    reveals.forEach((element) => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 42 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
          },
        },
      );
    });

    const parallax = gsap.utils.toArray<HTMLElement>("[data-parallax]");
    parallax.forEach((element) => {
      gsap.to(element, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: element.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      window.removeEventListener("pointermove", moveGlow);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[1] hidden h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(184,134,11,0.14),transparent_68%)] blur-2xl dark:bg-[radial-gradient(circle,rgba(214,163,84,0.16),transparent_68%)] lg:block"
    />
  );
}
