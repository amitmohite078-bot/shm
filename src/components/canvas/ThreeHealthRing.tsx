import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSystem } from '../../context/SystemContext';

interface ThreeHealthRingProps {
  size?: number;
  className?: string;
}

export const ThreeHealthRing: React.FC<ThreeHealthRingProps> = ({ 
  className = "w-full h-full min-h-[220px]" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { healthScore, healthStatus, mousePos } = useSystem();
  const stateRef = useRef({ healthScore, healthStatus, mousePos });

  useEffect(() => {
    stateRef.current = { healthScore, healthStatus, mousePos };
  }, [healthScore, healthStatus, mousePos]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 220;
    const height = container.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const totalSegments = 36;
    const segmentMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < totalSegments; i++) {
      const angle = (i / totalSegments) * Math.PI * 2;
      const segGeo = new THREE.BoxGeometry(0.12, 0.04, 0.08);
      const segMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.2
      });
      const mesh = new THREE.Mesh(segGeo, segMat);
      mesh.position.set(Math.cos(angle) * 2.1, Math.sin(angle) * 2.1, 0);
      mesh.rotation.z = angle + Math.PI / 2;
      ringGroup.add(mesh);
      segmentMeshes.push(mesh);
    }

    const outerTorusGeo = new THREE.TorusGeometry(2.32, 0.012, 8, 80);
    const outerTorusMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3
    });
    const outerTorus = new THREE.Mesh(outerTorusGeo, outerTorusMat);
    ringGroup.add(outerTorus);

    const innerTorusGeo = new THREE.TorusGeometry(1.88, 0.008, 8, 80);
    const innerTorusMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.5
    });
    const innerTorus = new THREE.Mesh(innerTorusGeo, innerTorusMat);
    ringGroup.add(innerTorus);

    // Blue corner dots
    for (let i = 0; i < 4; i++) {
      const markAngle = (i / 4) * Math.PI * 2;
      const markGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const markMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
      const markMesh = new THREE.Mesh(markGeo, markMat);
      markMesh.position.set(Math.cos(markAngle) * 2.45, Math.sin(markAngle) * 2.45, 0.05);
      ringGroup.add(markMesh);
    }

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const { healthScore: score, healthStatus: status, mousePos: mouse } = stateRef.current;

      const activeSegments = Math.round((score / 100) * totalSegments);

      segmentMeshes.forEach((mesh, idx) => {
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (idx < activeSegments) {
          mat.opacity = 0.9 + Math.sin(time * 3 + idx * 0.2) * 0.1;
          mat.color.setHex(0x00e5ff);
        } else {
          mat.opacity = 0.12;
          mat.color.setHex(0x404040);
        }
      });

      const speed = status === 'CRITICAL' ? 1.8 : status === 'DEGRADED' ? 1.1 : 0.4;
      ringGroup.rotation.z -= 0.15 * delta * speed;
      outerTorus.rotation.z += 0.3 * delta * speed;
      innerTorus.rotation.z -= 0.4 * delta * speed;

      const targetRotX = mouse.normalizedY * 0.25;
      const targetRotY = mouse.normalizedX * 0.25;
      ringGroup.rotation.x += (targetRotX - ringGroup.rotation.x) * 0.08;
      ringGroup.rotation.y += (targetRotY - ringGroup.rotation.y) * 0.08;

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      scene.clear();
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 select-none">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] pulse-blue-dot" />
          <span className="text-[10px] tracking-[0.35em] text-[#00E5FF] uppercase font-mono font-bold">
            SYSTEM HEALTH
          </span>
        </div>
        
        <div className="flex items-baseline justify-center">
          <span className="text-6xl font-bold font-display tracking-tight text-white drop-shadow-[0_0_25px_rgba(0,229,255,0.4)]">
            {healthScore}
          </span>
          <span className="text-xs font-mono text-neutral-400 ml-1">/100</span>
        </div>

        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 border border-[#00E5FF]/40 bg-neutral-950/80 rounded-full backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] pulse-blue-dot" />
          <span className="text-[9px] font-mono tracking-widest text-[#00E5FF] font-semibold uppercase">
            {healthStatus}
          </span>
        </div>
      </div>
    </div>
  );
};
