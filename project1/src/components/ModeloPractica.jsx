import React, { useRef, useEffect, useState } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader, SRGBColorSpace, Vector3 } from "three";

export default function ModeloPractica() {
  const gltf = useLoader(GLTFLoader, "/assets/model.glb");

  // Cargar texturas
  const bakedTexture = useLoader(TextureLoader, "/assets/baked.jpg");
  const screenTexture = useLoader(TextureLoader, "/assets/publicidad.jpg");

  const screenRef = useRef();
  const chairRef = useRef();
  const [targetChairPosition, setTargetChairPosition] = useState(null);

  useEffect(() => {
    if (!gltf) return;

    // Ajustes importantes para texturas baked
    bakedTexture.flipY = false;
    bakedTexture.colorSpace = SRGBColorSpace;

    screenTexture.flipY = true;
    screenTexture.colorSpace = SRGBColorSpace;
    

    // Aplicar baked texture a todo el modelo
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material.map = bakedTexture;
        child.material.needsUpdate = true;
      }
    });

    // Buscar la pantalla y asignar la textura específica
    screenRef.current = gltf.scene.getObjectByName("desktop-plane-1");

    if (screenRef.current) {
      screenRef.current.material = screenRef.current.material.clone();
      screenRef.current.material.map = screenTexture;
      screenRef.current.material.needsUpdate = true;
    }

    // Obtener referencia de la silla
    chairRef.current = gltf.scene.getObjectByName("chair");
  }, [gltf, bakedTexture, screenTexture]);

  // 🔹 Control de animaciones en cada frame
  useFrame(() => {
    if (chairRef.current && targetChairPosition) {
      chairRef.current.position.lerp(targetChairPosition, 0.1);
      if (chairRef.current.position.distanceTo(targetChairPosition) < 0.01) {
        setTargetChairPosition(null);
      }
    }
  });

  const handleChairClick = () => {
    if (chairRef.current) {
      setTargetChairPosition(new Vector3(
        chairRef.current.position.x + 1.5,
        chairRef.current.position.y,
        chairRef.current.position.z
      ));
    }
  };

  return (
    <primitive 
      object={gltf.scene} 
      scale={1} 
      position={[0, -1, 0]}
      onPointerDown={(event) => {
        if (event.object.name === "chair") handleChairClick();
      }}
    />
  );
}
