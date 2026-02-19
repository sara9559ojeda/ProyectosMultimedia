import React, { useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, SRGBColorSpace } from "three";

export default function CuboInteractivo() {
  const cubeRef = useRef();
  const [color, setColor] = useState("white");

  // 🔹 Cargar texturas
  const baseTexture = useLoader(TextureLoader, "/assets/texture1.jpg");
  const alphaTexture = useLoader(TextureLoader, "/assets/alpha.png");
  const emissiveTexture = useLoader(TextureLoader, "/assets/texture2.jpg");

  // 🔹 Ajustes importantes para texturas
  baseTexture.colorSpace = SRGBColorSpace;
  baseTexture.flipY = false;
  alphaTexture.flipY = false;
  emissiveTexture.flipY = false;

  // 🔹 Animación continua
  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
    }
  });

  // 🔹 Cambio de color al hacer clic
  const handleCubeClick = () => {
    setColor((prev) => (prev === "white" ? "orange" : "white"));
  };

  return (
    <mesh
      ref={cubeRef}
      position={[3, 2, 2]}
      onClick={handleCubeClick}
      name="cubo"
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        map={baseTexture}
        alphaMap={alphaTexture}
        emissiveMap={emissiveTexture}
        emissive={"blue"}
        emissiveIntensity={1}
        transparent
        color={color}
      />
    </mesh>
  );
}