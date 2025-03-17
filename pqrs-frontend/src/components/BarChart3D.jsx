import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei'; 
import * as THREE from 'three';

const SphereSegment = ({ radius, angleStart, angleEnd, color, label, labelPosition, labelColor }) => {
    const geometry = new THREE.SphereGeometry(radius, 32, 32, angleStart, angleEnd - angleStart);
    return (
        <>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <bufferGeometry attach="geometry" {...geometry} />
                <meshBasicMaterial
                    color={color} 
                    transparent={true} // Hacerlo completamente transparente
                    opacity={0.5} // Hacer que sea semitransparente
                />
            </mesh>

            {/* Texto flotante alrededor de la esfera */}
            <Text
                position={labelPosition}
                fontSize={1}
                color={labelColor}  // Color del texto basado en el estado
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        </>
    );
};

const Bubble = ({ position, color }) => {
    return (
        <mesh position={position}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color={color} transparent={true} opacity={0.7} />
        </mesh>
    );
};

const PieChart3D = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [bubbles, setBubbles] = useState([]);
    const [texture, setTexture] = useState(null);

    useEffect(() => {
        // Cargar la textura del mapa de Medellín
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('../../public/mapa_medellin.png', (loadedTexture) => {
            setTexture(loadedTexture);
        });

        fetch('http://localhost:5000/api/pqrs-data')
            .then(response => response.json())
            .then(data => {
                const groupedData = data.reduce((acc, item) => {
                    const date = item.fecha_respuesta;
                    const estado = item.estado;
                    if (!acc[date]) {
                        acc[date] = { FINALIZADO: 0, ABIERTO: 0 };
                    }
                    acc[date][estado] = (acc[date][estado] || 0) + 1;
                    return acc;
                }, {});

                const chartData = Object.entries(groupedData).map(([fecha, estados]) => ({
                    fecha,
                    finalizado: estados.FINALIZADO || 0,
                    abierto: estados.ABIERTO || 0,
                }));

                setData(chartData);
                setFilteredData(chartData);
            })
            .catch(error => console.error('Error al obtener datos:', error));

        // Agregar burbujas flotantes distribuidas por toda la esfera
        const bubblesArray = [];
        for (let i = 0; i < 20; i++) {
            const phi = Math.random() * Math.PI; // Ángulo azimutal (0 a pi)
            const theta = Math.random() * 2 * Math.PI; // Ángulo polar (0 a 2pi)
            const x = Math.sin(phi) * Math.cos(theta) * 15; // Radio de la esfera
            const y = Math.sin(phi) * Math.sin(theta) * 15;
            const z = Math.cos(phi) * 15;
            const color = new THREE.Color(Math.random(), Math.random(), Math.random()); // Color aleatorio
            bubblesArray.push({ position: [x, y, z], color });
        }
        setBubbles(bubblesArray);
    }, []);

    const handleMonthChange = (e) => {
        const month = e.target.value;
        setSelectedMonth(month);
        filterData(month, selectedYear);
    };

    const handleYearChange = (e) => {
        const year = e.target.value;
        setSelectedYear(year);
        filterData(selectedMonth, year);
    };

    const filterData = (month, year) => {
        const filtered = data.filter(item => {
            const date = new Date(item.fecha);
            const monthMatches = !month || date.getMonth() + 1 === parseInt(month);
            const yearMatches = !year || date.getFullYear() === parseInt(year);
            return monthMatches && yearMatches;
        });

        setFilteredData(filtered);
    };

    if (filteredData.length === 0) {
        return <div>Cargando datos...</div>;
    }

    const months = [...new Set(data.map(item => new Date(item.fecha).getMonth() + 1))];
    const years = [...new Set(data.map(item => new Date(item.fecha).getFullYear()))];

    return (
        <div>
            <div>
                <label htmlFor="month" className='mr-3'>Mes:</label>
                <select id="month" value={selectedMonth} onChange={handleMonthChange} className='bg-blue-200 p-1 rounded-sm'>
                    <option value="">Todos</option>
                    {months.map(month => (
                        <option key={month} value={month}>
                            {month < 10 ? `0${month}` : month}
                        </option>
                    ))}
                </select>

                <label htmlFor="year" className='ml-3 mr-3'>Año:</label>
                <select id="year" value={selectedYear} onChange={handleYearChange} className='bg-blue-200 p-1 rounded-sm'>
                    <option value="">Todos</option>
                    {years.map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <Canvas
                camera={{
                    position: [0, 30, 50], // Ajusta la posición inicial de la cámara
                    fov: 70,
                    near: 1,
                    far: 100,
                }}
                style={{ height: '100vh', width: '100%' }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />

                {/* Esfera con la textura del mapa de Medellín */}
                {texture && (
                    <mesh>
                        <sphereGeometry args={[10, 32, 32]} />
                        {/* Material sin color, solo la textura */}
                        <meshBasicMaterial map={texture} />
                    </mesh>
                )}

                {filteredData.map((item, index) => {
                    const total = item.finalizado + item.abierto;
                    const finalizadoAngle = (item.finalizado / total) * Math.PI * 2;
                    const abiertoAngle = (item.abierto / total) * Math.PI * 2;

                    const angleOffset = (index * (Math.PI / 4)); // Ajuste para separar las secciones
                    const labelOffset = 12; // Desplazar el texto fuera del gráfico
                    const verticalSpacing = 5; // Aumentamos la separación en el eje Y

                    return (
                        <>
                            {/* Crear los segmentos de la esfera para cada estado */}
                            <SphereSegment
                                key={`finalizado-${index}`}
                                radius={10}
                                angleStart={angleOffset}
                                angleEnd={angleOffset + finalizadoAngle}
                                color="green"
                                label={`Finalizado: ${item.finalizado}`}
                                labelPosition={[
                                    Math.cos(angleOffset + finalizadoAngle / 2) * labelOffset,
                                    2, // Levantar un poco el texto
                                    Math.sin(angleOffset + finalizadoAngle / 2) * labelOffset,
                                ]}
                                labelColor="green"  // Color del texto para Finalizado
                            />
                            <SphereSegment
                                key={`abierto-${index}`}
                                radius={10}
                                angleStart={angleOffset + finalizadoAngle}
                                angleEnd={angleOffset + finalizadoAngle + abiertoAngle}
                                color="blue"
                                label={`Abierto: ${item.abierto}`}
                                labelPosition={[
                                    Math.cos(angleOffset + finalizadoAngle + abiertoAngle / 2) * labelOffset,
                                    2 + verticalSpacing, // Mover el texto "Abierto" un poco más arriba en el eje Y
                                    Math.sin(angleOffset + finalizadoAngle + abiertoAngle / 2) * labelOffset,
                                ]}
                                labelColor="blue"  // Color del texto para Abierto
                            />
                        </>
                    );
                })}

                {/* Renderizar las burbujas flotantes distribuidas por toda la esfera */}
                {bubbles.map((bubble, index) => (
                    <Bubble key={index} position={bubble.position} color={bubble.color} />
                ))}

                {/* Agregar los controles de la cámara */}
                <OrbitControls />
            </Canvas>
        </div>
    );
};

export default PieChart3D;
