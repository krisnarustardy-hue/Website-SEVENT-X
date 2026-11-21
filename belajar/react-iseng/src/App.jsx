import { useState } from 'react'
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'

const TOP_MENUS = ['Beranda', 'Fitur', 'Tentang']

const NAV_DESTINATIONS = [
  {
    id: 'Beranda',
    label: 'Beranda',
    desc: 'Halaman utama & ringkasan proyek',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
      </svg>
    ),
  },
  {
    id: 'Dashboard',
    label: 'Dashboard',
    desc: 'Panel kontrol, metrik & aktivitas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'Fitur',
    label: 'Fitur Unggulan',
    desc: 'Eksplorasi modul & kemampuan utama',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: 'Analitik',
    label: 'Analitik & Laporan',
    desc: 'Grafik performa & data real-time',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'Tentang',
    label: 'Tentang Tim',
    desc: 'Profil pembuat & informasi karya',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
]

function App() {
  const [activePage, setActivePage] = useState('Beranda')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const { colorMode, toggleColorMode } = useColorMode()

  // Mode terang memakai tone warm paper agar tidak silau
  const bgMain = useColorModeValue('#F3F2EE', '#0F172A')
  const textMain = useColorModeValue('#1E293B', '#F8FAFC')
  const surfaceBg = useColorModeValue('#FAF9F6', '#1E293B')
  const borderSubtle = useColorModeValue('#E2E0D8', '#334155')
  const elevatedShadow = useColorModeValue(
    '0 10px 28px rgba(30, 41, 59, 0.08)',
    '0 14px 32px rgba(2, 6, 23, 0.7)'
  )
  const pillActiveBg = useColorModeValue('#E8E6DF', 'whiteAlpha.100')
  const textMuted = useColorModeValue('#646873', '#94A3B8')
  const btnBg = useColorModeValue('#1E293B', '#F8FAFC')
  const btnColor = useColorModeValue('#FAF9F6', '#0F172A')
  const btnHoverBg = useColorModeValue('#334155', '#E2E8F0')
  const iconBoxBg = useColorModeValue('#EFECE6', 'rgba(255, 255, 255, 0.06)')

  const openMenu = () => {
    setIsClosing(false)
    setIsDrawerOpen(true)
  }

  const closeMenu = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsDrawerOpen(false)
      setIsClosing(false)
    }, 220)
  }

  const toggleMenu = () => {
    if (isDrawerOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  const handleSelectDestination = (pageId) => {
    setActivePage(pageId)
    closeMenu()
  }

  return (
    <Flex
      direction="column"
      minH="100vh"
      w="100%"
      bg={bgMain}
      color={textMain}
      fontFamily="'Inter', sans-serif"
      transition="background-color 0.3s ease, color 0.3s ease"
    >
      <style>{`
        @keyframes dropUnblur {
          from {
            opacity: 0;
            transform: translateY(-18px) scale(0.96);
            filter: blur(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes contentReveal {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes iconSwitch {
          from {
            opacity: 0;
            transform: rotate(-90deg) scale(0.4);
          }
          to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes menuPopIn {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.94);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes menuPopOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
        }

        @keyframes itemSlideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes backdropFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes pageFadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Tombol Navigasi Cepat di Pojok Kiri Atas */}
      <Box
        as="button"
        onClick={toggleMenu}
        aria-label="Buka menu navigasi"
        pos="fixed"
        top={4}
        left={{ base: 4, md: 6 }}
        zIndex={120}
        w="54px"
        h="54px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={surfaceBg}
        color={textMain}
        borderRadius="2xl"
        border="1px solid"
        borderColor={borderSubtle}
        boxShadow={elevatedShadow}
        cursor="pointer"
        userSelect="none"
        animation="dropUnblur 0.65s cubic-bezier(0.16, 1, 0.3, 1) both"
        transition="background-color 0.3s ease, border-color 0.3s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
        _hover={{ transform: 'scale(1.05)' }}
        _active={{ transform: 'scale(0.92)' }}
      >
        <Box
          as="span"
          key={isDrawerOpen ? 'close' : 'open'}
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          animation="iconSwitch 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both"
        >
          {isDrawerOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="15" y2="12" />
              <line x1="4" y1="17" x2="18" y2="17" />
            </svg>
          )}
        </Box>
      </Box>

      {/* Backdrop & Panel Navigasi Melayang */}
      {isDrawerOpen && (
        <>
          <Box
            pos="fixed"
            inset={0}
            zIndex={105}
            bg="blackAlpha.400"
            backdropFilter="blur(2px)"
            onClick={closeMenu}
            animation={`${isClosing ? 'backdropFadeOut' : 'backdropFadeIn'} 0.22s ease forwards`}
          />

          <Box
            pos="fixed"
            top="82px"
            left={{ base: 4, md: 6 }}
            zIndex={115}
            w={{ base: 'calc(100vw - 32px)', sm: '300px' }}
            p={3}
            bg={surfaceBg}
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderSubtle}
            boxShadow={elevatedShadow}
            transformOrigin="top left"
            animation={`${
              isClosing
                ? 'menuPopOut 0.22s cubic-bezier(0.4, 0, 1, 1) forwards'
                : 'menuPopIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both'
            }`}
          >
            <Text
              px={3}
              pt={1}
              pb={2}
              fontSize="11px"
              fontWeight="bold"
              letterSpacing="wider"
              textTransform="uppercase"
              color={textMuted}
            >
              Navigasi Halaman
            </Text>

            <VStack spacing={1} align="stretch">
              {NAV_DESTINATIONS.map((dest, idx) => {
                const isSelected = activePage === dest.id
                return (
                  <Flex
                    key={dest.id}
                    onClick={() => handleSelectDestination(dest.id)}
                    align="center"
                    justify="space-between"
                    p={2.5}
                    borderRadius="xl"
                    bg={isSelected ? pillActiveBg : 'transparent'}
                    cursor="pointer"
                    userSelect="none"
                    animation={`itemSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${0.04 * (idx + 1)}s both`}
                    transition="all 0.2s ease"
                    _hover={{ bg: pillActiveBg, transform: 'translateX(3px)' }}
                    _active={{ transform: 'scale(0.98)' }}
                  >
                    <HStack spacing={3}>
                      <Flex
                        w="36px"
                        h="36px"
                        align="center"
                        justify="center"
                        borderRadius="lg"
                        bg={isSelected ? btnBg : iconBoxBg}
                        color={isSelected ? btnColor : textMain}
                        transition="all 0.2s ease"
                      >
                        {dest.icon}
                      </Flex>
                      <Box>
                        <Text
                          fontFamily="'Figtree', sans-serif"
                          fontSize="sm"
                          fontWeight="bold"
                          lineHeight="short"
                        >
                          {dest.label}
                        </Text>
                        <Text fontSize="xs" color={textMuted} lineHeight="short" mt={0.5}>
                          {dest.desc}
                        </Text>
                      </Box>
                    </HStack>

                    {isSelected && (
                      <Box w="6px" h="6px" borderRadius="full" bg={textMain} mr={1} />
                    )}
                  </Flex>
                )
              })}
            </VStack>
          </Box>
        </>
      )}

      {/* Navbar Kapsul Tengah */}
      <Box
        as="nav"
        pos="fixed"
        top={0}
        left={0}
        w="100%"
        zIndex={100}
        pt={4}
        pr={4}
        pl={{ base: '80px', lg: 4 }}
      >
        <Flex
          maxW="680px"
          h="54px"
          mx="auto"
          px={5}
          align="center"
          justify="space-between"
          bg={surfaceBg}
          borderRadius="full"
          border="1px solid"
          borderColor={borderSubtle}
          boxShadow={elevatedShadow}
          animation="dropUnblur 0.65s cubic-bezier(0.16, 1, 0.3, 1) both"
          transition="background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease"
        >
          <Text
            onClick={() => setActivePage('Beranda')}
            fontFamily="'Figtree', sans-serif"
            fontWeight="extrabold"
            fontSize="sm"
            letterSpacing="wide"
            pl={1}
            cursor="pointer"
            animation="contentReveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both"
          >
            PROYEK.ID
          </Text>

          <HStack
            spacing={1}
            display={{ base: 'none', sm: 'flex' }}
            animation="contentReveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both"
          >
            {TOP_MENUS.map((item) => {
              const isActive = activePage === item
              return (
                <Text
                  key={item}
                  onClick={() => setActivePage(item)}
                  px={3.5}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="medium"
                  color={isActive ? textMain : textMuted}
                  bg={isActive ? pillActiveBg : 'transparent'}
                  cursor="pointer"
                  userSelect="none"
                  transition="all 0.2s"
                  _hover={{ bg: pillActiveBg, color: textMain }}
                  _active={{ transform: 'scale(0.95)' }}
                >
                  {item}
                </Text>
              )
            })}
          </HStack>

          <HStack
            spacing={2}
            animation="contentReveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.28s both"
          >
            <Box
              as="button"
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
              w="32px"
              h="32px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="full"
              bg={pillActiveBg}
              fontSize="sm"
              cursor="pointer"
              userSelect="none"
              transition="transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease"
              _hover={{ transform: 'scale(1.08)' }}
              _active={{ transform: 'scale(0.86)' }}
            >
              <Box
                as="span"
                key={colorMode}
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                animation="iconSwitch 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both"
              >
                {colorMode === 'dark' ? '☀️' : '🌙'}
              </Box>
            </Box>

            <Box
              as="button"
              onClick={() => setActivePage('Dashboard')}
              px={4}
              py={1.5}
              borderRadius="full"
              bg={btnBg}
              color={btnColor}
              fontSize="xs"
              fontWeight="bold"
              cursor="pointer"
              userSelect="none"
              transition="all 0.2s"
              _hover={{ bg: btnHoverBg, transform: 'scale(1.03)' }}
              _active={{ transform: 'scale(0.95)' }}
            >
              {activePage === 'Dashboard' ? 'Di Dashboard' : 'Mulai'}
            </Box>
          </HStack>
        </Flex>
      </Box>

      {/* Area Konten Utama */}
      <Flex
        as="main"
        flex="1"
        direction="column"
        align="center"
        justify="center"
        pt="120px"
        pb="64px"
        px={6}
      >
        <VStack
          key={activePage}
          spacing={3}
          textAlign="center"
          maxW="560px"
          animation="pageFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both"
        >
          <Box
            px={3}
            py={1}
            borderRadius="full"
            bg={pillActiveBg}
            border="1px solid"
            borderColor={borderSubtle}
            fontSize="xs"
            fontWeight="semibold"
            color={textMuted}
          >
            Halaman Aktif: {activePage}
          </Box>
          <Text
            fontFamily="'Figtree', sans-serif"
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight="extrabold"
            letterSpacing="tight"
          >
            {activePage === 'Dashboard'
              ? 'Selamat Datang di Dashboard'
              : `Halaman ${activePage}`}
          </Text>
          <Text fontSize="sm" color={textMuted}>
            Klik tombol navigasi di pojok kiri atas untuk berpindah ke Dashboard atau halaman lainnya.
          </Text>
        </VStack>
      </Flex>

      {/* Footer Adaptif Mode Gelap & Terang */}
      <Box
        as="footer"
        w="100%"
        bg={surfaceBg}
        borderTop="1px solid"
        borderColor={borderSubtle}
        py={5}
        px={6}
        transition="background-color 0.3s ease, border-color 0.3s ease"
      >
        <Flex
          maxW="960px"
          mx="auto"
          direction={{ base: 'column', sm: 'row' }}
          align="center"
          justify="space-between"
          gap={2}
          fontSize="xs"
          color={textMuted}
        >
          <Text
            fontFamily="'Figtree', sans-serif"
            fontWeight="bold"
            color={textMain}
            letterSpacing="wide"
          >
            PROYEK.ID
          </Text>

          <Text fontWeight="medium" textAlign="center">
            Karya{' '}
            <Box as="span" fontWeight="bold" color={textMain}>
              Krisna, Nico, dan Yehez
            </Box>
          </Text>

          <Text>© 2026 Hak Cipta Dilindungi</Text>
        </Flex>
      </Box>
    </Flex>
  )
}

export default App