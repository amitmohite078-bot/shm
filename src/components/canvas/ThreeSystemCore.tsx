import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSystem } from '../../context/SystemContext';

interface ThreeSystemCoreProps {
  size?: number;
  interactive?: boolean;
  className?: string;
}

export const ThreeSystemCore: React.FC<ThreeSystemCoreProps> = ({ 
  interactive = true,
  className = "w-full h-full"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentMetrics, healthStatus, mousePos } = useSystem();
  
  const stateRef = useRef({
    currentMetrics,
    healthStatus,
    mousePos
  });

  useEffect(() => {
    stateRef.current = { currentMetrics, healthStatus, mousePos };
  }, [currentMetrics, healthStatus, mousePos]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9.5);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance" 
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const blueLight = new THREE.PointLight(0x00e5ff, 4.0, 20);
    blueLight.position.set(0, 0, 3);
    scene.add(blueLight);

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Deep Obsidian Core Sphere
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x050505,
      metalness: 0.95,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // 2. White Geometric Wireframe Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.84, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cageMesh);

    // 3. Inner Glowing Electric Blue Kernel
    const kernelGeo = new THREE.SphereGeometry(0.75, 16, 16);
    const kernelMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const kernelMesh = new THREE.Mesh(kernelGeo, kernelMat);
    coreGroup.add(kernelMesh);

    // 4. Orbital Metric Rings & Electric Blue Beacons
    // Ring 1: CPU Orbit
    const ring1Geo = new THREE.TorusGeometry(2.5, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x111111
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI * 0.35;
    ring1.rotation.y = Math.PI * 0.15;
    coreGroup.add(ring1);

    // Electric Blue Satellite Beacon 1 (CPU)
    const sat1Geo = new THREE.SphereGeometry(0.16, 16, 16);
    const sat1Mat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const sat1 = new THREE.Mesh(sat1Geo, sat1Mat);
    coreGroup.add(sat1);

    // Ring 2: RAM Orbit
    const ring2Geo = new THREE.TorusGeometry(3.1, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xaaaaaa,
      transparent: true,
      opacity: 0.5
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI * 0.25;
    ring2.rotation.z = Math.PI * 0.4;
    coreGroup.add(ring2);

    // Electric Blue Satellite Beacon 2 (RAM)
    const sat2Geo = new THREE.SphereGeometry(0.14, 16, 16);
    const sat2Mat = new THREE.MeshBasicMaterial({ color: 0x0070f3 });
    const sat2 = new THREE.Mesh(sat2Geo, sat2Mat);
    coreGroup.add(sat2);

    // Ring 3: Network Data Vector Orbit
    const ring3Geo = new THREE.TorusGeometry(3.7, 0.012, 16, 120);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x888888,
      transparent: true,
      opacity: 0.4
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI * 0.45;
    coreGroup.add(ring3);

    // Electric Blue Satellite Beacon 3 (Network)
    const sat3Geo = new THREE.OctahedronGeometry(0.14, 0);
    const sat3Mat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const sat3 = new THREE.Mesh(sat3Geo, sat3Mat);
    coreGroup.add(sat3);

    // Ring 4: Segmented Outer Quantum Stabilizer
    const ring4Segments = 16;
    const ring4Group = new THREE.Group();
    for (let i = 0; i < ring4Segments; i++) {
      if (i % 2 === 0) {
        const segGeo = new THREE.RingGeometry(4.1, 4.16, 8, 1, (i * Math.PI * 2) / ring4Segments, (Math.PI * 2) / (ring4Segments * 1.5));
        const segMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5
        });
        const segMesh = new THREE.Mesh(segGeo, segMat);
        ring4Group.add(segMesh);
      }
    }
    ring4Group.rotation.x = Math.PI * 0.5;
    coreGroup.add(ring4Group);

    // Blue Dust Particle Belt
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const radius = 2.2 + Math.random() * 2.0;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 0.8;
      dustPositions[i * 3] = Math.cos(angle) * radius;
      dustPositions[i * 3 + 1] = height;
      dustPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.05,
      transparent: true,
      opacity: 0.75
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    coreGroup.add(dustPoints);

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

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const { healthStatus: status, currentMetrics: metrics, mousePos: mouse } = stateRef.current;

      const baseSpeed = status === 'CRITICAL' ? 3.2 : status === 'DEGRADED' ? 1.8 : 0.85;
      const loadModifier = 1 + (metrics.cpu / 100) * 0.8;
      const activeSpeed = baseSpeed * loadModifier;

      // Core rotation
      coreMesh.rotation.y += 0.4 * delta * activeSpeed;
      coreMesh.rotation.x += 0.2 * delta * activeSpeed;
      cageMesh.rotation.y -= 0.6 * delta * activeSpeed;
      cageMesh.rotation.z += 0.3 * delta * activeSpeed;

      // Kernel Pulse
      const pulseRate = status === 'CRITICAL' ? 12 : status === 'DEGRADED' ? 6 : 3;
      const pulseScale = 1 + Math.sin(elapsedTime * pulseRate) * 0.15;
      kernelMesh.scale.set(pulseScale, pulseScale, pulseScale);

      // Orbits
      ring1.rotation.z += 0.5 * delta * activeSpeed;
      ring2.rotation.z -= 0.3 * delta * activeSpeed;
      ring3.rotation.y += 0.4 * delta * activeSpeed;
      ring4Group.rotation.z += 0.15 * delta * activeSpeed;
      dustPoints.rotation.y += 0.2 * delta * activeSpeed;

      // Calculate satellite positions
      const r1Angle = elapsedTime * 0.8 * activeSpeed;
      sat1.position.set(
        Math.cos(r1Angle) * 2.5 * Math.cos(ring1.rotation.y),
        Math.sin(r1Angle) * 2.5 * Math.sin(ring1.rotation.x),
        Math.sin(r1Angle) * 2.5 * Math.cos(ring1.rotation.x)
      );

      const r2Angle = -elapsedTime * 0.6 * activeSpeed;
      sat2.position.set(
        Math.cos(r2Angle) * 3.1 * Math.cos(ring2.rotation.z),
        Math.sin(r2Angle) * 3.1 * Math.sin(ring2.rotation.x),
        Math.sin(r2Angle) * 3.1 * Math.cos(ring2.rotation.x)
      );

      const r3Angle = elapsedTime * 0.45 * activeSpeed + 1.2;
      sat3.position.set(
        Math.cos(r3Angle) * 3.7 * Math.cos(ring3.rotation.y),
        Math.sin(r3Angle) * 0.8,
        Math.sin(r3Angle) * 3.7 * Math.sin(ring3.rotation.y)
      );

      if (interactive) {
        const targetRotX = (mouse.normalizedY * 0.35) + Math.sin(elapsedTime * 0.8) * 0.06;
        const targetRotY = (mouse.normalizedX * 0.45) + Math.cos(elapsedTime * 0.7) * 0.06;
        
        coreGroup.rotation.x += (targetRotX - coreGroup.rotation.x) * 0.05;
        coreGroup.rotation.y += (targetRotY - coreGroup.rotation.y) * 0.05;
        coreGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.15;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      scene.clear();
    };
  }, [interactive]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <div ref={containerRef} className="w-full h-full min-h-[280px]" />
    </div>
  );
};
