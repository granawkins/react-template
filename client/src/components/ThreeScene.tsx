import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';

const ThreeScene = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        {/* Ambient light for overall scene illumination */}
        <ambientLight intensity={0.5} />
        {/* Directional light for shadows and highlights */}
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {/* Sphere primitive from drei */}
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial color="peru" />
        </Sphere>
        {/* Orbital controls for camera movement */}
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default ThreeScene;