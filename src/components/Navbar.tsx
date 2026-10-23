import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { assetPath } from "../utils/assetPath";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.35,
      smoothTouch: 0.12,
      speed: 1,
      effects: false,
      normalizeScroll: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    const cleanups: Array<() => void> = [];
    const links = document.querySelectorAll(".header ul a");

    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      const handleClick = (e: MouseEvent) => {
        if (window.innerWidth <= 1024) return;

        e.preventDefault();
        const currentTarget = e.currentTarget as HTMLAnchorElement;
        const section = currentTarget.getAttribute("data-href");
        const target = section && document.querySelector<HTMLElement>(section);
        if (!target) return;

        const position =
          section === "#about" || section === "#contact"
            ? "center center"
            : "top top";

        // Scroll animations leave transforms on sections (e.g. About is pushed
        // down 30% once scrolled past, Work keeps its pin offset), which would
        // throw off the measured position. Measure the untransformed layout.
        const transform = target.style.transform;
        target.style.transform = "none";
        const offset = smoother.offset(target, position);
        target.style.transform = transform;

        smoother.scrollTo(offset, true);
      };

      element.addEventListener("click", handleClick);
      cleanups.push(() => element.removeEventListener("click", handleClick));
    });

    const handleResize = () => ScrollSmoother.refresh(true);
    window.addEventListener("resize", handleResize);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      window.removeEventListener("resize", handleResize);
      smoother.kill();
    };
  }, []);

  return (
    <>
      <div className="header">
        <a
          href={assetPath("#")}
          className="navbar-title brand-logo-link"
          data-cursor="disable"
          aria-label="Dhanush Kumar G home"
        >
          <img
            src={assetPath("images/dkg-logo.png")}
            alt="Dhanush Kumar G"
            className="brand-logo"
          />
        </a>
        <a
          href="mailto:dhanushindevops@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          dhanushindevops@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
