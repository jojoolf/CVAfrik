'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Stars } from '@react-three/drei'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

const CITIES = [
  { name: 'Dakar', lat: 14.7, lon: -17.4 },
  { name: 'Abidjan', lat: 5.3, lon: -4.0 },
  { name: 'Lagos', lat: 6.5, lon: 3.4 },
  { name: 'Accra', lat: 5.6, lon: -0.2 },
  { name: 'Casablanca', lat: 33.6, lon: -7.6 },
  { name: 'Cairo', lat: 30.0, lon: 31.2 },
  { name: 'Nairobi', lat: -1.3, lon: 36.8 },
  { name: 'Johannesburg', lat: -26.2, lon: 28.0 },
  { name: 'Kinshasa', lat: -4.3, lon: 15.3 },
  { name: 'Addis Ababa', lat: 9.0, lon: 38.7 },
  { name: 'Algiers', lat: 36.7, lon: 3.0 },
  { name: 'Tunis', lat: 36.8, lon: 10.2 },
  { name: 'Yaoundé', lat: 3.9, lon: 11.5 },
  { name: 'Bamako', lat: 12.6, lon: -8.0 },
  { name: 'Ouagadougou', lat: 12.4, lon: -1.5 },
  { name: 'Cotonou', lat: 6.4, lon: 2.4 },
  { name: 'Lomé', lat: 6.2, lon: 1.2 },
  { name: 'Kigali', lat: -1.9, lon: 30.1 },
]

function latLonToVec3(lat: number, lon: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

function Globe() {
  const group = useRef<THREE.Group>(null)

  const dots = useMemo(() => {
    const positions: number[] = []
    const r = 2
    const N = 4000
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(-1 + (2 * i) / N)
      const theta = Math.sqrt(N * Math.PI) * phi
      positions.push(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi),
      )
    }
    return new Float32Array(positions)
  }, [])

  const cityPoints = useMemo(
    () => CITIES.map((c) => latLonToVec3(c.lat, c.lon, 2.04)),
    [],
  )

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.12
  })

  return (
    <group ref={group} rotation={[0.2, -0.3, 0]}>
      <Sphere args={[2.15, 64, 64]}>
        <meshBasicMaterial
          color="#f5b942"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </Sphere>

      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1a1410"
          roughness={0.9}
          metalness={0.2}
        />
      </Sphere>

      <Sphere args={[2.005, 32, 16]}>
        <meshBasicMaterial
          color="#f5b942"
          wireframe
          transparent
          opacity={0.18}
        />
      </Sphere>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dots, 3]}
            count={dots.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#f5b942"
          size={0.018}
          sizeAttenuation
          transparent
          opacity={0.7}
        />
      </points>

      {cityPoints.map((p, i) => (
        <group key={i} position={p}>
          <mesh>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#ffd97a" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshBasicMaterial color="#ffd97a" transparent opacity={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function AfricaGlobe() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffd97a" />
          <directionalLight position={[-5, -2, -3]} intensity={0.3} color="#ff8a4c" />
          <Stars radius={50} depth={20} count={1500} factor={2} fade speed={0.5} />
          <Globe />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            rotateSpeed={0.4}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
