'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Stars } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState, Suspense } from 'react'
import { useTheme } from 'next-themes'
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

type GlobePalette = {
  halo: string
  surface: string
  wire: string
  points: string
  city: string
  keyLight: string
  rimLight: string
  haloOpacity: number
  wireOpacity: number
  pointsOpacity: number
  ambientIntensity: number
  keyIntensity: number
  rimIntensity: number
}

const DARK_PALETTE: GlobePalette = {
  halo: '#f5b942',
  surface: '#1a1410',
  wire: '#f5b942',
  points: '#f5b942',
  city: '#ffd97a',
  keyLight: '#ffd97a',
  rimLight: '#ff8a4c',
  haloOpacity: 0.04,
  wireOpacity: 0.18,
  pointsOpacity: 0.7,
  ambientIntensity: 0.25,
  keyIntensity: 0.8,
  rimIntensity: 0.2,
}

const LIGHT_PALETTE: GlobePalette = {
  halo: '#f59e0b',
  surface: '#fff8e8',
  wire: '#d97706',
  points: '#ea580c',
  city: '#b45309',
  keyLight: '#f59e0b',
  rimLight: '#f97316',
  haloOpacity: 0.24,
  wireOpacity: 0.3,
  pointsOpacity: 0.62,
  ambientIntensity: 1.05,
  keyIntensity: 1.05,
  rimIntensity: 0.34,
}

function latLonToVec3(lat: number, lon: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(theta) * Math.sin(phi),
  )
}

function Globe({ palette }: { palette: GlobePalette }) {
  const group = useRef<THREE.Group>(null)

  const dots = useMemo(() => {
    const positions: number[] = []
    const radius = 2
    const count = 4000
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count)
      const theta = Math.sqrt(count * Math.PI) * phi
      positions.push(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
      )
    }
    return new Float32Array(positions)
  }, [])

  const cityPoints = useMemo(
    () => CITIES.map((city) => latLonToVec3(city.lat, city.lon, 2.04)),
    [],
  )

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12
  })

  return (
    <group ref={group} rotation={[0.2, -0.3, 0]}>
      <Sphere args={[2.15, 64, 64]}>
        <meshBasicMaterial color={palette.halo} transparent opacity={palette.haloOpacity} side={THREE.BackSide} />
      </Sphere>

      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial color={palette.surface} roughness={0.9} metalness={0.2} />
      </Sphere>

      <Sphere args={[2.005, 32, 16]}>
        <meshBasicMaterial color={palette.wire} wireframe transparent opacity={palette.wireOpacity} />
      </Sphere>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dots, 3]} count={dots.length / 3} />
        </bufferGeometry>
        <pointsMaterial color={palette.points} size={0.018} sizeAttenuation transparent opacity={palette.pointsOpacity} />
      </points>

      {cityPoints.map((point, index) => (
        <group key={index} position={point}>
          <mesh>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color={palette.city} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshBasicMaterial color={palette.city} transparent opacity={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function AfricaGlobe() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'
  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={palette.ambientIntensity} />
          <directionalLight position={[5, 3, 5]} intensity={palette.keyIntensity} color={palette.keyLight} />
          <directionalLight position={[-5, -2, -3]} intensity={palette.rimIntensity} color={palette.rimLight} />
          {isDark && <Stars radius={50} depth={20} count={1500} factor={2} fade speed={0.5} />}
          <Globe palette={palette} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} rotateSpeed={0.4} />
        </Suspense>
      </Canvas>
    </div>
  )
}
