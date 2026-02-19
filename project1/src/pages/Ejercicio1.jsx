import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import ModeloPractica from "../components/ModeloPractica";
import CuboInteractivo from "../components/CuboInteractivo";
// import ModeloInicio from "../components/ModeloInicio";

function Ejercicio1() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Escenario 3D */}
      <Canvas
        style={{ position: "fixed", width: "100vw", height: "100vh" }}
        camera={{ position: [10, 5, 10], fov: 40 }}
      >
        {/* 🔹 Luz ambiental para iluminar suavemente la escena */}
        <ambientLight intensity={1} />

        {/* 🔹 Luz direccional que simula la luz del sol */}
        <directionalLight position={[5, 20, 5]} intensity={1.2} />

        {/* 🔹 Entorno preconfigurado con iluminación natural */}
        <Environment preset="city" />

        {/* 🔹 Modelos 3D en la escena */}
        <ModeloPractica />

        {/* 🔹 Tres cubos interactivos en diferentes posiciones */}
        <CuboInteractivo position={[0, 0, 0]} />
        <CuboInteractivo position={[-3, 1, -2]} />
        <CuboInteractivo position={[-3, 0, 0]} />
        {/* <ModeloInicio /> */}

        {/* 🔹 Controles de cámara interactivos */}
        <OrbitControls enableRotate={true} />
      </Canvas>
    </div>
  );
}

export default Ejercicio1;