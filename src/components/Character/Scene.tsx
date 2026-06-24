import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const characterRef = useRef<THREE.Object3D | null>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;
      canvasDiv.current.querySelectorAll("canvas").forEach((canvas) => {
        canvas.remove();
      });

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));

      let isMounted = true;
      const { loadCharacter } = setCharacter(
        renderer,
        scene,
        camera,
        () => !isMounted
      );

      loadCharacter().then((gltf) => {
        if (!isMounted) return;
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          let character = gltf.scene;
          characterRef.current = character;
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;

          if (headBone) {
            // Check if glasses already exist to prevent any duplicate addition
            if (!headBone.getObjectByName("customGlasses")) {
              // Create glasses using Three.js primitives
              const glassMaterial = new THREE.MeshStandardMaterial({
                color: 0x111111,
                roughness: 0.1,
                metalness: 0.8,
              });
              const lensGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 50);

              const leftLens = new THREE.Mesh(lensGeometry, glassMaterial);
              leftLens.position.set(-0.6, 0.4, 2.0);

              const rightLens = new THREE.Mesh(lensGeometry, glassMaterial);
              rightLens.position.set(0.6, 0.4, 2.0);

              const bridgeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
              const bridge = new THREE.Mesh(bridgeGeometry, glassMaterial);
              bridge.position.set(0, 0.4, 2.0);
              bridge.rotation.z = Math.PI / 2;

              const glassesGroup = new THREE.Group();
              glassesGroup.name = "customGlasses";
              glassesGroup.add(leftLens);
              glassesGroup.add(rightLens);
              glassesGroup.add(bridge);

              // Scale and rotate to fit the face relative to spine006
              glassesGroup.scale.set(0.65, 0.65, 0.65); // Reduced scale slightly
              glassesGroup.position.set(0.0, 0.95, 0.0); // Shifted right to perfectly center

              // Attach glasses to the head bone so it follows mouse tracking
              headBone.add(glassesGroup);
            }
          }
          progress.loaded().then(() => {
            if (!isMounted) return;
            setTimeout(() => {
              if (!isMounted) return;
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
        }
      }).catch((err: Error) => {
        console.error("Character loading failed:", err);
        // Ensure the loading screen closes eventually or shows an error state
        progress.clear();
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };

      const resizeHandler = () => {
        if (characterRef.current) {
          handleResize(renderer, camera, canvasDiv, characterRef.current);
        }
      };

      let debounce: ReturnType<typeof window.setTimeout> | undefined;
      let touchMoveTarget: HTMLElement | null = null;
      const onTouchMove = (event: TouchEvent) => {
        handleTouchMove(event, (x, y) => (mouse = { x, y }));
      };

      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        touchMoveTarget = element;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", onTouchMove);
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", onMouseMove);
      window.addEventListener("resize", resizeHandler);
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      let animationFrameId = 0;
      const animate = () => {
        if (!isMounted) return;
        animationFrameId = requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );

          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        isMounted = false;
        cancelAnimationFrame(animationFrameId);
        if (debounce) {
          clearTimeout(debounce);
        }
        progress.cancel();
        characterRef.current = null;
        scene.clear();
        renderer.domElement.remove();
        renderer.dispose();

        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        window.removeEventListener("resize", resizeHandler);
        document.removeEventListener("mousemove", onMouseMove);
        if (touchMoveTarget) {
          touchMoveTarget.removeEventListener("touchmove", onTouchMove);
        }
        if (landingDiv) {
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;

