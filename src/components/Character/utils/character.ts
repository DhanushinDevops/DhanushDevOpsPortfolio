import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  isCancelled: () => boolean = () => false
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        console.log("Starting model loading process...");
        const encryptedBlob = await decryptFile(
          import.meta.env.BASE_URL + "models/character.enc",
          "Character3D#@"
        );
        if (isCancelled()) {
          dracoLoader.dispose();
          resolve(null);
          return;
        }
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        console.log("GLTF loader starting...");
        loader.load(
          blobUrl,
          async (gltf) => {
            if (isCancelled()) {
              dracoLoader.dispose();
              URL.revokeObjectURL(blobUrl);
              resolve(null);
              return;
            }
            console.log("GLTF loaded successfully, compiling...");
            const character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            if (isCancelled()) {
              dracoLoader.dispose();
              URL.revokeObjectURL(blobUrl);
              resolve(null);
              return;
            }
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;

                // Change the t-shirt color to grey
                if (mesh.name === "BODYSHIRT" && mesh.material) {
                  mesh.material = (mesh.material as THREE.Material).clone();
                  if ("color" in mesh.material) {
                    (mesh.material as THREE.MeshStandardMaterial).color.set(
                      0x808080
                    );
                  }
                }

                // Change shoe and sole color to dark grey
                if (
                  (mesh.name === "Shoe" || mesh.name === "Sole") &&
                  mesh.material
                ) {
                  mesh.material = (mesh.material as THREE.Material).clone();
                  if ("color" in mesh.material) {
                    (mesh.material as THREE.MeshStandardMaterial).color.set(
                      0x555555
                    );
                  }
                }
              }
            });
            console.log("Scene traversal complete.");
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();

            const footR = character.getObjectByName("footR");
            const footL = character.getObjectByName("footL");
            if (footR) footR.position.y = 3.36;
            if (footL) footL.position.y = 3.36;

            dracoLoader.dispose();
            URL.revokeObjectURL(blobUrl);
            console.log("Model setup complete.");
          },
          (event) => {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              console.log(`GLTF Parse progress: ${Math.round(percentComplete)}%`);
            }
          },
          (error) => {
            console.error("Error loading GLTF model:", error);
            dracoLoader.dispose();
            URL.revokeObjectURL(blobUrl);
            reject(error);
          }
        );
      } catch (err) {
        console.error("Error in loadCharacter catch block:", err);
        reject(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
