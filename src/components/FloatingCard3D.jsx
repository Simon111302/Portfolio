import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, useTexture } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import profileImage from '../assets/simon2.jpg';  
import '../design/FloatingCard3D.css';

// Profile Image
function ProfileImage({ imagePath }) {
  const profileImageTexture = useTexture(imagePath);
  profileImageTexture.encoding = THREE.sRGBEncoding;
  
  return (
    <mesh position={[0, 0, 0.026]}>
      <planeGeometry args={[2.4, 3.4]} />
      <meshStandardMaterial
        map={profileImageTexture}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Realistic Dynamic Lanyard Sling - WIDER VERSION
function RealisticLanyard({ angle, stretchPos = { x: 0, z: 0 }, scale = 1 }) {
  const lanyardRef = useRef();
  const segments = 30;
  
  const segmentPositions = useRef(
    Array.from({ length: segments + 1 }, (_, i) => {
      const t = i / segments;
      return { x: 0, y: -1.4 * t * scale, z: 0 };
    })
  );
  
  const prevPositions = useRef(
    Array.from({ length: segments + 1 }, (_, i) => {
      const t = i / segments;
      return { x: 0, y: -1.4 * t * scale, z: 0 };
    })
  );
  
  useFrame((state, delta) => {
    if (!lanyardRef.current) return;
    
    const dt = Math.min(delta, 0.016);
    const constraintIterations = 15;
    
    const cardCenterY = -3 * scale;
    const cardHoleOffsetY = 1.6 * scale;
    
    const cardHoleY = cardCenterY + cardHoleOffsetY;
    const cardHoleX = stretchPos.x * scale;
    const cardHoleZ = stretchPos.z * scale;
    
    const pivotPos = new THREE.Vector3(0, 0, 0);
    const cardHolePos = new THREE.Vector3(cardHoleX, cardHoleY, cardHoleZ);
    const totalLength = pivotPos.distanceTo(cardHolePos);
    const segmentLength = totalLength / segments;
    
    segmentPositions.current[segments].x = cardHoleX;
    segmentPositions.current[segments].y = cardHoleY;
    segmentPositions.current[segments].z = cardHoleZ;
    prevPositions.current[segments].x = cardHoleX;
    prevPositions.current[segments].y = cardHoleY;
    prevPositions.current[segments].z = cardHoleZ;
    
    const damping = 0.998;
    const gravity = 4.5;
    const windForce = Math.sin(state.clock.elapsedTime * 1.2) * 0.015;
    
    for (let i = 1; i < segments; i++) {
      const pos = segmentPositions.current[i];
      const prevPos = prevPositions.current[i];
      
      const tempX = pos.x;
      const tempY = pos.y;
      const tempZ = pos.z;
      
      const velocityX = (pos.x - prevPos.x) * damping;
      const velocityY = (pos.y - prevPos.y) * damping;
      const velocityZ = (pos.z - prevPos.z) * damping;
      
      const t = i / segments;
      const windEffect = windForce * Math.sin(t * Math.PI) * scale;
      
      pos.x += velocityX + windEffect * dt * 60;
      pos.y += velocityY - gravity * dt * dt * scale;
      pos.z += velocityZ;
      
      prevPos.x = tempX;
      prevPos.y = tempY;
      prevPos.z = tempZ;
    }
    
    for (let iteration = 0; iteration < constraintIterations; iteration++) {
      segmentPositions.current[0].x = 0;
      segmentPositions.current[0].y = 0;
      segmentPositions.current[0].z = 0;
      
      segmentPositions.current[segments].x = cardHoleX;
      segmentPositions.current[segments].y = cardHoleY;
      segmentPositions.current[segments].z = cardHoleZ;
      
      for (let i = 0; i < segments; i++) {
        const p1 = segmentPositions.current[i];
        const p2 = segmentPositions.current[i + 1];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dz = p2.z - p1.z;
        const currentDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (currentDistance > 0.0001) {
          const difference = (currentDistance - segmentLength) / currentDistance;
          const offsetX = dx * difference * 0.5;
          const offsetY = dy * difference * 0.5;
          const offsetZ = dz * difference * 0.5;
          
          if (i !== 0) {
            p1.x += offsetX;
            p1.y += offsetY;
            p1.z += offsetZ;
          }
          
          if (i !== segments - 1) {
            p2.x -= offsetX;
            p2.y -= offsetY;
            p2.z -= offsetZ;
          }
        }
      }
    }
    
    // Build wide flat strap geometry
    const positions = [];
    for (let i = 0; i <= segments; i++) {
      const pos = segmentPositions.current[i];
      positions.push(pos.x, pos.y, pos.z);
    }
    
    // WIDER STRAP - like real lanyard fabric
    const width = 0.35 * scale; // Much wider - real lanyard width
    const thickness = 0.015 * scale; // Thin like fabric strap
    
    if (!lanyardRef.current.geometry) {
      lanyardRef.current.geometry = new THREE.BufferGeometry();
    }
    
    const geometry = lanyardRef.current.geometry;
    const vertices = [];
    const indices = [];
    const normals = [];
    
    for (let i = 0; i <= segments; i++) {
      const idx = i * 3;
      const x = positions[idx];
      const y = positions[idx + 1];
      const z = positions[idx + 2];
      
      // Calculate direction for proper strap orientation
      let dirX = 0, dirY = -1, dirZ = 0;
      if (i < segments) {
        const nextIdx = (i + 1) * 3;
        dirX = positions[nextIdx] - x;
        dirY = positions[nextIdx + 1] - y;
        dirZ = positions[nextIdx + 2] - z;
        const len = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        if (len > 0.001) {
          dirX /= len;
          dirY /= len;
          dirZ /= len;
        }
      }
      
      // Create wide flat strap (front, back, and edges)
      // Front face vertices
      vertices.push(
        x - width / 2, y, z + thickness / 2,
        x + width / 2, y, z + thickness / 2
      );
      
      // Back face vertices
      vertices.push(
        x - width / 2, y, z - thickness / 2,
        x + width / 2, y, z - thickness / 2
      );
      
      // Left edge vertices
      vertices.push(
        x - width / 2, y, z + thickness / 2,
        x - width / 2, y, z - thickness / 2
      );
      
      // Right edge vertices
      vertices.push(
        x + width / 2, y, z + thickness / 2,
        x + width / 2, y, z - thickness / 2
      );
      
      if (i < segments) {
        const base = i * 8;
        
        // Front face
        indices.push(base, base + 8, base + 1);
        indices.push(base + 1, base + 8, base + 9);
        
        // Back face
        indices.push(base + 2, base + 3, base + 10);
        indices.push(base + 3, base + 11, base + 10);
        
        // Left edge
        indices.push(base + 4, base + 12, base + 5);
        indices.push(base + 5, base + 12, base + 13);
        
        // Right edge
        indices.push(base + 6, base + 7, base + 14);
        indices.push(base + 7, base + 15, base + 14);
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
  });
  
  const cardCenterY = -3 * scale;
  const cardHoleOffsetY = 1.6 * scale;
  const cardHoleY = cardCenterY + cardHoleOffsetY;
  const cardHoleX = stretchPos.x * scale;
  const cardHoleZ = stretchPos.z * scale;
  
  return (
    <group>
      {/* Wide fabric strap */}
      <mesh ref={lanyardRef} castShadow receiveShadow>
        <bufferGeometry />
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.85}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Top metal ring - adjusted for wider strap */}
      <group position={[0, 0, 0.01]}>
        <mesh castShadow>
          <ringGeometry args={[0.08 * scale, 0.13 * scale, 48]} />
          <meshStandardMaterial 
            color="#4a4a4a" 
            metalness={0.95} 
            roughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <mesh position={[0, 0, 0.002]}>
          <ringGeometry args={[0.09 * scale, 0.11 * scale, 48]} />
          <meshStandardMaterial 
            color="#7a7a7a" 
            metalness={0.98} 
            roughness={0.05}
            side={THREE.DoubleSide}
            emissive="#2a2a2a"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
      
      {/* Bottom metal ring - adjusted for wider strap */}
      <group position={[cardHoleX, cardHoleY, cardHoleZ + 0.001]}>
        <mesh castShadow>
          <ringGeometry args={[0.07 * scale, 0.11 * scale, 48]} />
          <meshStandardMaterial 
            color="#4a4a4a" 
            metalness={0.95} 
            roughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <mesh position={[0, 0, 0.002]}>
          <ringGeometry args={[0.08 * scale, 0.095 * scale, 48]} />
          <meshStandardMaterial 
            color="#7a7a7a" 
            metalness={0.98} 
            roughness={0.05}
            side={THREE.DoubleSide}
            emissive="#2a2a2a"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    </group>
  );
}


// Bigger Responsive ID Card
function SwingingIDCard({ profileImagePath }) {
  const cardRef = useRef();
  const { gl, size } = useThree();
  
  const [isDragging, setIsDragging] = useState(false);
  const [stretchPos, setStretchPos] = useState({ x: 0, z: 0 });
  const [velocity, setVelocity] = useState({ x: 0, z: 0 });
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  
  // Bigger scale for all screen sizes
  const isMobile = size.width < 768;
  const isTablet = size.width >= 768 && size.width < 1024;
  
  const responsiveScale = isMobile ? 0.85 : isTablet ? 1.1 : 1.3; // Increased from 0.6/0.8/1
  const maxStretchMultiplier = isMobile ? 0.8 : 1;
  
  const idleSwayRef = useRef({
    phaseX: Math.random() * Math.PI * 2,
    phaseZ: Math.random() * Math.PI * 2,
    amplitude: 0.02 * responsiveScale,
    frequency: 0.35
  });
  
  useFrame((state, delta) => {
    if (!cardRef.current) return;
    
    if (!isDragging) {
      const hasMovement = Math.abs(velocity.x) > 0.001 || Math.abs(velocity.z) > 0.001 ||
                          Math.abs(stretchPos.x) > 0.01 || Math.abs(stretchPos.z) > 0.01;
      
      if (hasMovement) {
        const spring = 0.018; // Slightly softer spring
        const damping = 0.94; // More damping for smoother motion
        
        const forceX = -stretchPos.x * spring;
        const forceZ = -stretchPos.z * spring;
        
        let newVelX = (velocity.x + forceX) * damping;
        let newVelZ = (velocity.z + forceZ) * damping;
        
        if (Math.abs(newVelX) < 0.001) newVelX = 0;
        if (Math.abs(newVelZ) < 0.001) newVelZ = 0;
        
        setVelocity({ x: newVelX, z: newVelZ });
        
        const newStretchX = Math.abs(newVelX) < 0.001 && Math.abs(stretchPos.x) < 0.01 ? 0 : stretchPos.x + newVelX;
        const newStretchZ = Math.abs(newVelZ) < 0.001 && Math.abs(stretchPos.z) < 0.01 ? 0 : stretchPos.z + newVelZ;
        
        setStretchPos({ x: newStretchX, z: newStretchZ });
        
        cardRef.current.position.x = newStretchX * responsiveScale;
        cardRef.current.position.z = newStretchZ * responsiveScale;
      } else {
        const time = state.clock.elapsedTime;
        const sway = idleSwayRef.current;
        
        const idleX = Math.sin(time * sway.frequency + sway.phaseX) * sway.amplitude;
        const idleZ = Math.sin(time * sway.frequency * 1.3 + sway.phaseZ) * sway.amplitude;
        
        cardRef.current.position.x = idleX;
        cardRef.current.position.z = idleZ;
        setStretchPos({ x: idleX / responsiveScale, z: idleZ / responsiveScale });
      }
    }
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        handlePointerMove(e);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        handlePointerUp();
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      // Use passive: true to allow scrolling
      window.addEventListener('touchmove', handleMouseMove, { passive: true });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, stretchPos]);

  const handlePointerDown = (e) => {
    // Only prevent default for mouse events, allow touch events to bubble for scrolling
    if (e.type === 'mousedown') {
      e.stopPropagation();
    }
    setIsDragging(true);
    setVelocity({ x: 0, z: 0 });
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setLastMouse({ x: clientX, y: clientY });
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !cardRef.current) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - lastMouse.x;
    const deltaY = clientY - lastMouse.y;
    
    // If vertical movement is much larger than horizontal, allow page scroll
    if (e.touches && Math.abs(deltaY) > Math.abs(deltaX) * 1.5 && Math.abs(deltaY) > 10) {
      setIsDragging(false);
      gl.domElement.style.cursor = 'default';
      return;
    }
    
    const sensitivity = isMobile ? 0.007 : 0.005;
    const newStretchX = stretchPos.x + deltaX * sensitivity;
    const newStretchZ = stretchPos.z - deltaY * sensitivity;
    
    const maxStretch = 1.8 * maxStretchMultiplier; // Increased max stretch
    const distance = Math.sqrt(newStretchX * newStretchX + newStretchZ * newStretchZ);
    
    let clampedX = newStretchX;
    let clampedZ = newStretchZ;
    
    if (distance > maxStretch) {
      const scale = maxStretch / distance;
      clampedX = newStretchX * scale;
      clampedZ = newStretchZ * scale;
    }
    
    setStretchPos({ x: clampedX, z: clampedZ });
    setVelocity({
      x: (clampedX - stretchPos.x) * 1.5,
      z: (clampedZ - stretchPos.z) * 1.5
    });
    
    cardRef.current.position.x = clampedX * responsiveScale;
    cardRef.current.position.z = clampedZ * responsiveScale;
    
    setLastMouse({ x: clientX, y: clientY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    gl.domElement.style.cursor = 'grab';
  };

  const angle = { x: 0, z: 0 };

  return (
    <group position={[0, 3 * responsiveScale, 0]} scale={responsiveScale}>
      <RealisticLanyard angle={angle} stretchPos={stretchPos} scale={responsiveScale} />
      
      <group 
        ref={cardRef}
        position={[0, -3, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerEnter={() => gl.domElement.style.cursor = 'grab'}
        onPointerLeave={() => {
          setIsDragging(false);
          gl.domElement.style.cursor = 'default';
        }}
      >
        {/* Card with premium finish */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.5, 3.5, 0.04]} />
          <meshPhysicalMaterial
            color="#2a2a2a"
            metalness={0.15}
            roughness={0.35}
            clearcoat={0.9}
            clearcoatRoughness={0.15}
          />
        </mesh>

        <Suspense fallback={null}>
          <ProfileImage imagePath={profileImagePath} />
        </Suspense>

        {/* Glass overlay effect */}
        <mesh position={[0, 0, 0.021]}>
          <planeGeometry args={[2.5, 3.5]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.15}
            metalness={0.95}
            roughness={0.03}
            envMapIntensity={2.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Card hole */}
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function FloatingCard3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="floating-card-3d-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }} // Adjusted camera for bigger card
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: 'pan-y' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={2.5} castShadow />
          <spotLight position={[0, 5, 3]} angle={0.5} intensity={1.8} castShadow />
          <pointLight position={[-5, 0, -5]} intensity={0.6} color="#4a90e2" />
          <pointLight position={[5, 0, -5]} intensity={0.6} color="#9b59b6" />
          
          <Environment preset="studio" />
          <SwingingIDCard profileImagePath={profileImage} />
          
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
            <planeGeometry args={[25, 25]} />
            <shadowMaterial transparent opacity={0.25} />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default FloatingCard3D;
