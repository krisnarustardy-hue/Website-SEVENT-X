import { useRef, useState, useMemo } from 'react'
import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const animGradasi = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

function BukuInteraktif() {
  const [hovered, setHovered] = useState(false)

  const bookGroupRef = useRef()
  const coverRef = useRef()
  const pageRefs = useRef([])
  const glowRef = useRef()

  // Geometri kertas melengkung alami
  const curvedPageGeo = useMemo(() => {
    const geo = new THREE.BoxGeometry(1.82, 2.46, 0.008, 24, 1, 1)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const progress = (x + 0.91) / 1.82
      const arch = Math.sin(progress * Math.PI) * 0.08
      pos.setZ(i, pos.getZ(i) + arch)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  // Sudut & kecepatan buka tiap lembar halaman
  const pageConfigs = [
    { targetAngle: -2.1, speed: 0.085, z: 0.09 },
    { targetAngle: -1.75, speed: 0.072, z: 0.07 },
    { targetAngle: -1.35, speed: 0.06, z: 0.05 },
    { targetAngle: -0.9, speed: 0.048, z: 0.03 },
    { targetAngle: -0.45, speed: 0.038, z: 0.01 },
  ]

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (bookGroupRef.current) {
      // 1. ANIMASI IDLE MURNI ATAS-BAWAH
      // Angka 2 = kecepatan naik-turun, 0.14 = tinggi ayunannya
      bookGroupRef.current.position.y = Math.sin(t * 2) * 0.14

      // 2. Kemiringan & skala halus saat di-hover
      const targetRotY = hovered ? -0.15 : -0.45
      const targetRotX = hovered ? 0.32 : 0.22
      const targetScale = hovered ? 1.06 : 1.0

      bookGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        bookGroupRef.current.rotation.y,
        targetRotY,
        0.06
      )
      bookGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        bookGroupRef.current.rotation.x,
        targetRotX,
        0.06
      )
      bookGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(bookGroupRef.current.scale.x, targetScale, 0.06)
      )
    }

    // 3. Sampul depan terbuka saat hover
    if (coverRef.current) {
      const targetCover = hovered ? -2.35 : 0
      coverRef.current.rotation.y = THREE.MathUtils.lerp(
        coverRef.current.rotation.y,
        targetCover,
        0.075
      )
    }

    // 4. Lembaran kertas terbuka susul-menyusul
    pageRefs.current.forEach((page, i) => {
      if (!page) return
      const cfg = pageConfigs[i]
      const target = hovered ? cfg.targetAngle : 0
      page.rotation.y = THREE.MathUtils.lerp(
        page.rotation.y,
        target,
        cfg.speed
      )
    })

    // 5. Cahaya hangat dari dalam buku saat terbuka
    if (glowRef.current) {
      const targetGlow = hovered ? 2.5 : 0
      glowRef.current.intensity = THREE.MathUtils.lerp(
        glowRef.current.intensity,
        targetGlow,
        0.07
      )
    }
  })

  return (
    <group
      ref={bookGroupRef}
      rotation={[0.22, -0.45, 0.12]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Cahaya Hangat dari Dalam Halaman */}
      <pointLight
        ref={glowRef}
        position={[0.1, 0, 0.4]}
        intensity={0}
        distance={4}
        color="#FBD38D"
      />

      {/* SAMPUL BELAKANG */}
      <RoundedBox
        args={[1.92, 2.6, 0.07]}
        radius={0.03}
        smoothness={4}
        position={[0, 0, -0.18]}
      >
        <meshStandardMaterial
          color="#134E4A"
          roughness={0.45}
          metalness={0.15}
        />
      </RoundedBox>

      {/* TULANG PUNGGUNG BUKU */}
      <RoundedBox
        args={[0.14, 2.62, 0.42]}
        radius={0.05}
        smoothness={4}
        position={[-0.95, 0, -0.01]}
      >
        <meshStandardMaterial
          color="#0F3D3A"
          roughness={0.4}
          metalness={0.2}
        />
      </RoundedBox>

      {/* PITA PEMBATAS BUKU */}
      <mesh position={[0.35, -1.42, -0.05]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.14, 0.45, 0.015]} />
        <meshStandardMaterial color="#D69E2E" roughness={0.5} />
      </mesh>

      {/* BLOK HALAMAN DASAR */}
      <RoundedBox
        args={[1.82, 2.46, 0.22]}
        radius={0.02}
        smoothness={3}
        position={[-0.02, 0, -0.04]}
      >
        <meshStandardMaterial color="#F7F1E1" roughness={0.85} />
      </RoundedBox>

      {/* 5 LEMBAR KERTAS MELENGKUNG */}
      {pageConfigs.map((cfg, idx) => (
        <group
          key={idx}
          ref={(el) => (pageRefs.current[idx] = el)}
          position={[-0.91, 0, cfg.z]}
        >
          <mesh geometry={curvedPageGeo} position={[0.91, 0, 0]}>
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#FFFDF7' : '#F5EEDB'}
              roughness={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* SAMPUL DEPAN */}
      <group ref={coverRef} position={[-0.93, 0, 0.14]}>
        <RoundedBox
          args={[1.92, 2.6, 0.07]}
          radius={0.03}
          smoothness={4}
          position={[0.93, 0, 0]}
        >
          <meshStandardMaterial
            color="#1D6F6A"
            roughness={0.4}
            metalness={0.2}
          />
        </RoundedBox>

        {/* ORNAMEN BINGKAI EMAS */}
        <mesh position={[0.95, 0, 0.038]}>
          <ringGeometry args={[0.42, 0.47, 48]} />
          <meshStandardMaterial
            color="#ECC94B"
            metalness={0.75}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[0.95, 0.78, 0.038]}>
          <boxGeometry args={[1.1, 0.04, 0.01]} />
          <meshStandardMaterial
            color="#ECC94B"
            metalness={0.75}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[0.95, -0.78, 0.038]}>
          <boxGeometry args={[1.1, 0.04, 0.01]} />
          <meshStandardMaterial
            color="#ECC94B"
            metalness={0.75}
            roughness={0.25}
          />
        </mesh>
      </group>
    </group>
  )
}

function App() {
  const bgHalaman = useColorModeValue(
    'radial(circle at top left, blue.900, green.800, gray.900)',
    'radial(circle at top left, blue.900, green.800, gray.900)'
  )

  return (
    <Box
      minH="100vh"
      w="100%"
      bgGradient={bgHalaman}
      bgSize="300% 300%"
      animation={`${animGradasi} 8s ease infinite`}
      pos="relative"
      overflow="hidden"
    >
      {/* NAVBAR */}
      <Box
        as="nav"
        pos="fixed"
        top={0}
        left={0}
        w="100%"
        h="64px"
        zIndex={100}
        bg="whiteAlpha.200"
        backdropFilter="blur(16px)"
        borderBottom="1px solid"
        borderColor="whiteAlpha.300"
        px={{ base: 4, md: 8 }}
        fontFamily="'IBM Plex Sans', sans-serif"
      >
        <Flex
          maxW="1200px"
          h="100%"
          mx="auto"
          justify="flex-start"
          align="center"
        >
          <HStack
            spacing={2}
            fontSize="md"
            fontWeight="semibold"
            color="white"
            transition="0.2s"
          >
            <Text
              px={4}
              py={1.5}
              borderRadius="full"
              color="white"
              transition="all 0.2s ease"
              _hover={{
                bg: 'whiteAlpha.300',
                color: 'teal.100',
                cursor: 'pointer',
              }}
            >
              Beranda
            </Text>
            <Text
              px={4}
              py={1.5}
              borderRadius="full"
              color="white"
              transition="all 0.2s ease"
              _hover={{
                bg: 'whiteAlpha.300',
                color: 'teal.100',
                cursor: 'pointer',
              }}
            >
              Feature
            </Text>
            <Text
              px={4}
              py={1.5}
              borderRadius="full"
              color="white"
              transition="all 0.2s ease"
              _hover={{
                bg: 'whiteAlpha.300',
                color: 'teal.100',
                cursor: 'pointer',
              }}
            >
              About
            </Text>
          </HStack>
        </Flex>
      </Box>

      {/* WADAH PANGGUNG 3D BUKU */}
      <Box
        pos="absolute"
        right={{ base: '-10px', lg: '40px' }}
        top="50%"
        transform="translateY(-50%)"
        w={{ base: '380px', lg: '540px', xl: '640px' }}
        h={{ base: '420px', lg: '580px', xl: '680px' }}
      >
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true }}
          camera={{ position: [0, 0, 5.2], fov: 42 }}
        >
          <ambientLight intensity={0.65} />
          <directionalLight position={[4, 6, 5]} intensity={1.6} />
          <directionalLight
            position={[-5, 2, -3]}
            intensity={1.8}
            color="#4FD1C5"
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.05}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.6}
          />

          <BukuInteraktif />
        </Canvas>
      </Box>
    </Box>
  )
}

export default App