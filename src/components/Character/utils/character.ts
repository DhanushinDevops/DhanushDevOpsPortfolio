import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import { assetPath } from "../../../utils/assetPath";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  isCancelled: () => boolean = () => false
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(assetPath("draco/"));
  loader.setDRACOLoader(dracoLoader);

  // Any failure (fetch, decrypt, parse or shader compile) rejects the promise
  // so the caller can close the loading screen instead of hanging on it.
  const loadCharacter = async (): Promise<GLTF | null> => {
    let blobUrl: string | null = null;
    try {
      const encryptedBlob = await decryptFile(
        assetPath("models/character.enc"),
        "Character3D#@"
      );
      if (isCancelled()) return null;
      blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

      const gltf = await loader.loadAsync(blobUrl);
      if (isCancelled()) return null;
      const character = gltf.scene;
      await renderer.compileAsync(character, camera, scene);
      if (isCancelled()) return null;

      character.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mesh = child;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
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
      setCharTimeline(character, camera);
      setAllTimeline();

      const footR = character.getObjectByName("footR");
      const footL = character.getObjectByName("footL");
      if (footR) footR.position.y = 3.36;
      if (footL) footL.position.y = 3.36;

      return gltf;
    } finally {
      dracoLoader.dispose();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    }
  };

  return { loadCharacter };
};

export default setCharacter;
