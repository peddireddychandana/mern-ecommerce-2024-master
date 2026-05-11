import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";

function AuthLayout() {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const textRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Background fade
    tl.fromTo(
      bgRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" }
    )

      // Left panel animation
      .fromTo(
        leftRef.current,
        { x: -200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )

      // Right panel animation
      .fromTo(
        rightRef.current,
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.6"
      );
  }, []);

  return (
    <div ref={bgRef} className="flex min-h-screen w-full overflow-x-hidden bg-background">

      <div
        ref={leftRef}
        className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12"
      >
        <div
          ref={textRef}
          className="max-w-md space-y-6 text-center text-white"
        >
          <h1 className="text-4xl font-extrabold tracking-tight">
            SRI RAMAKRISHNA TEXTILES
          </h1>

          <p className="text-gray-400 text-sm">
            Trusted Traditional Textile Since Years
          </p>

          {/* decorative line */}
          <div className="mx-auto w-24 h-[2px] bg-white/30 mt-4"></div>
        </div>
      </div>

      {/* RIGHT AUTH SECTION */}
      <div
        ref={rightRef}
        className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default AuthLayout;