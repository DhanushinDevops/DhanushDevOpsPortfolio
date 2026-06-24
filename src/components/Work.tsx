import { useRef } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const flexRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const flex = flexRef.current;

    if (!section || !container || !flex) return;

    const getTranslateX = () => {
      const flexLeft = container.getBoundingClientRect().left + flex.offsetLeft;
      const boxes = Array.from(flex.querySelectorAll<HTMLElement>(".work-box"));
      const lastBox = boxes[boxes.length - 1];
      const contentRight = lastBox
        ? lastBox.offsetLeft + lastBox.offsetWidth
        : flex.scrollWidth;
      const paddingRight = parseFloat(window.getComputedStyle(flex).paddingRight) || 0;
      const distance = flexLeft + contentRight + paddingRight - window.innerWidth;

      return Math.max(1, Math.ceil(distance));
    };

    const syncPinDistance = () => {
      const distance = getTranslateX();
      section.style.setProperty("--work-pin-distance", `${distance}px`);
      return distance;
    };

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      syncPinDistance();

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${syncPinDistance()}`,
          scrub: 0.7,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          id: "work",
        },
      });

      timeline.to(flex, {
        x: () => -getTranslateX(),
        ease: "none",
      });

      const refresh = () => {
        syncPinDistance();
        ScrollTrigger.refresh();
      };
      const rafId = window.requestAnimationFrame(refresh);
      const images = Array.from(section.querySelectorAll("img"));

      images.forEach((image) => {
        if (!image.complete) {
          image.addEventListener("load", refresh, { once: true });
        }
      });
      window.addEventListener("resize", refresh);

      return () => {
        window.cancelAnimationFrame(rafId);
        window.removeEventListener("resize", refresh);
        images.forEach((image) => image.removeEventListener("load", refresh));
        section.style.removeProperty("--work-pin-distance");
        timeline.kill();
        ScrollTrigger.getById("work")?.kill();
      };
    });

    mm.add("(max-width: 1024px)", () => {
      section.style.removeProperty("--work-pin-distance");
      gsap.set(flex, { clearProps: "transform" });
    });

    return () => {
      mm.revert();
      section.style.removeProperty("--work-pin-distance");
    };
  }, []);

  return (
    <div className="work-section" id="work" ref={sectionRef}>
      <div className="work-container section-container" ref={containerRef}>
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex" ref={flexRef}>
          {[
            {
              name: "CI/CD Pipeline Automation",
              category: "GitLab CI & Docker",
              tools: "GitLab, Docker, Bash",
              image: "/images/work-01.jpg",
            },
            {
              name: "Kubernetes Auto-Scaling Deployment",
              category: "Container Orchestration",
              tools: "Kubernetes, Docker, Helm",
              image: "/images/work-02.jpg",
            },
            {
              name: "Infrastructure Automation",
              category: "Cloud Migration & IaC",
              tools: "Terraform, AWS EC2, S3",
              image: "/images/work-03.png",
            },
            {
              name: "Secure AWS Architecture",
              category: "Cloud Security",
              tools: "AWS IAM, VPC, Ansible",
              image: "/images/work-04.png",
            },
            {
              name: "Real-time Monitoring & Alerting",
              category: "Observability",
              tools: "CloudWatch, Grafana, DataDog, Promotheus",
              image: "/images/work-05.png",
            },
            {
              name: "Automated Vulnerability Scanning",
              category: "DevSecOps",
              tools: "Trivy, SonarQube, Linux",
              image: "/images/work-06.png",
            },
          ].map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
              </div>
              <WorkImage image={project.image} alt={project.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;

