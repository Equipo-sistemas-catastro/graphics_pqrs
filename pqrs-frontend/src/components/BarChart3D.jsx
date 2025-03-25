import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';

const Card = ({ position, title, value, percentage, color }) => {
  return (
    <group position={position}>
      <RoundedBox args={[8, 4, 0.5]} radius={0.5}>
        <meshStandardMaterial color={color} />
      </RoundedBox>

      <Text position={[0, 1.2, 0.3]} fontSize={1} color="white" anchorX="center" anchorY="middle">
        {title}
      </Text>
      <Text position={[0, 0, 0.3]} fontSize={0.8} color="white" anchorX="center" anchorY="middle">
        {value}
      </Text>
      <Text position={[0, -1, 0.3]} fontSize={0.7} color="white" anchorX="center" anchorY="middle">
        {percentage} %
      </Text>
    </group>
  );
};

const PieChart3D = () => {
  const [cardData, setCardData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pqrs-estado');
        if (!response.ok) throw new Error('Error al obtener los datos');

        const data = await response.json();
        console.log('Datos obtenidos del backend:', data);

        setCardData({
          finalizado: parseInt(data.finalizado.total, 10),
          abierto: parseInt(data.abierto.total, 10),
          finalizadoPercentage: parseFloat(data.finalizado.percentage) * 100,
          abiertoPercentage: parseFloat(data.abierto.percentage) * 100,
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
          position: [0, 5, 15], // ✅ Ajustamos la posición de la cámara
          fov: 50,
          near: 1,
          far: 100,
        }}
        style={{ height: '100vh', width: '100%', background: '#bfdbfe', marginTop: '21px' }}
      >
        <color attach="background" args={["#bfdbfe"]} />

        <ambientLight intensity={1} /> {/* ✅ Luz ambiente más fuerte */}
        <directionalLight position={[5, 10, 5]} intensity={1.5} /> {/* ✅ Luz direccional más clara */}

        {/* ✅ Nueva luz de foco para mejor visibilidad */}
        <spotLight position={[0, 10, 10]} angle={0.3} intensity={2} penumbra={0.5} />

        {loading ? (
          <Text position={[0, 0, 0]} fontSize={2} color="#000000" anchorX="center" anchorY="middle">
            Loading...
          </Text>
        ) : (
          <>
            <Card
              position={[-5, 1, -10]} // ✅ Ajustado para mejor visibilidad
              title="Finalizado"
              value={cardData.finalizado}
              percentage={cardData.finalizadoPercentage}
              color="#33B900"
            />
            <Card
              position={[5, -1, -10]} // ✅ Más cerca para que se vea bien
              title="Abierto"
              value={cardData.abierto}
              percentage={cardData.abiertoPercentage}
              color="#A90017"
            />
          </>
        )}

        <OrbitControls target={[0, 0, -10]} />
      </Canvas>
    </div>
  );
};

export default PieChart3D;
