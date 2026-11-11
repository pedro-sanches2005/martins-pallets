"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

const CAMADAS = 14; // altura da pilha
const ALTURA = 0.14; // altura de cada pallet
const DELAY = 0.05; // intervalo entre um pallet e o próximo
const QUEDA = 0.7; // duração da queda de cada pallet

function easeOutBounce(x: number) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
}

export default function TruckScene() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const alvoY = (CAMADAS * ALTURA) / 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a6a3a, 1.3));
    const sun = new THREE.DirectionalLight(0xffffff, 1.8);
    sun.position.set(6, 10, 5);
    scene.add(sun);

    // Pallet: tábuas de cima e de baixo + 9 blocos, fundidos em uma só geometria
    const partes: THREE.BufferGeometry[] = [];
    const parte = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const g = new THREE.BoxGeometry(w, h, d);
      g.translate(x, y, z);
      partes.push(g);
    };
    for (let i = 0; i < 5; i++) parte(0.18, 0.025, 1.0, -0.5 + i * 0.25, 0.1275, 0);
    for (const x of [-0.5, 0, 0.5]) {
      parte(0.18, 0.025, 1.0, x, 0.0125, 0);
      for (const z of [-0.4, 0, 0.4]) parte(0.14, 0.09, 0.14, x, 0.07, z);
    }
    const palletGeo = mergeGeometries(partes)!;
    partes.forEach((g) => g.dispose());

    const woods = [0xc9965a, 0xb98547, 0xd8a867].map(
      (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 })
    );

    // Quatro pilhas lado a lado; os pallets caem camada por camada
    const palletSystem = new THREE.Group();
    const pallets: { m: THREE.Mesh; restY: number; delay: number }[] = [];
    let n = 0;
    for (let k = 0; k < CAMADAS; k++) {
      for (const x of [-0.65, 0.65]) {
        for (const z of [-0.55, 0.55]) {
          const m = new THREE.Mesh(palletGeo, woods[n % 3]);
          const restY = k * ALTURA;
          m.position.set(x, restY, z);
          m.rotation.y = (Math.random() - 0.5) * 0.05;
          palletSystem.add(m);
          pallets.push({ m, restY, delay: n * DELAY });
          n++;
        }
      }
    }
    scene.add(palletSystem);

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      const a = w / h;
      camera.aspect = a;
      const dist = a < 1 ? 11 : a < 1.4 ? 9.5 : 8.5; // afasta a câmera em telas estreitas
      camera.position.set(0, alvoY + 2.4, dist);
      camera.lookAt(0, alvoY, 0);
      camera.updateProjectionMatrix();
      if (reduce) renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const atualizar = (t: number) => {
      for (const p of pallets) {
        const k = reduce ? 1 : clamp((t - p.delay) / QUEDA);
        p.m.visible = k > 0;
        p.m.position.y = p.restY + (1 - easeOutBounce(k)) * 6;
      }
      // Rotação leve e responsiva ao scroll da página
      const s = Math.min(window.scrollY / window.innerHeight, 1.5);
      palletSystem.rotation.y = reduce ? 0.4 : 0.4 + t * 0.15 + s * 1.2;
    };

    resize();
    if (reduce) atualizar(99);

    // Loop de animação: só roda enquanto a cena está visível (IntersectionObserver)
    let raf = 0, visible = false, startAt: number | null = null;
    const tick = (now: number) => {
      if (!visible) { raf = 0; return; }
      if (startAt === null) startAt = now;
      atualizar((now - startAt) / 1000);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (reduce) { renderer.render(scene, camera); return; }
      if (visible) { startAt = null; if (!raf) raf = requestAnimationFrame(tick); } // pallets caem de novo ao reaparecer
    });
    io.observe(el);

    return () => {
      io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf);
      palletGeo.dispose();
      woods.forEach((w) => w.dispose());
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mount} className="scene" aria-label="Pilha de pallets de madeira em 3D" />;
}
