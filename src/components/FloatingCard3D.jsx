import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Environment, useTexture } from '@react-three/drei';
import { 
  Physics, 
  RigidBody, 
  CuboidCollider, 
  BallCollider,
  useSphericalJoint, 
  useRopeJoint 
} from '@react-three/rapier';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import profileImage from '../assets/simon2.jpg';
import reactIcon from '../../img/react.png';
import csharpIcon from '../../img/c-sharp.png';
import phpIcon from '../../img/php.png';
import pythonIcon from '../../img/python.png';
import cppIcon from '../../img/c-.png';
import '../design/FloatingCard3D.css';

extend({ MeshLineGeometry, MeshLineMaterial });

// Profile Image
function ProfileImage({ imagePath }) {
  const profileImageTexture = useTexture(imagePath);
  profileImageTexture.colorSpace = THREE.SRGBColorSpace;
  
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

// Back of Card with Tech Icons
function BackOfCard() {
  const [reactTex, csharpTex, phpTex, pythonTex, cppTex] = useTexture([
    reactIcon,
    csharpIcon,
    phpIcon,
    pythonIcon,
    cppIcon
  ]);

  [reactTex, csharpTex, phpTex, pythonTex, cppTex].forEach(tex => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;
  });

  const iconSize = 0.4;
  const radius = 0.85;
  const icons = [
    { texture: reactTex },
    { texture: csharpTex },
    { texture: phpTex },
    { texture: pythonTex },
    { texture: cppTex }
  ];

  return (
    <group position={[0, 0, -0.026]} rotation={[0, Math.PI, 0]}>
      {/* Background */}
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[2.4, 3.4]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Tech Icons arranged in a circle */}
      {icons.map((icon, index) => {
        const angle = (index / icons.length) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <group key={index} position={[x, y, 0.002]}>
            {/* Black circular background for each icon */}
            <mesh position={[0, 0, -0.001]}>
              <circleGeometry args={[iconSize / 1.5, 64]} />
              <meshStandardMaterial
                color="#000000"
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>
            
            {/* Icon with better quality */}
            <mesh>
              <circleGeometry args={[iconSize / 1.7, 64]} />
              <meshStandardMaterial
                map={icon.texture}
                transparent
                alphaTest={0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Just the Clean Ring Holder (Replace LobsterClaspConnector)
function LobsterClaspConnector({ position }) {
  return (
    <group position={position}>
      {/* Perfect clean ring only */}
      <mesh castShadow>
        <torusGeometry args={[0.038, 0.008, 12, 24]} />
        <meshPhysicalMaterial 
          color="#3a3a3a" 
          metalness={0.98} 
          roughness={0.05}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          ior={1.5}
        />
      </mesh>
    </group>
  );
}

// Card Ring
function CardRing({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <torusGeometry args={[0.06, 0.015, 16, 32]} />
        <meshPhysicalMaterial 
          color="#4a4a4a" 
          metalness={0.98} 
          roughness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          ior={1.5}
        />
      </mesh>
    </group>
  );
}

// Dark Red + Wider Strap (Perfect Match)
function FabricStrap({ curve }) {
  const strapRef = useRef();
  const { width, height } = useThree((state) => state.size);
  
  useFrame(() => {
    if (!strapRef.current?.geometry) return;
    strapRef.current.geometry.setPoints(curve.getPoints(40));
    strapRef.current.geometry.needsUpdate = true;
  });
  
  return (
    <mesh ref={strapRef} castShadow>
      <meshLineGeometry />
      <meshLineMaterial
        color="#660000"        // Dark rich red
        transparent
        opacity={0.94}
        resolution={[width, height]}
        lineWidth={0.22}      // Wider (doubled from 0.12)
        depthTest={false}
      />
    </mesh>
  );
}

// Main Band component
function Band() {
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();
  const meshRef = useRef();
  
  const vec = new THREE.Vector3();
  const dir = new THREE.Vector3();
  
  const [dragged, drag] = useState(false);
  const lastPosition = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());
  
  const pointerDownTime = useRef(0);
  const pointerDownPos = useRef(new THREE.Vector2());
  
  const { camera } = useThree();
  
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    ]);
    c.curveType = 'chordal';
    return c;
  });
  
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.6]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.6]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.6]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.95, 0]]);
  
// Stable Strap (Less Shakey) - Update Band() useFrame only
useFrame((state, delta) => {
  if (!card.current) return;
  
  if (fixed.current) {
    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(j2.current.translation());
    curve.points[2].copy(j1.current.translation());
    curve.points[3].copy(fixed.current.translation());
  }
  
  if (dragged) {
    vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(camera);
    dir.copy(vec).sub(camera.position).normalize();
    vec.add(dir.multiplyScalar(camera.position.length()));
    
    [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
    
    const newPos = {
      x: vec.x - dragged.x,
      y: vec.y - dragged.y,
      z: 0
    };
    
    const currentPos = new THREE.Vector3(newPos.x, newPos.y, newPos.z);
    velocity.current.subVectors(currentPos, lastPosition.current).divideScalar(delta);
    
    lastPosition.current.copy(currentPos);
    card.current?.setNextKinematicTranslation(newPos);
  }
  
  if (!dragged) {
    const j1Trans = j1.current?.translation();
    const j2Trans = j2.current?.translation();
    const j3Trans = j3.current?.translation();
    
    // HIGHER DAMPING = LESS SHAKEY
    if (j1Trans) j1.current.setTranslation({ x: j1Trans.x, y: j1Trans.y, z: 0 }, false);
    if (j2Trans) j2.current.setTranslation({ x: j2Trans.x, y: j2Trans.y, z: 0 }, false);
    if (j3Trans) j3.current.setTranslation({ x: j3Trans.x, y: j3Trans.y, z: 0 }, false);
  }
});

  // Handle card poke - spin based on left/right side (NO bounce, just spin)
  const handleCardPoke = (pokeX) => {
    // Apply rotational impulse based on where the card was poked
    const torqueStrength = 3.5;
    const torque = {
      x: 0,
      y: pokeX < 0 ? -torqueStrength : torqueStrength, // Spin around Y axis based on left/right
      z: 0
    };
    
    card.current.applyTorqueImpulse(torque, true);
    card.current.wakeUp();
  };
  
  return (
    <>
      <RigidBody ref={fixed} type="fixed" position={[0, 3.2, 0]} />
      
      <RigidBody position={[0, 2.6, 0]} ref={j1} lockRotations enabledRotations={[false, false, false]}>
        <BallCollider args={[0.05]} />
      </RigidBody>
      
      <RigidBody position={[0, 2, 0]} ref={j2} lockRotations enabledRotations={[false, false, false]}>
        <BallCollider args={[0.05]} />
      </RigidBody>
      
      <RigidBody position={[0, 1.4, 0]} ref={j3} lockRotations enabledRotations={[false, false, false]}>
        <BallCollider args={[0.05]} />
      </RigidBody>
      
      <FabricStrap curve={curve} />
      
      <RigidBody
        ref={card}
        type={dragged ? 'kinematicPosition' : 'dynamic'}
        position={[0, 1, 0]}
        colliders={false}
        lockRotations={false}
        enabledRotations={[true, true, true]} // Enable all 360° rotations
        linearDamping={0.3}
        angularDamping={0.6}
      >
        <CuboidCollider args={[1, 1, 0.01]} />
        
        <CardRing position={[0, 1.75, 0]} />
        <LobsterClaspConnector position={[0, 1.95, 0]} />
        
        <mesh
          ref={meshRef}
          castShadow
          receiveShadow
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'default')}
          onPointerDown={(e) => {
            e.stopPropagation();
            pointerDownTime.current = Date.now();
            pointerDownPos.current.set(e.clientX, e.clientY);
            
            e.target.setPointerCapture(e.pointerId);
            
            const currentPos = card.current.translation();
            lastPosition.current.set(currentPos.x, currentPos.y, currentPos.z);
            velocity.current.set(0, 0, 0);
            
            drag(
              new THREE.Vector3()
                .copy(e.point)
                .sub(vec.copy(currentPos))
            );
          }}
          onPointerUp={(e) => {
            e.target.releasePointerCapture(e.pointerId);
            
            const pointerUpTime = Date.now();
            const timeDiff = pointerUpTime - pointerDownTime.current;
            
            const pointerUpPos = new THREE.Vector2(e.clientX, e.clientY);
            const distance = pointerDownPos.current.distanceTo(pointerUpPos);
            
            // If it's a quick click (poke), trigger spin
            if (timeDiff < 200 && distance < 10) {
              const cardPos = card.current.translation();
              const localX = e.point.x - cardPos.x; // Get relative X position on card
              handleCardPoke(localX);
            } else if (card.current && velocity.current.length() > 0.1) {
              // If it was a drag, apply impulse for swing effect
              const impulse = velocity.current.clone().multiplyScalar(0.5);
              card.current.applyImpulse({ x: impulse.x, y: impulse.y, z: 0 }, true);
              
              // Add rotational impulse for 360° swing
              const torque = {
                x: (Math.random() - 0.5) * 0.2,
                y: (Math.random() - 0.5) * 0.2,
                z: (Math.random() - 0.5) * 0.2
              };
              card.current.applyTorqueImpulse(torque, true);
            }
            
            drag(false);
            document.body.style.cursor = 'default';
          }}
        >
          <boxGeometry args={[2.5, 3.5, 0.04]} />
          <meshPhysicalMaterial
            color="#1e1e1e"
            metalness={0.1}
            roughness={0.3}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            ior={1.5}
            thickness={0.5}
            transmission={0}
          />
        </mesh>
        
        {/* Red Border Frame around the card */}
        <group position={[0, 0, 0.022]}>
          {/* Top border */}
          <mesh position={[0, 1.75, 0]}>
            <boxGeometry args={[2.5, 0.05, 0.01]} />
            <meshStandardMaterial color="#ff0000" metalness={0.6} roughness={0.3} />
          </mesh>
          
          {/* Bottom border */}
          <mesh position={[0, -1.75, 0]}>
            <boxGeometry args={[2.5, 0.05, 0.01]} />
            <meshStandardMaterial color="#ff0000" metalness={0.6} roughness={0.3} />
          </mesh>
          
          {/* Left border */}
          <mesh position={[-1.25, 0, 0]}>
            <boxGeometry args={[0.05, 3.5, 0.01]} />
            <meshStandardMaterial color="#ff0000" metalness={0.6} roughness={0.3} />
          </mesh>
          
          {/* Right border */}
          <mesh position={[1.25, 0, 0]}>
            <boxGeometry args={[0.05, 3.5, 0.01]} />
            <meshStandardMaterial color="#ff0000" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
        
        <Suspense fallback={null}>
          <ProfileImage imagePath={profileImage} />
        </Suspense>
        
        <mesh position={[0, 0, 0.021]}>
          <planeGeometry args={[2.5, 3.5]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.2}
            metalness={0.98}
            roughness={0.02}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            envMapIntensity={3.0}
            ior={1.6}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <mesh position={[0, 1.65, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.06, 32]} />
          <meshPhysicalMaterial 
            color="#2a2a2a" 
            metalness={0.7} 
            roughness={0.3}
            clearcoat={0.8}
            clearcoatRoughness={0.2}
          />
        </mesh>
        
        {/* Back side with tech icons */}
        <Suspense fallback={null}>
          <BackOfCard />
        </Suspense>
      </RigidBody>
    </>
  );
}

function FloatingCard3D() {
  return (
    <>
      <div className="scroll-zone-left"></div>
      <div className="scroll-zone-right"></div>
      
      <div className="floating-card-3d-container">
        <Canvas
          camera={{ 
            position: [0, 0, 10], 
            fov: 45,
            near: 0.1,
            far: 10000
          }}
          shadows
          gl={{ 
            antialias: true, 
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            shadowMap: {
              enabled: true,
              type: THREE.PCFSoftShadowMap
            }
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight 
              position={[5, 8, 5]} 
              intensity={3.0} 
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-near={0.1}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
              shadow-bias={-0.0001}
            />
            <spotLight 
              position={[0, 5, 3]} 
              angle={0.4} 
              intensity={2.0} 
              penumbra={0.5}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <pointLight position={[-5, 2, -5]} intensity={0.8} color="#ffffff" distance={15} decay={2} />
            <pointLight position={[5, 2, -5]} intensity={0.8} color="#ffffff" distance={15} decay={2} />
            
            <Environment preset="studio" />
            
            <Physics gravity={[0, -9.81, 0]}>
              <Band />
            </Physics>
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default FloatingCard3D;
