import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";


function FloatingMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * 0.3;
  });
  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshStandardMaterial color="#C08552" />
    </mesh>
  );
}

export const ParallaxScene = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <motion.div style={{ y }} className="h-[500px] w-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} />
        <FloatingMesh />
      </Canvas>
    </motion.div>
  );
};