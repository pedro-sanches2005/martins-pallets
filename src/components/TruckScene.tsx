"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export default function TruckScene() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 4, 9);
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a6a3a, 1.3));
    const sun = new THREE.DirectionalLight(0xffffff, 1.8);
    sun.position.set(6, 10, 5);
    scene.add(sun);

    const mat = (c: number) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 });
    const add = (g: THREE.Group, w: number, h: number, d: number, c: number, x: number, y: number, z: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c));
      m.position.set(x, y, z);
      g.add(m);
      return m;
    };

    // Grupo principal centrado para os pallets
    const palletSystem = new THREE.Group();

    // Geometria das tábuas do pallet
    const slat = new THREE.BoxGeometry(1.2, 0.04, 0.14);
    const stringer = new THREE.BoxGeometry(1.2, 0.12, 0.1);
    const woods = [mat(0xc9965a), mat(0xb98547), mat(0xd8a867)];
    
    const makePallet = (i: number) => {
      const g = new THREE.Group();
      const m = woods[i % 3];
      for (let s = 0; s < 5; s++) { const a = new THREE.Mesh(slat, m); a.position.set(0, 0.18, -0.4 + s * 0.2); g.add(a); }
      for (let s = 0; s < 3; s++) { const b = new THREE.Mesh(stringer, m); b.position.set(0, 0.08, -0.4 + s * 0.4); g.add(b); }
      return g;
    };

    const pallets: { g: THREE.Group; targetY: number; delay: number }[] = [];
    let n = 0;
    
    // Organiza os pallets em uma pilha estruturada
    for (let k = 0; k < 3; k++) { // camadas de altura
      for (let i = 0; i < 2; i++) { // largura
        for (let j = 0; j < 2; j++) { // profundidade
          const g = makePallet(n++);
          const targetX = (i - 0.5) * 1.3;
          const targetZ = (j - 0.5) * 1.1;
          const targetY = k * 0.35;
          
          g.position.set(targetX, targetY, targetZ);
          palletSystem.add(g);
          
          pallets.push({ 
            g, 
            targetY, 
            delay: (k * 4 + i * 2 + j) * 0.08 
          });
        }
      }
    }
    scene.add(palletSystem);

    // Redimensionamento
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    // Loop de animação
    let raf = 0, visible = false, startAt: number | null = null;
    const tick = (now: number) => {
      if (!visible) { raf = 0; return; }
      if (startAt === null) startAt = now;
      const t = (now - startAt) / 1000;

      // Animação de queda dos pallets do alto
      for (const p of pallets) {
        const k = reduce ? 1 : clamp((t - p.delay) / 0.6);
        const e = 1 - Math.pow(1 - k, 3); // efeito suave de desaceleração (easeOutCubic)
        
        p.g.position.y = p.targetY + (1 - e) * 7; // caem de uma altura de 7 unidades
        p.g.scale.set(e, e, e); // crescem suavemente ao cair
      }

      // Rotação leve e responsiva ao scroll da página
      const s = Math.min(window.scrollY / window.innerHeight, 1.5);
      palletSystem.rotation.y = reduce ? 0.4 : 0.4 + s * 1.2 + Math.sin(t * 0.5) * 0.08;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(el);

    return () => {
      io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) { o.geometry.dispose(); (o.material as THREE.Material).dispose(); }
      });
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mount} className="scene" aria-label="Pilha de pallets de madeira em 3D" />;
}