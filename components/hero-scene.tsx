"use client"

import { MutableRefObject, useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

const COLS = 6
const ROWS = 4
const DEPTH = 5
const SPACING_X = 2.6
const SPACING_Y = 1.9
const SPACING_Z = 3.4

type ScrollRef = MutableRefObject<number>

type DiamondItem = { x: number; y: number; z: number; seed: number; depthNorm: number }

// Geometria estática: gerada uma única vez em nível de módulo (não durante o
// render) para não violar a regra de pureza dos hooks com Math.random().
function createDiamondItems(): DiamondItem[] {
  const arr: DiamondItem[] = []
  for (let z = 0; z < DEPTH; z++) {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        arr.push({
          x: (x - (COLS - 1) / 2) * SPACING_X + (Math.random() - 0.5) * 0.4,
          y: (y - (ROWS - 1) / 2) * SPACING_Y + (Math.random() - 0.5) * 0.3,
          z: -z * SPACING_Z,
          seed: Math.random(),
          depthNorm: z / (DEPTH - 1),
        })
      }
    }
  }
  return arr
}

const DIAMOND_ITEMS = createDiamondItems()

function DiamondField({ scrollRef }: { scrollRef: ScrollRef }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tmpColor = useMemo(() => new THREE.Color(), [])
  const items = DIAMOND_ITEMS

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    items.forEach((item, i) => {
      tmpColor.set(item.seed > 0.72 ? "#f5a623" : "#f26522")
      mesh.setColorAt(i, tmpColor)
    })
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [items, tmpColor])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = state.clock.getElapsedTime()
    const progress = scrollRef.current

    items.forEach((item, i) => {
      const ignite = THREE.MathUtils.clamp((progress * 1.5 - item.depthNorm) * 3.2, 0, 1)
      const pulse = 1 + Math.sin(t * 1.4 + item.seed * 8) * 0.06
      const scale = THREE.MathUtils.lerp(0.02, 0.17, ignite) * pulse
      dummy.position.set(item.x, item.y, item.z)
      dummy.rotation.set(Math.PI / 4, Math.PI / 4, item.seed * Math.PI)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true

    state.camera.position.z = 9 - progress * 8
    state.camera.position.x = Math.sin(t * 0.12) * 0.2
    state.camera.position.y = Math.sin(t * 0.16) * 0.12
    state.camera.lookAt(0, 0, -DEPTH * SPACING_Z * 0.5)
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, items.length]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial toneMapped={false} vertexColors />
    </instancedMesh>
  )
}

function createDustPositions(): Float32Array {
  const n = 140
  const arr = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 22
    arr[i * 3 + 1] = (Math.random() - 0.5) * 10
    arr[i * 3 + 2] = -Math.random() * DEPTH * SPACING_Z
  }
  return arr
}

const DUST_POSITIONS = createDustPositions()

function Dust() {
  const ref = useRef<THREE.Points>(null)
  const positions = DUST_POSITIONS

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 0.008
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#f5a623" transparent opacity={0.3} sizeAttenuation />
    </points>
  )
}

export function HeroScene({ scrollRef }: { scrollRef: ScrollRef }) {
  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
      {/* sem <color attach="background">: o canvas fica transparente para a foto real aparecer atrás */}
      <fog attach="fog" args={["#0a0a0a", 5, 20]} />
      <DiamondField scrollRef={scrollRef} />
      <Dust />
    </Canvas>
  )
}
