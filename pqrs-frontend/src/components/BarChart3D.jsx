import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei'; 
import * as THREE from 'three';

const Card = ({ position, title, value, percentage }) => {
  return (
    <mesh position={position}>
      <planeGeometry args={[10, 5]} />
      <meshStandardMaterial color="#f0f0f0" />
      
      <Text
        position={[0, 2, 0]} 
        fontSize={2}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
      <Text
        position={[0, 0.3, 0]} 
        fontSize={1.5}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
      <Text
        position={[0, -1, 0]} 
        fontSize={1}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {percentage} %
      </Text>
    </mesh>
  );
};

const PieChart3D = () => {
  const [cardData, setCardData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/pqrs-estado');
        if (!response.ok) throw new Error('Error al obtener los datos');
        const data = await response.json();
        setCardData({
          finalizado: data.finalizado.total,
          abierto: data.abierto.total,
          finalizadoPercentage: data.finalizado.percentage,
          abiertoPercentage: data.abierto.percentage,
        });
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Canvas
        camera={{
          position: [0, 30, 50],
          fov: 70,
          near: 1,
          far: 100,
        }}
        style={{ height: '100vh', width: '100%', background: "#1a1a1a", marginTop: "21px" }}
      >
        <color attach="background" args={["#1a1a1a"]} />
        <fog attach="fog" args={["#1a1a1a", 50, 100]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {loading ? (
          <Text position={[0, 0, 0]} fontSize={2} color="#ffffff" anchorX="center" anchorY="middle">
            Loading...
          </Text>
        ) : (
          <>
            <Card
              position={[0, 10, -20]}
              title="Finalizado"
              value={cardData.finalizado}
              percentage={cardData.finalizadoPercentage}
            />
            <Card
              position={[0, 5, -20]}
              title="Abierto"
              value={cardData.abierto}
              percentage={cardData.abiertoPercentage}
            />
          </>
        )}

        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default PieChart3D;
