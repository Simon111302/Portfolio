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


// Lobster Clasp
function LobsterClaspConnector({ position }) {
  return (
    <group position={position}>
      <mesh castShadow rotation={[0, 0, 0]}>
        <capsuleGeometry args={[0.04, 0.15, 16, 32]} />
        <meshPhysicalMaterial 
          color="#4a4a4a" 
          metalness={0.98} 
          roughness={0.08}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          ior={1.5}
        />
      </mesh>
      
      <mesh castShadow position={[0.035, 0.05, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.025, 0.08, 0.02]} />
        <meshPhysicalMaterial 
          color="#3a3a3a" 
          metalness={0.95} 
          roughness={0.12}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
        />
      </mesh>
      
      <mesh castShadow position={[0.04, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.06, 16]} />
        <meshPhysicalMaterial 
          color="#5a5a5a" 
          metalness={0.85} 
          roughness={0.25}
          clearcoat={0.9}
          clearcoatRoughness={0.15}
        />
      </mesh>
      
      <mesh castShadow position={[0, 0.12, 0]}>
        <torusGeometry args={[0.045, 0.015, 16, 32]} />
        <meshPhysicalMaterial 
          color="#3a3a3a" 
          metalness={0.98} 
          roughness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          ior={1.5}
        />
      </mesh>
      
      <group position={[0, -0.08, 0]}>
        <mesh castShadow rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.03, 0.01, 16, 32, Math.PI]} />
          <meshPhysicalMaterial 
            color="#4a4a4a" 
            metalness={0.98} 
            roughness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
          />
        </mesh>
      </group>
      
      <mesh castShadow position={[0.045, 0.02, 0]}>
        <boxGeometry args={[0.02, 0.04, 0.035]} />
        <meshPhysicalMaterial 
          color="#5a5a5a" 
          metalness={0.9} 
          roughness={0.18}
          clearcoat={0.95}
          clearcoatRoughness={0.12}
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


// Fabric Strap
function FabricStrap({ curve }) {
  const strapRef = useRef();
  
  const createFabricTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(0.5, '#330000');
    gradient.addColorStop(1, '#000000');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const weaveSize = 8;
    for (let y = 0; y < canvas.height; y += weaveSize) {
      for (let x = 0; x < canvas.width; x += weaveSize) {
        const brightness = (x + y) % (weaveSize * 2) < weaveSize ? 20 : 35;
        ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.3)`;
        ctx.fillRect(x, y, weaveSize, weaveSize);
      }
    }
    
    const stripeWidth = 60;
    const stripeSpacing = 120;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    for (let x = stripeWidth; x < canvas.width; x += stripeSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    for (let i = -canvas.height; i < canvas.width + canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + canvas.height, canvas.height);
      ctx.stroke();
    }
    
    ctx.strokeStyle = 'rgba(50, 0, 0, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.lineTo(4, canvas.height);
    ctx.moveTo(canvas.width - 4, 0);
    ctx.lineTo(canvas.width - 4, canvas.height);
    ctx.stroke();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(-3, 1);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };
  
  const [fabricTexture] = useState(() => createFabricTexture());
  const { width, height } = useThree((state) => state.size);
  
  useFrame(() => {
    if (!strapRef.current || !strapRef.current.geometry) return;
    strapRef.current.geometry.setPoints(curve.getPoints(32));
  });
  
  return (
    <mesh ref={strapRef} castShadow receiveShadow>
      <meshLineGeometry />
      <meshLineMaterial
        color="#ffffff"
        useMap
        map={fabricTexture}
        depthTest={false}
        resolution={[width, height]}
        lineWidth={0.4}
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
  
  const vec = new THREE.Vector3();
  const dir = new THREE.Vector3();
  
  const [dragged, drag] = useState(false);
  const lastPosition = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());
  
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
      
      if (j1Trans) j1.current.setTranslation({ x: j1Trans.x, y: j1Trans.y, z: 0 }, false);
      if (j2Trans) j2.current.setTranslation({ x: j2Trans.x, y: j2Trans.y, z: 0 }, false);
      if (j3Trans) j3.current.setTranslation({ x: j3Trans.x, y: j3Trans.y, z: 0 }, false);
    }
  });
  
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
        lockRotations
        enabledRotations={[false, false, false]}
        linearDamping={0.3}
        angularDamping={0.3}
      >
        <CuboidCollider args={[1, 1, 0.01]} />
        
        <CardRing position={[0, 1.75, 0]} />
        <LobsterClaspConnector position={[0, 1.95, 0]} />
        
        <mesh
          castShadow
          receiveShadow
          onPointerOver={() => document.body.style.cursor = 'grab'}
          onPointerOut={() => document.body.style.cursor = 'default'}
          onPointerUp={(e) => {
            e.target.releasePointerCapture(e.pointerId);
            
            if (card.current && velocity.current.length() > 0.1) {
              const impulse = velocity.current.clone().multiplyScalar(0.5);
              card.current.applyImpulse({ x: impulse.x, y: impulse.y, z: 0 }, true);
            }
            
            drag(false);
            document.body.style.cursor = 'grab';
          }}
          onPointerDown={(e) => {
            e.target.setPointerCapture(e.pointerId);
            document.body.style.cursor = 'grabbing';
            
            const currentPos = card.current.translation();
            lastPosition.current.set(currentPos.x, currentPos.y, currentPos.z);
            velocity.current.set(0, 0, 0);
            
            drag(
              new THREE.Vector3()
                .copy(e.point)
                .sub(vec.copy(currentPos))
            );
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
      </RigidBody>
    </>
  );
}


function FloatingCard3D() {
  return (
    <>
      {/* Scroll zones on the sides */}
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
