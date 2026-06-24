import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social");
    if (!social) return;

    const items = Array.from(social.querySelectorAll("span")).map((elem) => {
      const rect = elem.getBoundingClientRect();

      return {
        elem,
        link: elem.querySelector("a") as HTMLElement,
        mouseX: rect.width / 2,
        mouseY: rect.height / 2,
        currentX: 0,
        currentY: 0,
      };
    });

    const onMouseMove = (e: MouseEvent) => {
      items.forEach((item) => {
        const rect = item.elem.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          item.mouseX = x;
          item.mouseY = y;
        } else {
          item.mouseX = rect.width / 2;
          item.mouseY = rect.height / 2;
        }
      });
    };

    let frameId = 0;
    const updatePosition = () => {
      items.forEach((item) => {
        item.currentX += (item.mouseX - item.currentX) * 0.1;
        item.currentY += (item.mouseY - item.currentY) * 0.1;

        item.link.style.setProperty("--siLeft", `${item.currentX}px`);
        item.link.style.setProperty("--siTop", `${item.currentY}px`);
      });

      frameId = requestAnimationFrame(updatePosition);
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    frameId = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="https://github.com" target="_blank">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href="https://www.linkedin.com/in/dhanushindevops/" target="_blank">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href="https://x.com" target="_blank">
            <FaXTwitter />
          </a>
        </span>
        <span>
          <a href="https://www.instagram.com/dhanuzhx/" target="_blank">
            <FaInstagram />
          </a>
        </span>
      </div>
      <a
        className="resume-button"
        href="/Dhanush_Kumar_Resume.pdf"
        target="_blank"
        rel="noreferrer"
      >
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
