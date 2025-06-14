
import React, { useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// OrbitControls can be removed if not actively used for debugging or interaction
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; 

const SciFiAvatar = () => {
  const mountRef = useRef(null);
  const animationRef = useRef(null);
  const modelRef = useRef(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const headBoneRef = useRef(null); // To store the head bone

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.2, 4); // Slightly adjusted camera

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.shadowMap.enabled = true; // Enable if shadows are used
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    // Lighting - simplified for performance, adjust as needed
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Brighter ambient
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xaaaaff, 0.5); // Cool back/rim light
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);
    
    // GLTF Loader
    const loader = new GLTFLoader();
    loader.load(
      '/assets/models/robot_playground.glb', // Make sure this path is correct
      (gltf) => {
        modelRef.current = gltf.scene;
        modelRef.current.scale.set(1.0, 1.0, 1.0); // Adjust scale if needed
        modelRef.current.position.set(0, -1.2, 0); // Adjust position
        
        modelRef.current.traverse((child) => {
          if (child.isMesh) {
            // child.castShadow = true;
            // child.receiveShadow = true;
            if (child.material) {
              // Make materials less demanding if needed
              child.material.metalness = Math.min(child.material.metalness || 0, 0.7);
              child.material.roughness = Math.max(child.material.roughness || 0, 0.3);
            }
          }
          // Find and store the head bone
          if (child.isBone && (child.name === 'Head' || child.name === 'head' || child.name.toLowerCase().includes('head'))) {
            headBoneRef.current = child;
          }
        });
        scene.add(modelRef.current);

        if (gltf.animations && gltf.animations.length) {
          mixerRef.current = new THREE.AnimationMixer(modelRef.current);
          const action = mixerRef.current.clipAction(gltf.animations[0]);
          action.play();
        }
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF model:', error);
      }
    );
    
    let mouseX = 0;
    let mouseY = 0;
    const targetRotation = { x: 0, y: 0 };

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      targetRotation.y = mouseX * 0.15; // Max rotation angle for Y
      targetRotation.x = -mouseY * 0.1;  // Max rotation angle for X
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();

      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      if (modelRef.current) {
        if (headBoneRef.current) { // Prioritize head bone if found
            headBoneRef.current.rotation.y += (targetRotation.y - headBoneRef.current.rotation.y) * 0.07;
            headBoneRef.current.rotation.x += (targetRotation.x - headBoneRef.current.rotation.x) * 0.07;
        } else { // Fallback to rotating the whole model
            modelRef.current.rotation.y += (targetRotation.y - modelRef.current.rotation.y) * 0.05;
            // modelRef.current.rotation.x += (targetRotation.x - modelRef.current.rotation.x) * 0.05; // Full model X rotation might look odd
        }
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      mixerRef.current = null;
      modelRef.current = null;
      headBoneRef.current = null;
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" style={{zIndex:0}} />;
};

// This will be the component imported by HeroSection
const SciFiAvatarLoader = () => (
  <Suspense fallback={<div className="text-foreground text-center text-lg">ACCESSING VISUAL INTERFACE...</div>}>
    <SciFiAvatar />
  </Suspense>
);

export default SciFiAvatarLoader;
