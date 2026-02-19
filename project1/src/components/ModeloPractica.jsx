import React, { useRef, useEffect, useState } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  TextureLoader,
  VideoTexture,
  SRGBColorSpace,
  Vector3,
  Sprite,
  SpriteMaterial,
} from "three";

export default function ModeloPractica() {
  // ── Cargar modelo ──────────────────────────────────────────
  const gltf = useLoader(GLTFLoader, "/assets/model.glb");

  // ── Cargar texturas ────────────────────────────────────────
  const bakedTexture = useLoader(TextureLoader, "/assets/baked.jpg");
  const screenTexture = useLoader(TextureLoader, "/assets/publicidad.jpg");
  const noteTextures = [
    useLoader(TextureLoader, "/assets/note1.png"),
    useLoader(TextureLoader, "/assets/note2.png"),
    useLoader(TextureLoader, "/assets/note3.png"),
  ];

  // ── Refs ───────────────────────────────────────────────────
  const videoRef        = useRef(document.createElement("video"));
  const audioAmbRef     = useRef(new Audio("/assets/ambiente.mp3")); // audio ambiente (speaker)
  const audioMusicRef   = useRef(new Audio("/assets/audio.mp3"));    // audio música (speaker 2 / mismo botón)
  const screenRef       = useRef();
  const chairRef        = useRef();
  const speakerRef      = useRef();
  const plantRef        = useRef();
  const notesRef        = useRef([]);
  const noteIntervalRef = useRef(null);

  // ── State ──────────────────────────────────────────────────
  const [chairInitialPos,    setChairInitialPos]    = useState(null);
  const [targetChairPosition, setTargetChairPosition] = useState(null);

  // ── Setup inicial ──────────────────────────────────────────
  useEffect(() => {
    if (!gltf) return;

    // Texturas baked
    bakedTexture.flipY      = false;
    bakedTexture.colorSpace = SRGBColorSpace;

    screenTexture.flipY      = false;
    screenTexture.colorSpace = SRGBColorSpace;

    // Configurar video
    const video       = videoRef.current;
    video.src         = "/assets/video.mp4";
    video.crossOrigin = "anonymous";
    video.loop        = true;
    video.muted       = true;
    video.playsInline = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() =>
        console.warn("Autoplay bloqueado hasta interacción.")
      );
    }

    const videoTexture      = new VideoTexture(video);
    videoTexture.flipY      = false;
    videoTexture.colorSpace = SRGBColorSpace;

    // Aplicar materiales a todos los meshes
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();

        if (child.name === "desktop-plane-0") {
          // Pantalla con video interactivo
          child.material.map = videoTexture;
        } else if (child.name === "desktop-plane-1") {
          // Pantalla con imagen estática (publicidad)
          child.material.map = screenTexture;
        } else {
          // Resto del modelo con textura baked
          child.material.map = bakedTexture;
        }

        child.material.needsUpdate = true;
        console.log("🔹 Objeto:", child.name);
      }
    });

    // Guardar refs de objetos interactivos
    screenRef.current  = gltf.scene.getObjectByName("desktop-plane-1");
    chairRef.current   = gltf.scene.getObjectByName("chair");
    speakerRef.current = gltf.scene.getObjectByName("speaker");
    plantRef.current   = gltf.scene.getObjectByName("plant");

    if (!speakerRef.current) console.warn("No se encontró 'speaker'");
    if (!plantRef.current)   console.warn("No se encontró 'plant'");

    // Guardar posición inicial de la silla
    if (chairRef.current) {
      setChairInitialPos(chairRef.current.position.clone());
    }

    // Configurar audios
    audioAmbRef.current.loop   = true;
    audioAmbRef.current.volume = 0.7;
    audioMusicRef.current.loop = true;

    return () => {
      stopNotes();
      videoTexture.dispose();
      video.pause();
      audioAmbRef.current.pause();
      audioMusicRef.current.pause();
    };
  }, [gltf, bakedTexture, screenTexture]);

  // ── Loop de animación ──────────────────────────────────────
  useFrame(() => {
    // Mover silla suavemente hacia el objetivo
    if (chairRef.current && targetChairPosition) {
      chairRef.current.position.lerp(targetChairPosition, 0.1);
      if (chairRef.current.position.distanceTo(targetChairPosition) < 0.01) {
        setTargetChairPosition(null);
      }
    }

    // Animar notas musicales flotantes
    notesRef.current.forEach((note, index) => {
      note.position.y      += 0.02;
      note.material.opacity -= 0.005;

      if (note.material.opacity <= 0) {
        gltf.scene.remove(note);
        note.material.dispose();
        notesRef.current.splice(index, 1);
      }
    });
  });

  // ── Handlers ───────────────────────────────────────────────

  // 🎥 Video play/pause al hacer clic en desktop-plane-0
  const handleScreenClick = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      console.log("▶️ Video reproduciéndose");
    } else {
      video.pause();
      console.log("⏸️ Video pausado");
    }
  };

  // 🪑 Clic en silla → mover hacia la derecha con lerp
  const handleChairClick = () => {
    if (!chairRef.current) return;
    setTargetChairPosition(
      new Vector3(
        chairRef.current.position.x + 1.5,
        chairRef.current.position.y,
        chairRef.current.position.z
      )
    );
  };

  // 🌿 Clic en planta → devolver silla a posición original
  const handlePlantClick = () => {
    if (!chairRef.current || !chairInitialPos) return;
    setTargetChairPosition(chairInitialPos.clone());
  };

  // 🔊 Clic en speaker → toggle audio ambiente + notas musicales
  const handleSpeakerClick = () => {
    if (audioAmbRef.current.paused) {
      audioAmbRef.current.play().catch(console.error);
      startNotes();
      console.log("🔊 Audio ambiente reproduciéndose");
    } else {
      audioAmbRef.current.pause();
      stopNotes();
      console.log("🔇 Audio ambiente pausado");
    }
  };

  // ── Notas musicales ────────────────────────────────────────
  const startNotes = () => {
    stopNotes();
    noteIntervalRef.current = setInterval(() => {
      if (!speakerRef.current) return;

      const texture =
        noteTextures[Math.floor(Math.random() * noteTextures.length)];

      const material = new SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 1,
      });

      const note = new Sprite(material);
      const pos  = speakerRef.current.position.clone();

      note.position.set(pos.x, pos.y + 0.5, pos.z);
      note.scale.set(0.4, 0.4, 0.4);

      gltf.scene.add(note);
      notesRef.current.push(note);
    }, 500);
  };

  const stopNotes = () => {
    if (noteIntervalRef.current) {
      clearInterval(noteIntervalRef.current);
      noteIntervalRef.current = null;
    }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <primitive
      object={gltf.scene}
      scale={1}
      position={[0, -1, 0]}
      onPointerDown={(event) => {
        event.stopPropagation();
        const name = event.object.name;
        console.log("Click en:", name);

        if (name === "desktop-plane-0") handleScreenClick();
        if (name === "chair")           handleChairClick();
        if (name === "plant")           handlePlantClick();
        if (name === "speaker")         handleSpeakerClick();
      }}
    />
  );
}