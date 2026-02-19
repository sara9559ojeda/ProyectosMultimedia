import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
//import ModeloInicio from "../components/ModeloInicio";
import ModeloPractica from "../components/ModeloPractica";

function Ejercicio1() {
  return (
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
      {/* <ModeloInicio /> {/* Agregar si es necesario */}

      {/* 🔹 Controles de cámara interactivos */}
      <OrbitControls />
    </Canvas>
  );
}

export default Ejercicio1;