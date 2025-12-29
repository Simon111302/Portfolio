import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
import profileImage from '../assets/simon2.jpg';
import '../design/FloatingCard3D.css';



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
function LobsterClaspConnector({ position, lanyardEndPoint }) {
  return (
    <group position={position}>
      <mesh castShadow rotation={[0, 0, 0]}>
        <capsuleGeometry args={[0.04, 0.15, 8, 16]} />
        <meshStandardMaterial 
          color="#3a3a3a" 
          metalness={0.95} 
          roughness={0.15}
        />
      </mesh>
      
      <mesh castShadow position={[0.035, 0.05, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.025, 0.08, 0.02]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          metalness={0.9} 
          roughness={0.2}
        />
      </mesh>
      
      <mesh castShadow position={[0.04, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.06, 8]} />
        <meshStandardMaterial 
          color="#4a4a4a" 
          metalness={0.7} 
          roughness={0.4}
        />
      </mesh>
      
      <mesh castShadow position={[0, 0.12, 0]}>
        <torusGeometry args={[0.045, 0.015, 12, 24]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          metalness={0.95} 
          roughness={0.15}
        />
      </mesh>
      
      <group position={[0, -0.08, 0]}>
        <mesh castShadow rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.03, 0.01, 12, 24, Math.PI]} />
          <meshStandardMaterial 
            color="#3a3a3a" 
            metalness={0.95} 
            roughness={0.15}
          />
        </mesh>
      </group>
      
      <mesh castShadow position={[0.045, 0.02, 0]}>
        <boxGeometry args={[0.02, 0.04, 0.035]} />
        <meshStandardMaterial 
          color="#4a4a4a" 
          metalness={0.85} 
          roughness={0.25}
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
        <torusGeometry args={[0.06, 0.015, 12, 24]} />
        <meshStandardMaterial 
          color="#3a3a3a" 
          metalness={0.9} 
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}



// Fabric Strap
function FabricStrap({ curve, claspPosition }) {
  const strapRef = useRef();
  
  useFrame(() => {
    if (!strapRef.current) return;
    
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry();
    
    const vertices = [];
    const uvs = [];
    const indices = [];
    
    const strapWidth = 0.4;
    const strapThickness = 0.008;
    
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const nextPoint = points[Math.min(i + 1, points.length - 1)];
      
      const direction = new THREE.Vector3().subVectors(nextPoint, point).normalize();
      const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0).normalize();
      
      const left = new THREE.Vector3().addVectors(point, perpendicular.clone().multiplyScalar(strapWidth / 2));
      const right = new THREE.Vector3().addVectors(point, perpendicular.clone().multiplyScalar(-strapWidth / 2));
      
      vertices.push(left.x, left.y, left.z + strapThickness);
      vertices.push(right.x, right.y, right.z + strapThickness);
      vertices.push(left.x, left.y, left.z - strapThickness);
      vertices.push(right.x, right.y, right.z - strapThickness);
      
      const v = i / (points.length - 1);
      uvs.push(0, v, 1, v, 0, v, 1, v);
      
      if (i < points.length - 1) {
        const base = i * 4;
        indices.push(base, base + 4, base + 1);
        indices.push(base + 1, base + 4, base + 5);
        indices.push(base + 2, base + 3, base + 6);
        indices.push(base + 3, base + 7, base + 6);
        indices.push(base, base + 2, base + 4);
        indices.push(base + 4, base + 2, base + 6);
        indices.push(base + 1, base + 5, base + 3);
        indices.push(base + 5, base + 7, base + 3);
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    if (strapRef.current.geometry) {
      strapRef.current.geometry.dispose();
    }
    strapRef.current.geometry = geometry;
  });
  
  return (
    <>
      {/* Main fabric strap - NOW PURE BLACK */}
      <mesh ref={strapRef} castShadow receiveShadow>
        <bufferGeometry />
        <meshStandardMaterial 
          color="#000000"  // ← Changed to pure black
          roughness={0.95}  // ← Increased for matte look
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Folded end of lanyard that loops through clasp ring */}
      <group position={claspPosition}>
        {/* Small fabric loop through the clasp ring */}
        <mesh castShadow position={[0, 0.12, 0]}>
          <torusGeometry args={[0.045, 0.025, 8, 16, Math.PI]} />
          <meshStandardMaterial 
            color="#000000"  // ← Changed to pure black
            roughness={0.95}  // ← Increased for matte look
            metalness={0.0}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Stitched fold-back section */}
        <mesh castShadow position={[0, 0.08, 0]}>
          <boxGeometry args={[0.4, 0.04, 0.008]} />
          <meshStandardMaterial 
            color="#000000"  // ← Changed to pure black
            roughness={0.95}  // ← Increased for matte look
            metalness={0.0}
          />
        </mesh>
        
        {/* Visible stitching lines - slightly lighter for visibility */}
        <mesh castShadow position={[0, 0.075, 0.005]}>
          <boxGeometry args={[0.38, 0.002, 0.001]} />
          <meshStandardMaterial 
            color="#2a2a2a"  // ← Kept slightly gray so stitching is visible
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>
        
        <mesh castShadow position={[0, 0.085, 0.005]}>
          <boxGeometry args={[0.38, 0.002, 0.001]} />
          <meshStandardMaterial 
            color="#2a2a2a"  // ← Kept slightly gray so stitching is visible
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>
      </group>
    </>
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
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  
  const [dragged, drag] = useState(false);
  const [claspPos, setClaspPos] = useState(new THREE.Vector3(0, 1.95, 0));
  
  const { camera } = useThree();
  
  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  ]));
  
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.6]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.6]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.6]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.95, 0]]);
  
  useFrame((state) => {
    if (!card.current) return;
    
    const cardTranslation = card.current.translation();
    const claspWorldPos = new THREE.Vector3(
      cardTranslation.x,
      cardTranslation.y + 1.95,
      cardTranslation.z
    );
    setClaspPos(claspWorldPos);
    
    curve.points[0].set(claspWorldPos.x, claspWorldPos.y + 0.12, claspWorldPos.z);
    curve.points[1].copy(j2.current.translation());
    curve.points[2].copy(j1.current.translation());
    curve.points[3].copy(fixed.current.translation());
    
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(camera);
      dir.copy(vec).sub(camera.position).normalize();
      vec.add(dir.multiplyScalar(camera.position.length()));
      
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      
      // Allow dragging in all directions - remove Z lock during drag
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: 0
      });
    }
    
    // Only lock rotation, not position during non-drag
    if (!dragged) {
      card.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, false);
      card.current.setTranslation({ x: cardTranslation.x, y: cardTranslation.y, z: 0 }, false);
      
      if (j1.current) {
        const j1Trans = j1.current.translation();
        j1.current.setTranslation({ x: j1Trans.x, y: j1Trans.y, z: 0 }, false);
      }
      if (j2.current) {
        const j2Trans = j2.current.translation();
        j2.current.setTranslation({ x: j2Trans.x, y: j2Trans.y, z: 0 }, false);
      }
      if (j3.current) {
        const j3Trans = j3.current.translation();
        j3.current.setTranslation({ x: j3Trans.x, y: j3Trans.y, z: 0 }, false);
      }
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
      
      <FabricStrap curve={curve} claspPosition={claspPos} />
      
      <RigidBody
        ref={card}
        type={dragged ? 'kinematicPosition' : 'dynamic'}
        position={[0, 1, 0]}
        colliders={false}
        lockRotations
        enabledRotations={[false, false, false]}
      >
        <CuboidCollider args={[1, 1, 0.01]} />
        
        <CardRing position={[0, 1.75, 0]} />
        <LobsterClaspConnector position={[0, 1.95, 0]} />
        
        {/* Make the card easier to click by adding pointer events */}
        <mesh
          castShadow
          receiveShadow
          onPointerOver={() => document.body.style.cursor = 'grab'}
          onPointerOut={() => document.body.style.cursor = 'default'}
          onPointerUp={(e) => {
            e.target.releasePointerCapture(e.pointerId);
            drag(false);
            document.body.style.cursor = 'grab';
          }}
          onPointerDown={(e) => {
            e.target.setPointerCapture(e.pointerId);
            document.body.style.cursor = 'grabbing';
            drag(
              new THREE.Vector3()
                .copy(e.point)
                .sub(vec.copy(card.current.translation()))
            );
          }}
        >
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
          <ProfileImage imagePath={profileImage} />
        </Suspense>
        
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
        
        <mesh position={[0, 1.65, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.5} />
        </mesh>
      </RigidBody>
    </>
  );
}



function FloatingCard3D() {
  return (
    <div className="floating-card-3d-container">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: 'none' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 8, 5]} intensity={2.5} castShadow />
          <spotLight position={[0, 5, 3]} angle={0.5} intensity={1.8} castShadow />
          <pointLight position={[-5, 0, -5]} intensity={0.6} color="#4a90e2" />
          <pointLight position={[5, 0, -5]} intensity={0.6} color="#9b59b6" />
          
          <Environment preset="studio" />
          
          <Physics>
            <Band />
          </Physics>
          
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
