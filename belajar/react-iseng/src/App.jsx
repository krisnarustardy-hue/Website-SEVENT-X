import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Box,
  Flex,
  HStack,
  VStack,
  SimpleGrid,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import Card from './card'

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

// Data awal simulasi lokal untuk Dashboard Siklus Residu
const INITIAL_RESIDUE_LOGS = [
  {
    id: 'SR-101',
    date: '14 Mei 2026, 08:30',
    source: 'Pos Kumpul Sektor Utara',
    category: 'Organik Basah',
    volume: 42,
    unit: 'kg',
    stage: 'Pengolahan',
    period: '7H',
  },
  {
    id: 'SR-102',
    date: '14 Mei 2026, 09:45',
    source: 'Unit Dapur Komunal A',
    category: 'Minyak Residu',
    volume: 18,
    unit: 'kg',
    stage: 'Pemilahan',
    period: '7H',
  },
  {
    id: 'SR-103',
    date: '13 Mei 2026, 16:15',
    source: 'Sentra Olahan Pangan',
    category: 'Ampas Organik',
    volume: 64,
    unit: 'kg',
    stage: 'Pengolahan',
    period: '7H',
  },
  {
    id: 'SR-104',
    date: '13 Mei 2026, 11:20',
    source: 'Pos Kumpul Sektor Timur',
    category: 'Serat & Kemasan',
    volume: 15,
    unit: 'kg',
    stage: 'Residu Akhir',
    period: '7H',
  },
  {
    id: 'SR-105',
    date: '12 Mei 2026, 14:10',
    source: 'Warung Warga Blok C',
    category: 'Minyak Residu',
    volume: 24,
    unit: 'kg',
    stage: 'Pengumpulan',
    period: '30H',
  },
  {
    id: 'SR-106',
    date: '10 Mei 2026, 10:05',
    source: 'Kedai Kopi & Roti',
    category: 'Ampas Organik',
    volume: 38,
    unit: 'kg',
    stage: 'Residu Masuk',
    period: '30H',
  },
]

const WEEKLY_TREND_SIMULATION = [
  { label: 'Sen', masuk: 34, dimanfaatkan: 26 },
  { label: 'Sel', masuk: 48, dimanfaatkan: 38 },
  { label: 'Rab', masuk: 41, dimanfaatkan: 33 },
  { label: 'Kam', masuk: 56, dimanfaatkan: 45 },
  { label: 'Jum', masuk: 62, dimanfaatkan: 52 },
  { label: 'Sab', masuk: 74, dimanfaatkan: 61 },
  { label: 'Min', masuk: 52, dimanfaatkan: 44 },
]

// Komponen angka Count-Up satu kali saat mount / perubahan nilai target
function AnimatedNumber({ value, duration = 650 }) {
  const [displayValue, setDisplayValue] = useState(value)
  const previousValueRef = useRef(0)

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setDisplayValue(value)
      previousValueRef.current = value
      return
    }

    const startValue = previousValueRef.current
    const diff = value - startValue
    if (diff === 0) return

    let animationFrameId
    const startTime = performance.now()

    const step = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startValue + diff * eased)
      setDisplayValue(current)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        previousValueRef.current = value
      }
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [value, duration])

  return <>{displayValue.toLocaleString('id-ID')}</>
}

function App() {
  const [activePage, setActivePage] = useState('Beranda')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isThemeWashing, setIsThemeWashing] = useState(false)

  // State operasional simulasi untuk Dashboard Siklus Residu
  const [residueLogs, setResidueLogs] = useState(INITIAL_RESIDUE_LOGS)
  const [periodFilter, setPeriodFilter] = useState('SEMUA')
  const [stageFilter, setStageFilter] = useState('SEMUA')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [newSource, setNewSource] = useState('')
  const [newCategory, setNewCategory] = useState('Organik Basah')
  const [newVolume, setNewVolume] = useState('')
  const [newStage, setNewStage] = useState('Residu Masuk')
  const [formNotice, setFormNotice] = useState('')

  const drawerTimerRef = useRef(null)
  const themeWashTimerRef = useRef(null)
  const noticeTimerRef = useRef(null)

  const { colorMode, toggleColorMode } = useColorMode()

  // Pembersihan timer saat komponen unmount
  useEffect(() => {
    return () => {
      if (drawerTimerRef.current) clearTimeout(drawerTimerRef.current)
      if (themeWashTimerRef.current) clearTimeout(themeWashTimerRef.current)
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)
    }
  }, [])

  // Sistem Palet Fresh Botanical (Light) & Deep Forest Green (Dark)
  const bgMain = useColorModeValue('#E2EFDF', '#101D15')
  const surfaceBg = useColorModeValue('#EAF4E7', '#17281D')
  const surfaceSecondary = useColorModeValue('#D1E5CD', '#243B2A')
  const cardMainBg = useColorModeValue('#D8EAD4', '#1D3324')
  const borderSubtle = useColorModeValue('#B5D0B2', '#36533C')
  const borderStrong = useColorModeValue('#8EB68A', '#4A7253')
  const textMain = useColorModeValue('#193B28', '#EAF3E7')
  const textMuted = useColorModeValue('#4E6D54', '#A9BDA8')
  const pillActiveBg = useColorModeValue('#C5DFC1', '#2B4931')
  const highlightSoft = useColorModeValue('#A9CFA3', '#34583B')
  const btnBg = useColorModeValue('#397A46', '#91C887')
  const btnColor = useColorModeValue('#F4FAF2', '#101D15')
  const btnHoverBg = useColorModeValue('#2E663A', '#A3D49A')
  const iconBoxBg = useColorModeValue('#D1E5CD', '#243B2A')
  const accentColor = useColorModeValue('#397A46', '#91C887')
  const inputBg = useColorModeValue('#F1F8EF', '#132218')

  const elevatedShadow = useColorModeValue(
    '0 8px 24px rgba(25, 59, 40, 0.08), 0 2px 6px rgba(25, 59, 40, 0.04)',
    '0 12px 28px rgba(5, 11, 8, 0.65), 0 2px 8px rgba(5, 11, 8, 0.45)'
  )

  const openMenu = () => {
    if (drawerTimerRef.current) clearTimeout(drawerTimerRef.current)
    setIsClosing(false)
    setIsDrawerOpen(true)
  }

  const closeMenu = () => {
    if (drawerTimerRef.current) clearTimeout(drawerTimerRef.current)
    setIsClosing(true)
    drawerTimerRef.current = setTimeout(() => {
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
    if (isDrawerOpen) {
      closeMenu()
    }
  }

  const handleThemeSwitch = () => {
    if (themeWashTimerRef.current) clearTimeout(themeWashTimerRef.current)
    setIsThemeWashing(true)
    toggleColorMode()
    themeWashTimerRef.current = setTimeout(() => {
      setIsThemeWashing(false)
    }, 520)
  }

  // Kalkulasi metrik Dashboard Siklus Residu berdasarkan filter periode
  const filteredByPeriod = useMemo(() => {
    if (periodFilter === '7H') {
      return residueLogs.filter((item) => item.period === '7H')
    }
    return residueLogs
  }, [residueLogs, periodFilter])

  const filteredActivities = useMemo(() => {
    if (stageFilter === 'SEMUA') return filteredByPeriod
    return filteredByPeriod.filter((item) => item.stage === stageFilter)
  }, [filteredByPeriod, stageFilter])

  const kpiMetrics = useMemo(() => {
    let totalMasuk = 0
    let sedangDiproses = 0
    let dimanfaatkan = 0
    let residuAkhir = 0

    filteredByPeriod.forEach((item) => {
      totalMasuk += item.volume
      if (
        item.stage === 'Residu Masuk' ||
        item.stage === 'Pengumpulan' ||
        item.stage === 'Pemilahan'
      ) {
        sedangDiproses += item.volume
      } else if (item.stage === 'Pengolahan') {
        dimanfaatkan += item.volume
      } else if (item.stage === 'Residu Akhir') {
        residuAkhir += item.volume
      }
    })

    return {
      totalMasuk,
      sedangDiproses,
      dimanfaatkan,
      residuAkhir,
    }
  }, [filteredByPeriod])

  // Tahapan perjalanan Siklus Residu (5 Tahap)
  const lifecycleStages = useMemo(() => {
    const stageCounts = {
      'Residu Masuk': { volume: 0, count: 0 },
      Pengumpulan: { volume: 0, count: 0 },
      Pemilahan: { volume: 0, count: 0 },
      Pengolahan: { volume: 0, count: 0 },
      'Residu Akhir': { volume: 0, count: 0 },
    }

    filteredByPeriod.forEach((item) => {
      if (stageCounts[item.stage]) {
        stageCounts[item.stage].volume += item.volume
        stageCounts[item.stage].count += 1
      }
    })

    const total = Math.max(kpiMetrics.totalMasuk, 1)

    return [
      {
        id: 'Residu Masuk',
        step: '01',
        title: 'Residu Masuk',
        desc: 'Pencatatan sumber & penerimaan awal',
        volume: stageCounts['Residu Masuk'].volume,
        count: stageCounts['Residu Masuk'].count,
        ratio: Math.round((stageCounts['Residu Masuk'].volume / total) * 100),
      },
      {
        id: 'Pengumpulan',
        step: '02',
        title: 'Pengumpulan',
        desc: 'Agregasi kolektif dari titik sumber',
        volume: stageCounts['Pengumpulan'].volume,
        count: stageCounts['Pengumpulan'].count,
        ratio: Math.round((stageCounts['Pengumpulan'].volume / total) * 100),
      },
      {
        id: 'Pemilahan',
        step: '03',
        title: 'Pemilahan',
        desc: 'Pemisahan menurut karakteristik bahan',
        volume: stageCounts['Pemilahan'].volume,
        count: stageCounts['Pemilahan'].count,
        ratio: Math.round((stageCounts['Pemilahan'].volume / total) * 100),
      },
      {
        id: 'Pengolahan',
        step: '04',
        title: 'Pengolahan & Pemanfaatan',
        desc: 'Penyaluran untuk diproses kembali',
        volume: stageCounts['Pengolahan'].volume,
        count: stageCounts['Pengolahan'].count,
        ratio: Math.round((stageCounts['Pengolahan'].volume / total) * 100),
      },
      {
        id: 'Residu Akhir',
        step: '05',
        title: 'Residu Akhir',
        desc: 'Sisa akhir yang memerlukan penanganan',
        volume: stageCounts['Residu Akhir'].volume,
        count: stageCounts['Residu Akhir'].count,
        ratio: Math.round((stageCounts['Residu Akhir'].volume / total) * 100),
      },
    ]
  }, [filteredByPeriod, kpiMetrics.totalMasuk])

  // Komposisi berdasarkan kategori
  const categoryBreakdown = useMemo(() => {
    const groups = {}
    filteredByPeriod.forEach((item) => {
      groups[item.category] = (groups[item.category] || 0) + item.volume
    })
    const total = Math.max(kpiMetrics.totalMasuk, 1)
    return Object.entries(groups).map(([name, volume]) => ({
      name,
      volume,
      percentage: Math.round((volume / total) * 100),
    }))
  }, [filteredByPeriod, kpiMetrics.totalMasuk])

  const handleAddSimulatedRecord = (e) => {
    e.preventDefault()
    const cleanSource = newSource.trim()
    const parsedVolume = Number(newVolume)

    if (!cleanSource || !parsedVolume || parsedVolume <= 0) {
      setFormNotice('Mohon isi nama sumber dan volume residu yang valid (> 0 kg).')
      return
    }

    const newEntry = {
      id: `SR-${100 + residueLogs.length + 1}`,
      date: 'Baru saja (Simulasi Lokal)',
      source: cleanSource,
      category: newCategory,
      volume: parsedVolume,
      unit: 'kg',
      stage: newStage,
      period: '7H',
    }

    setResidueLogs((prev) => [newEntry, ...prev])
    setNewSource('')
    setNewVolume('')
    setIsFormOpen(false)
    setFormNotice(`Catatan ${newEntry.id} (${cleanSource} - ${parsedVolume} kg) ditambahkan ke simulasi lokal.`)

    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)
    noticeTimerRef.current = setTimeout(() => {
      setFormNotice('')
    }, 4500)
  }

  return (
    <Flex
      direction="column"
      minH="100vh"
      w="100%"
      pos="relative"
      overflowX="hidden"
      bg={bgMain}
      color={textMain}
      fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      className="botanical-app-shell"
    >
      <style>{`
        .botanical-app-shell,
        .botanical-app-shell nav,
        .botanical-app-shell footer,
        .botanical-app-shell button,
        .botanical-app-shell input,
        .botanical-app-shell select,
        .botanical-app-shell [data-theme-transition="true"] {
          transition:
            background-color 0.48s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.48s cubic-bezier(0.22, 1, 0.36, 1),
            color 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.48s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes dropUnblur {
          from {
            opacity: 0;
            transform: translateY(-14px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
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
            transform: rotate(-75deg) scale(0.55);
          }
          to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes menuPopIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes menuPopOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
        }

        @keyframes itemSlideIn {
          from {
            opacity: 0;
            transform: translateX(-8px);
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

        @keyframes barGrowUp {
          from {
            transform: scaleY(0.15);
            opacity: 0.4;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes progressFillHorizontal {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.12s !important;
          }
        }
      `}</style>

      {/* Lapisan Atmosfer Lembut Saat Pergantian Mode Terang/Gelap */}
      <Box
        pos="fixed"
        inset={0}
        pointerEvents="none"
        zIndex={0}
        opacity={isThemeWashing ? 1 : 0.35}
        bgGradient={
          colorMode === 'light'
            ? 'radial(circle at 50% 0%, rgba(110, 175, 118, 0.28), transparent 70%)'
            : 'radial(circle at 50% 0%, rgba(72, 130, 86, 0.25), transparent 70%)'
        }
        transition="opacity 0.5s ease"
      />

      {/* Tombol Navigasi Cepat di Pojok Kiri Atas */}
      <Box
        as="button"
        type="button"
        onClick={toggleMenu}
        aria-label={isDrawerOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
        aria-expanded={isDrawerOpen}
        pos="fixed"
        top={4}
        left={{ base: 4, md: 6 }}
        zIndex={120}
        w="52px"
        h="52px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={surfaceBg}
        color={textMain}
        borderRadius="xl"
        border="1px solid"
        borderColor={isDrawerOpen ? accentColor : borderSubtle}
        boxShadow={elevatedShadow}
        cursor="pointer"
        userSelect="none"
        animation="dropUnblur 0.55s cubic-bezier(0.22, 1, 0.36, 1) both"
        _hover={{
          bg: pillActiveBg,
          borderColor: borderStrong,
          transform: 'translateY(-1px)',
        }}
        _active={{ transform: 'scale(0.93)' }}
        _focusVisible={{
          outline: '2px solid',
          outlineColor: accentColor,
          outlineOffset: '2px',
        }}
      >
        <Box
          as="span"
          key={isDrawerOpen ? 'close' : 'open'}
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          animation="iconSwitch 0.3s cubic-bezier(0.22, 1, 0.36, 1) both"
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
            data-theme-transition="true"
            pos="fixed"
            top="78px"
            left={{ base: 4, md: 6 }}
            zIndex={115}
            w={{ base: 'calc(100vw - 32px)', sm: '316px' }}
            p={3}
            bg={surfaceBg}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderSubtle}
            boxShadow={elevatedShadow}
            transformOrigin="top left"
            animation={`${
              isClosing
                ? 'menuPopOut 0.22s cubic-bezier(0.4, 0, 1, 1) forwards'
                : 'menuPopIn 0.32s cubic-bezier(0.22, 1, 0.36, 1) both'
            }`}
          >
            <Flex align="center" justify="space-between" px={3} pt={1} pb={2}>
              <Text
                fontSize="11px"
                fontWeight="bold"
                letterSpacing="0.08em"
                textTransform="uppercase"
                color={textMuted}
              >
                Navigasi Halaman
              </Text>
              <Box w="6px" h="6px" borderRadius="full" bg={accentColor} />
            </Flex>

            <VStack spacing={1} align="stretch">
              {NAV_DESTINATIONS.map((dest, idx) => {
                const isSelected = activePage === dest.id
                return (
                  <Flex
                    as="button"
                    type="button"
                    key={dest.id}
                    onClick={() => handleSelectDestination(dest.id)}
                    align="center"
                    justify="space-between"
                    w="100%"
                    textAlign="left"
                    p={2.5}
                    borderRadius="lg"
                    bg={isSelected ? pillActiveBg : 'transparent'}
                    border="1px solid"
                    borderColor={isSelected ? borderStrong : 'transparent'}
                    cursor="pointer"
                    userSelect="none"
                    animation={`itemSlideIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) ${0.035 * (idx + 1)}s both`}
                    _hover={{ bg: pillActiveBg, transform: 'translateX(2px)' }}
                    _active={{ transform: 'scale(0.98)' }}
                    _focusVisible={{
                      outline: '2px solid',
                      outlineColor: accentColor,
                      outlineOffset: '-2px',
                    }}
                  >
                    <HStack spacing={3}>
                      <Flex
                        data-theme-transition="true"
                        w="36px"
                        h="36px"
                        flexShrink={0}
                        align="center"
                        justify="center"
                        borderRadius="md"
                        bg={isSelected ? btnBg : iconBoxBg}
                        color={isSelected ? btnColor : textMain}
                      >
                        {dest.icon}
                      </Flex>
                      <Box>
                        <Text
                          fontFamily="'Figtree', sans-serif"
                          fontSize="sm"
                          fontWeight="bold"
                          color={textMain}
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
                      <Box w="7px" h="7px" borderRadius="full" bg={accentColor} mr={1} />
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
        pl={{ base: '76px', lg: 4 }}
        pointerEvents="none"
      >
        <Flex
          data-theme-transition="true"
          maxW="700px"
          h="52px"
          mx="auto"
          px={{ base: 4, sm: 5 }}
          align="center"
          justify="space-between"
          bg={surfaceBg}
          borderRadius="full"
          border="1px solid"
          borderColor={borderSubtle}
          boxShadow={elevatedShadow}
          pointerEvents="auto"
          animation="dropUnblur 0.55s cubic-bezier(0.22, 1, 0.36, 1) both"
        >
          <HStack
            as="button"
            type="button"
            spacing={2}
            onClick={() => handleSelectDestination('Beranda')}
            pl={1}
            cursor="pointer"
            animation="contentReveal 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both"
            _focusVisible={{
              outline: '2px solid',
              outlineColor: accentColor,
              outlineOffset: '4px',
              borderRadius: 'sm',
            }}
          >
            <Box w="8px" h="8px" borderRadius="full" bg={accentColor} />
            <Text
              fontFamily="'Figtree', sans-serif"
              fontWeight="extrabold"
              fontSize="sm"
              letterSpacing="0.04em"
              color={textMain}
            >
              PROYEK.ID
            </Text>
          </HStack>

          <HStack
            spacing={1}
            display={{ base: 'none', sm: 'flex' }}
            animation="contentReveal 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.16s both"
          >
            {TOP_MENUS.map((item) => {
              const isActive = activePage === item
              return (
                <Box
                  as="button"
                  type="button"
                  key={item}
                  onClick={() => handleSelectDestination(item)}
                  px={3.5}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight={isActive ? 'semibold' : 'medium'}
                  color={isActive ? textMain : textMuted}
                  bg={isActive ? pillActiveBg : 'transparent'}
                  border="1px solid"
                  borderColor={isActive ? borderStrong : 'transparent'}
                  cursor="pointer"
                  userSelect="none"
                  _hover={{ bg: pillActiveBg, color: textMain }}
                  _active={{ transform: 'scale(0.95)' }}
                  _focusVisible={{
                    outline: '2px solid',
                    outlineColor: accentColor,
                    outlineOffset: '1px',
                  }}
                >
                  {item}
                </Box>
              )
            })}
          </HStack>

          <HStack
            spacing={2}
            animation="contentReveal 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.22s both"
          >
            {/* Tombol Toggle Tema dengan Feedback Press & Rotasi Halus */}
            <Box
              as="button"
              type="button"
              onClick={handleThemeSwitch}
              aria-label={
                colorMode === 'dark'
                  ? 'Beralih ke mode terang hijau daun'
                  : 'Beralih ke mode gelap hijau hutan'
              }
              w="34px"
              h="34px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="full"
              bg={pillActiveBg}
              color={textMain}
              border="1px solid"
              borderColor={borderSubtle}
              cursor="pointer"
              userSelect="none"
              _hover={{ borderColor: borderStrong, transform: 'scale(1.06)' }}
              _active={{ transform: 'scale(0.88)' }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: accentColor,
                outlineOffset: '2px',
              }}
            >
              <Box
                as="span"
                key={colorMode}
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                animation="iconSwitch 0.38s cubic-bezier(0.22, 1, 0.36, 1) both"
              >
                {colorMode === 'dark' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </Box>
            </Box>

            <Box
              as="button"
              type="button"
              onClick={() => handleSelectDestination('Dashboard')}
              px={4}
              py={1.5}
              borderRadius="full"
              bg={btnBg}
              color={btnColor}
              fontSize="xs"
              fontWeight="bold"
              cursor="pointer"
              userSelect="none"
              _hover={{ bg: btnHoverBg, transform: 'translateY(-1px)' }}
              _active={{ transform: 'scale(0.95)' }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: accentColor,
                outlineOffset: '2px',
              }}
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
        pos="relative"
        zIndex={1}
        pt={{ base: '96px', md: '112px' }}
        pb={{ base: '48px', md: '64px' }}
        px={{ base: 4, sm: 6 }}
      >
        <Box
          key={activePage}
          w="100%"
          maxW="1120px"
          animation="pageFadeUp 0.34s cubic-bezier(0.22, 1, 0.36, 1) both"
        >
          {/* ============================================================== */}
          {/* 1. HALAMAN DASHBOARD SIKLUS RESIDU (OPERASIONAL PENUH)         */}
          {/* ============================================================== */}
          {activePage === 'Dashboard' && (
            <VStack spacing={6} align="stretch" w="100%">
              {/* Header Dashboard Siklus Residu */}
              <Flex
                data-theme-transition="true"
                direction={{ base: 'column', lg: 'row' }}
                align={{ base: 'flex-start', lg: 'center' }}
                justify="space-between"
                gap={4}
                p={{ base: 5, md: 6 }}
                bg={surfaceBg}
                borderRadius="2xl"
                border="1px solid"
                borderColor={borderSubtle}
                boxShadow={elevatedShadow}
              >
                <Box>
                  <HStack spacing={2.5} mb={2} flexWrap="wrap">
                    <HStack
                      spacing={1.5}
                      px={2.5}
                      py={0.5}
                      borderRadius="md"
                      bg={pillActiveBg}
                      border="1px solid"
                      borderColor={borderSubtle}
                    >
                      <Box w="6px" h="6px" borderRadius="full" bg={accentColor} />
                      <Text fontSize="11px" fontWeight="bold" color={textMain}>
                        Data Simulasi Operasional
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color={textMuted}>
                      Periode Pemantauan: Mei 2026
                    </Text>
                  </HStack>

                  <Text
                    fontFamily="'Figtree', sans-serif"
                    fontSize={{ base: '2xl', md: '3xl' }}
                    fontWeight="extrabold"
                    color={textMain}
                    letterSpacing="-0.02em"
                    lineHeight="1.2"
                  >
                    Dashboard Siklus Residu
                  </Text>
                  <Text fontSize="sm" color={textMuted} mt={1} maxW="640px">
                    Pemantauan alur pengelolaan residu mulai dari pencatatan sumber, pengumpulan, pemilahan, pengolahan, hingga penanganan residu akhir.
                  </Text>
                </Box>

                {/* Kontrol Periode & Tombol Tambah Catatan */}
                <HStack spacing={2.5} flexWrap="wrap">
                  <HStack
                    p={1}
                    bg={surfaceSecondary}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={borderSubtle}
                    spacing={1}
                  >
                    {[
                      { id: 'SEMUA', label: '30 Hari (Simulasi)' },
                      { id: '7H', label: '7 Hari Terakhir' },
                    ].map((tab) => {
                      const active = periodFilter === tab.id
                      return (
                        <Box
                          as="button"
                          type="button"
                          key={tab.id}
                          onClick={() => setPeriodFilter(tab.id)}
                          px={3}
                          py={1.5}
                          borderRadius="md"
                          fontSize="xs"
                          fontWeight={active ? 'bold' : 'medium'}
                          bg={active ? surfaceBg : 'transparent'}
                          color={active ? textMain : textMuted}
                          border="1px solid"
                          borderColor={active ? borderSubtle : 'transparent'}
                          cursor="pointer"
                          _hover={{ color: textMain }}
                          _active={{ transform: 'scale(0.97)' }}
                        >
                          {tab.label}
                        </Box>
                      )
                    })}
                  </HStack>

                  <Box
                    as="button"
                    type="button"
                    onClick={() => setIsFormOpen((prev) => !prev)}
                    px={4}
                    py={2}
                    borderRadius="lg"
                    bg={btnBg}
                    color={btnColor}
                    fontSize="xs"
                    fontWeight="bold"
                    cursor="pointer"
                    display="inline-flex"
                    alignItems="center"
                    gap={1.5}
                    _hover={{ bg: btnHoverBg, transform: 'translateY(-1px)' }}
                    _active={{ transform: 'scale(0.97)' }}
                    _focusVisible={{
                      outline: '2px solid',
                      outlineColor: accentColor,
                      outlineOffset: '2px',
                    }}
                  >
                    <span>{isFormOpen ? 'Tutup Form' : '+ Catat Residu Baru'}</span>
                  </Box>
                </HStack>
              </Flex>

              {/* Notifikasi Feedback Aksi Simulasi */}
              {formNotice && (
                <Flex
                  align="center"
                  justify="space-between"
                  px={4}
                  py={3}
                  bg={pillActiveBg}
                  border="1px solid"
                  borderColor={borderStrong}
                  borderRadius="xl"
                  animation="pageFadeUp 0.25s ease both"
                >
                  <Text fontSize="xs" fontWeight="semibold" color={textMain}>
                    {formNotice}
                  </Text>
                  <Box
                    as="button"
                    type="button"
                    onClick={() => setFormNotice('')}
                    fontSize="xs"
                    fontWeight="bold"
                    color={textMuted}
                    px={2}
                  >
                    Tutup
                  </Box>
                </Flex>
              )}

              {/* Form Pencatatan Residu Baru (Simulasi Lokal Frontend) */}
              {isFormOpen && (
                <Box
                  as="form"
                  onSubmit={handleAddSimulatedRecord}
                  p={5}
                  bg={cardMainBg}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={borderStrong}
                  animation="pageFadeUp 0.28s cubic-bezier(0.22, 1, 0.36, 1) both"
                >
                  <Flex align="center" justify="space-between" mb={3} flexWrap="wrap" gap={2}>
                    <Box>
                      <Text fontFamily="'Figtree', sans-serif" fontWeight="bold" fontSize="md">
                        Tambah Catatan Residu (Mode Demo Lokal)
                      </Text>
                      <Text fontSize="xs" color={textMuted}>
                        Data disimpan di memori browser untuk simulasi perhitungan KPI dan alur Siklus Residu.
                      </Text>
                    </Box>
                  </Flex>

                  <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={3} mb={4}>
                    <Box>
                      <Text fontSize="xs" fontWeight="semibold" mb={1}>
                        Sumber Residu
                      </Text>
                      <Box
                        as="input"
                        type="text"
                        value={newSource}
                        onChange={(e) => setNewSource(e.target.value)}
                        placeholder="Mis. Pos Kumpul RT 04"
                        w="100%"
                        px={3}
                        py={2}
                        fontSize="xs"
                        bg={inputBg}
                        color={textMain}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={borderSubtle}
                      />
                    </Box>

                    <Box>
                      <Text fontSize="xs" fontWeight="semibold" mb={1}>
                        Kategori Residu
                      </Text>
                      <Box
                        as="select"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        w="100%"
                        px={3}
                        py={2}
                        fontSize="xs"
                        bg={inputBg}
                        color={textMain}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={borderSubtle}
                      >
                        <option value="Organik Basah">Organik Basah</option>
                        <option value="Ampas Organik">Ampas Organik</option>
                        <option value="Minyak Residu">Minyak Residu</option>
                        <option value="Serat & Kemasan">Serat & Kemasan</option>
                      </Box>
                    </Box>

                    <Box>
                      <Text fontSize="xs" fontWeight="semibold" mb={1}>
                        Volume (kg)
                      </Text>
                      <Box
                        as="input"
                        type="number"
                        min="1"
                        max="5000"
                        value={newVolume}
                        onChange={(e) => setNewVolume(e.target.value)}
                        placeholder="Mis. 25"
                        w="100%"
                        px={3}
                        py={2}
                        fontSize="xs"
                        bg={inputBg}
                        color={textMain}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={borderSubtle}
                      />
                    </Box>

                    <Box>
                      <Text fontSize="xs" fontWeight="semibold" mb={1}>
                        Tahap Saat Ini
                      </Text>
                      <Box
                        as="select"
                        value={newStage}
                        onChange={(e) => setNewStage(e.target.value)}
                        w="100%"
                        px={3}
                        py={2}
                        fontSize="xs"
                        bg={inputBg}
                        color={textMain}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={borderSubtle}
                      >
                        <option value="Residu Masuk">01 - Residu Masuk</option>
                        <option value="Pengumpulan">02 - Pengumpulan</option>
                        <option value="Pemilahan">03 - Pemilahan</option>
                        <option value="Pengolahan">04 - Pengolahan / Pemanfaatan</option>
                        <option value="Residu Akhir">05 - Residu Akhir</option>
                      </Box>
                    </Box>
                  </SimpleGrid>

                  <HStack justify="flex-end" spacing={2}>
                    <Box
                      as="button"
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      px={3.5}
                      py={1.5}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="semibold"
                      bg={surfaceSecondary}
                      color={textMain}
                    >
                      Batal
                    </Box>
                    <Box
                      as="button"
                      type="submit"
                      px={4}
                      py={1.5}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="bold"
                      bg={btnBg}
                      color={btnColor}
                      _hover={{ bg: btnHoverBg }}
                    >
                      Simpan ke Simulasi
                    </Box>
                  </HStack>
                </Box>
              )}

              {/* 4 KPI Ringkasan Utama dengan Count-Up Animation */}
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
                <Card
                  variant="kpi"
                  title="Total Residu Masuk"
                  metricValue={<AnimatedNumber value={kpiMetrics.totalMasuk} />}
                  metricUnit="kg"
                  metricSubtext={`Dari ${filteredByPeriod.length} catatan sumber (Simulasi)`}
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  }
                />

                <Card
                  variant="kpi"
                  title="Sedang Diproses"
                  metricValue={<AnimatedNumber value={kpiMetrics.sedangDiproses} />}
                  metricUnit="kg"
                  metricSubtext="Tahap masuk, pengumpulan & pemilahan"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                  }
                />

                <Card
                  variant="kpi"
                  title="Berhasil Dimanfaatkan"
                  metricValue={<AnimatedNumber value={kpiMetrics.dimanfaatkan} />}
                  metricUnit="kg"
                  metricSubtext="Disalurkan ke tahap pengolahan lanjutan"
                  isActive={true}
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  }
                />

                <Card
                  variant="kpi"
                  title="Residu Akhir Tersisa"
                  metricValue={<AnimatedNumber value={kpiMetrics.residuAkhir} />}
                  metricUnit="kg"
                  metricSubtext="Sisa yang memerlukan penanganan akhir"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  }
                />
              </SimpleGrid>

              {/* Visualisasi Alur Siklus Residu (5 Tahap) */}
              <Card
                variant="panel"
                title="Alur Perjalanan Siklus Residu"
                description="Pemetaan volume residu pada setiap tahap proses (Data simulasi). Klik salah satu tahap untuk memfilter daftar aktivitas di bawah."
                badge="5 Tahap Proses"
              >
                <SimpleGrid columns={{ base: 1, md: 5 }} spacing={3} mt={2}>
                  {lifecycleStages.map((stg) => {
                    const isStageSelected = stageFilter === stg.id
                    return (
                      <Box
                        as="button"
                        type="button"
                        key={stg.id}
                        onClick={() =>
                          setStageFilter((prev) => (prev === stg.id ? 'SEMUA' : stg.id))
                        }
                        textAlign="left"
                        p={3.5}
                        borderRadius="xl"
                        bg={isStageSelected ? pillActiveBg : surfaceBg}
                        border="1px solid"
                        borderColor={isStageSelected ? accentColor : borderSubtle}
                        cursor="pointer"
                        transition="all 0.2s ease"
                        _hover={{
                          borderColor: borderStrong,
                          transform: 'translateY(-2px)',
                        }}
                        _active={{ transform: 'scale(0.99)' }}
                      >
                        <Flex align="center" justify="space-between" mb={2}>
                          <Text
                            fontSize="11px"
                            fontWeight="extrabold"
                            px={2}
                            py={0.5}
                            borderRadius="md"
                            bg={surfaceSecondary}
                            color={textMain}
                          >
                            Tahap {stg.step}
                          </Text>
                          <Text fontSize="xs" fontWeight="bold" color={accentColor}>
                            {stg.ratio}%
                          </Text>
                        </Flex>

                        <Text
                          fontFamily="'Figtree', sans-serif"
                          fontSize="sm"
                          fontWeight="bold"
                          color={textMain}
                          lineHeight="1.3"
                        >
                          {stg.title}
                        </Text>
                        <Text fontSize="11px" color={textMuted} mt={1} minH="32px">
                          {stg.desc}
                        </Text>

                        <Flex align="baseline" justify="space-between" mt={3} mb={1.5}>
                          <Text fontSize="md" fontWeight="extrabold" color={textMain}>
                            {stg.volume} <Box as="span" fontSize="xs" fontWeight="normal">kg</Box>
                          </Text>
                          <Text fontSize="11px" color={textMuted}>
                            {stg.count} batch
                          </Text>
                        </Flex>

                        <Box
                          w="100%"
                          h="6px"
                          bg={surfaceSecondary}
                          borderRadius="full"
                          overflow="hidden"
                        >
                          <Box
                            h="100%"
                            w={`${Math.max(stg.ratio, 6)}%`}
                            bg={accentColor}
                            borderRadius="full"
                            transformOrigin="left"
                            animation="progressFillHorizontal 0.65s cubic-bezier(0.22, 1, 0.36, 1) both"
                          />
                        </Box>
                      </Box>
                    )
                  })}
                </SimpleGrid>
              </Card>

              {/* Panel Analitik: Grafik Tren Mingguan & Komposisi Kategori */}
              <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={4}>
                <Box gridColumn={{ base: 'span 1', lg: 'span 7' }}>
                  <Card
                    variant="panel"
                    title="Tren Residu Masuk vs Dimanfaatkan"
                    description="Perbandingan harian volume residu yang dicatat dengan yang berhasil diolah (kg - Contoh data simulasi 7 hari)."
                  >
                    <Flex
                      align="flex-end"
                      justify="space-between"
                      h="180px"
                      pt={6}
                      pb={2}
                      px={{ base: 1, sm: 3 }}
                      gap={{ base: 2, sm: 4 }}
                      borderBottom="1px solid"
                      borderColor={borderSubtle}
                    >
                      {WEEKLY_TREND_SIMULATION.map((day, index) => {
                        const maxScale = 80
                        const inHeight = Math.round((day.masuk / maxScale) * 100)
                        const usedHeight = Math.round((day.dimanfaatkan / maxScale) * 100)
                        return (
                          <VStack key={day.label} spacing={2} flex="1" h="100%" justify="flex-end">
                            <HStack spacing={1.5} align="flex-end" h="130px" w="100%" justify="center">
                              <Box
                                title={`Residu Masuk: ${day.masuk} kg`}
                                w={{ base: '10px', sm: '14px' }}
                                h={`${inHeight}%`}
                                bg={highlightSoft}
                                borderRadius="sm"
                                transformOrigin="bottom"
                                animation={`barGrowUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.05}s both`}
                              />
                              <Box
                                title={`Dimanfaatkan: ${day.dimanfaatkan} kg`}
                                w={{ base: '10px', sm: '14px' }}
                                h={`${usedHeight}%`}
                                bg={btnBg}
                                borderRadius="sm"
                                transformOrigin="bottom"
                                animation={`barGrowUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.06}s both`}
                              />
                            </HStack>
                            <Text fontSize="11px" fontWeight="semibold" color={textMuted}>
                              {day.label}
                            </Text>
                          </VStack>
                        )
                      })}
                    </Flex>

                    <HStack justify="space-between" mt={3} flexWrap="wrap" gap={2}>
                      <HStack spacing={4}>
                        <HStack spacing={1.5}>
                          <Box w="10px" h="10px" borderRadius="xs" bg={highlightSoft} />
                          <Text fontSize="xs" color={textMuted}>
                            Residu Masuk (kg)
                          </Text>
                        </HStack>
                        <HStack spacing={1.5}>
                          <Box w="10px" h="10px" borderRadius="xs" bg={btnBg} />
                          <Text fontSize="xs" color={textMuted}>
                            Berhasil Dimanfaatkan (kg)
                          </Text>
                        </HStack>
                      </HStack>
                      <Text fontSize="11px" color={textMuted}>
                        Satuan: Kilogram (kg)
                      </Text>
                    </HStack>
                  </Card>
                </Box>

                <Box gridColumn={{ base: 'span 1', lg: 'span 5' }}>
                  <Card
                    variant="panel"
                    title="Komposisi Kategori Residu"
                    description="Proporsi berat residu berdasarkan karakteristik material pada periode terpilih."
                  >
                    <VStack spacing={3.5} align="stretch" mt={3}>
                      {categoryBreakdown.map((cat) => (
                        <Box key={cat.name}>
                          <Flex justify="space-between" fontSize="xs" mb={1}>
                            <Text fontWeight="bold" color={textMain}>
                              {cat.name}
                            </Text>
                            <Text color={textMuted} fontWeight="semibold">
                              {cat.volume} kg ({cat.percentage}%)
                            </Text>
                          </Flex>
                          <Box
                            w="100%"
                            h="8px"
                            bg={surfaceSecondary}
                            borderRadius="full"
                            overflow="hidden"
                          >
                            <Box
                              h="100%"
                              w={`${Math.max(cat.percentage, 5)}%`}
                              bg={btnBg}
                              borderRadius="full"
                              transformOrigin="left"
                              animation="progressFillHorizontal 0.6s cubic-bezier(0.22, 1, 0.36, 1) both"
                            />
                          </Box>
                        </Box>
                      ))}
                    </VStack>

                    <Box
                      mt={5}
                      p={3}
                      borderRadius="lg"
                      bg={surfaceBg}
                      border="1px solid"
                      borderColor={borderSubtle}
                    >
                      <Text fontSize="xs" color={textMuted} lineHeight="1.5">
                        Total terdata:{' '}
                        <Box as="span" fontWeight="bold" color={textMain}>
                          {kpiMetrics.totalMasuk} kg
                        </Box>{' '}
                        dari {categoryBreakdown.length} kategori material (Data simulasi).
                      </Text>
                    </Box>
                  </Card>
                </Box>
              </SimpleGrid>

              {/* Daftar Aktivitas Residu Terbaru & Aksi Cepat */}
              <Card
                variant="panel"
                title="Catatan Aktivitas Siklus Residu"
                description="Riwayat pencatatan masuk dan status tahapan pemrosesan residu saat ini."
                footer={
                  <Flex align="center" justify="space-between" flexWrap="wrap" gap={2}>
                    <Text fontSize="xs" color={textMuted}>
                      Menampilkan {filteredActivities.length} dari {residueLogs.length} catatan simulasi.
                    </Text>
                    <HStack spacing={3}>
                      <Box
                        as="button"
                        type="button"
                        onClick={() => handleSelectDestination('Analitik')}
                        fontSize="xs"
                        fontWeight="bold"
                        color={accentColor}
                        _hover={{ textDecoration: 'underline' }}
                      >
                        Lihat Ringkasan Analitik →
                      </Box>
                    </HStack>
                  </Flex>
                }
              >
                {/* Bar Filter Status Tahapan */}
                <HStack spacing={1.5} mb={4} flexWrap="wrap">
                  {['SEMUA', 'Residu Masuk', 'Pengumpulan', 'Pemilahan', 'Pengolahan', 'Residu Akhir'].map(
                    (st) => {
                      const active = stageFilter === st
                      return (
                        <Box
                          as="button"
                          type="button"
                          key={st}
                          onClick={() => setStageFilter(st)}
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight={active ? 'bold' : 'medium'}
                          bg={active ? btnBg : surfaceBg}
                          color={active ? btnColor : textMuted}
                          border="1px solid"
                          borderColor={active ? btnBg : borderSubtle}
                          cursor="pointer"
                          _hover={{ borderColor: borderStrong }}
                        >
                          {st === 'SEMUA' ? 'Semua Tahap' : st}
                        </Box>
                      )
                    }
                  )}
                </HStack>

                {filteredActivities.length === 0 ? (
                  <Box
                    p={8}
                    textAlign="center"
                    borderRadius="xl"
                    bg={surfaceBg}
                    border="1px dashed"
                    borderColor={borderSubtle}
                  >
                    <Text fontWeight="bold" fontSize="sm" color={textMain}>
                      Belum ada catatan pada filter tahap ini
                    </Text>
                    <Text fontSize="xs" color={textMuted} mt={1}>
                      Ubah filter tahap di atas atau tambahkan catatan simulasi baru.
                    </Text>
                  </Box>
                ) : (
                  <Box overflowX="auto">
                    <Box as="table" w="100%" style={{ borderCollapse: 'collapse' }}>
                      <Box as="thead">
                        <Box
                          as="tr"
                          borderBottom="1px solid"
                          borderColor={borderSubtle}
                          textAlign="left"
                        >
                          <Box as="th" py={2.5} px={3} fontSize="11px" color={textMuted} textTransform="uppercase">
                            ID & Waktu
                          </Box>
                          <Box as="th" py={2.5} px={3} fontSize="11px" color={textMuted} textTransform="uppercase">
                            Sumber Pencatatan
                          </Box>
                          <Box as="th" py={2.5} px={3} fontSize="11px" color={textMuted} textTransform="uppercase">
                            Kategori
                          </Box>
                          <Box as="th" py={2.5} px={3} fontSize="11px" color={textMuted} textTransform="uppercase">
                            Volume
                          </Box>
                          <Box as="th" py={2.5} px={3} fontSize="11px" color={textMuted} textTransform="uppercase">
                            Tahap Siklus
                          </Box>
                        </Box>
                      </Box>
                      <Box as="tbody">
                        {filteredActivities.map((item) => (
                          <Box
                            as="tr"
                            key={item.id}
                            borderBottom="1px solid"
                            borderColor={borderSubtle}
                            _hover={{ bg: surfaceBg }}
                          >
                            <Box as="td" py={3} px={3}>
                              <Text fontSize="xs" fontWeight="bold" color={textMain}>
                                {item.id}
                              </Text>
                              <Text fontSize="11px" color={textMuted}>
                                {item.date}
                              </Text>
                            </Box>
                            <Box as="td" py={3} px={3}>
                              <Text fontSize="xs" fontWeight="semibold" color={textMain}>
                                {item.source}
                              </Text>
                            </Box>
                            <Box as="td" py={3} px={3}>
                              <Text fontSize="xs" color={textMuted}>
                                {item.category}
                              </Text>
                            </Box>
                            <Box as="td" py={3} px={3}>
                              <Text fontSize="xs" fontWeight="bold" color={textMain}>
                                {item.volume} {item.unit}
                              </Text>
                            </Box>
                            <Box as="td" py={3} px={3}>
                              <Box
                                as="span"
                                display="inline-block"
                                px={2.5}
                                py={0.5}
                                borderRadius="full"
                                fontSize="11px"
                                fontWeight="bold"
                                bg={
                                  item.stage === 'Pengolahan'
                                    ? pillActiveBg
                                    : surfaceSecondary
                                }
                                color={textMain}
                                border="1px solid"
                                borderColor={borderSubtle}
                              >
                                {item.stage}
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Card>
            </VStack>
          )}

          {/* ============================================================== */}
          {/* 2. HALAMAN BERANDA                                             */}
          {/* ============================================================== */}
          {activePage === 'Beranda' && (
            <VStack spacing={7} w="100%" maxW="940px" mx="auto">
              <VStack spacing={3} textAlign="center" maxW="620px">
                <HStack
                  data-theme-transition="true"
                  spacing={2}
                  px={3.5}
                  py={1}
                  borderRadius="full"
                  bg={surfaceBg}
                  border="1px solid"
                  borderColor={borderSubtle}
                >
                  <Box w="6px" h="6px" borderRadius="full" bg={accentColor} />
                  <Text fontSize="xs" fontWeight="semibold" color={textMuted}>
                    Halaman Aktif: {activePage}
                  </Text>
                </HStack>

                <Text
                  fontFamily="'Figtree', sans-serif"
                  fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
                  fontWeight="extrabold"
                  letterSpacing="-0.02em"
                  lineHeight="1.2"
                  color={textMain}
                >
                  Pemantauan & Pengelolaan Siklus Residu Terpadu
                </Text>

                <Text fontSize="sm" color={textMuted} lineHeight="1.65">
                  Pantau perjalanan residu mulai dari pencatatan sumber, pengumpulan, pemilahan, hingga pemanfaatan kembali dalam satu dashboard operasional yang terstruktur.
                </Text>
              </VStack>

              {/* Featured Card Utama yang Mengarahkan Langsung ke Dashboard Siklus Residu */}
              <Card
                variant="featured"
                title="Belajar & Kelola Siklus Residu"
                description={`Saat ini terdapat ${residueLogs.length} catatan simulasi dengan total volume ${kpiMetrics.totalMasuk} kg residu terdata. Buka Dashboard Siklus Residu untuk memeriksa tahapan proses, grafik komposisi, atau mencatat data residu baru.`}
                badge="Mode Simulasi Siap"
                isActive={true}
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" rx="1.5" />
                    <rect x="14" y="3" width="7" height="5" rx="1.5" />
                    <rect x="14" y="12" width="7" height="9" rx="1.5" />
                    <rect x="3" y="16" width="7" height="5" rx="1.5" />
                  </svg>
                }
                footer={
                  <Flex
                    w="100%"
                    align="center"
                    justify="space-between"
                    flexWrap="wrap"
                    gap={3}
                  >
                    <HStack spacing={4} flexWrap="wrap">
                      <Text fontSize="xs" color={textMuted}>
                        Residu Masuk:{' '}
                        <Box as="span" fontWeight="bold" color={textMain}>
                          {kpiMetrics.totalMasuk} kg
                        </Box>
                      </Text>
                      <Text fontSize="xs" color={textMuted}>
                        Dimanfaatkan:{' '}
                        <Box as="span" fontWeight="bold" color={textMain}>
                          {kpiMetrics.dimanfaatkan} kg
                        </Box>
                      </Text>
                    </HStack>

                    <HStack spacing={2.5}>
                      <Box
                        as="button"
                        type="button"
                        onClick={openMenu}
                        px={3.5}
                        py={1.5}
                        borderRadius="lg"
                        bg={surfaceBg}
                        color={textMain}
                        border="1px solid"
                        borderColor={borderSubtle}
                        fontSize="xs"
                        fontWeight="semibold"
                        cursor="pointer"
                        _hover={{ bg: pillActiveBg }}
                      >
                        Menu Navigasi
                      </Box>
                      <Box
                        as="button"
                        type="button"
                        onClick={() => handleSelectDestination('Dashboard')}
                        px={4}
                        py={1.5}
                        borderRadius="lg"
                        bg={btnBg}
                        color={btnColor}
                        fontSize="xs"
                        fontWeight="bold"
                        cursor="pointer"
                        _hover={{ bg: btnHoverBg, transform: 'translateY(-1px)' }}
                        _active={{ transform: 'scale(0.97)' }}
                      >
                        Buka Dashboard
                      </Box>
                    </HStack>
                  </Flex>
                }
              />

              {/* Grid Kartu Navigasi Modul */}
              <Box w="100%">
                <Flex align="center" justify="space-between" mb={3} px={1}>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="0.07em"
                    color={textMuted}
                  >
                    Jelajahi Modul Aplikasi
                  </Text>
                  <Text fontSize="xs" color={textMuted}>
                    {NAV_DESTINATIONS.length} Halaman Tersedia
                  </Text>
                </Flex>

                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4} w="100%">
                  {NAV_DESTINATIONS.map((dest) => {
                    const isSelected = activePage === dest.id
                    return (
                      <Card
                        key={dest.id}
                        title={dest.label}
                        description={dest.desc}
                        icon={dest.icon}
                        isActive={isSelected}
                        badge={isSelected ? 'Aktif' : null}
                        compact
                        onClick={() => handleSelectDestination(dest.id)}
                      />
                    )
                  })}
                </SimpleGrid>
              </Box>
            </VStack>
          )}

          {/* ============================================================== */}
          {/* 3. HALAMAN FITUR, ANALITIK, DAN TENTANG                        */}
          {/* ============================================================== */}
          {(activePage === 'Fitur' ||
            activePage === 'Analitik' ||
            activePage === 'Tentang') && (
            <VStack spacing={6} w="100%" maxW="940px" mx="auto" align="stretch">
              <Flex
                direction={{ base: 'column', sm: 'row' }}
                align={{ base: 'flex-start', sm: 'center' }}
                justify="space-between"
                gap={3}
                p={6}
                bg={surfaceBg}
                borderRadius="2xl"
                border="1px solid"
                borderColor={borderSubtle}
              >
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color={accentColor} textTransform="uppercase">
                    Halaman Aktif: {activePage}
                  </Text>
                  <Text
                    fontFamily="'Figtree', sans-serif"
                    fontSize={{ base: '2xl', md: '3xl' }}
                    fontWeight="extrabold"
                    color={textMain}
                  >
                    {activePage === 'Fitur' && 'Modul & Kemampuan Siklus Residu'}
                    {activePage === 'Analitik' && 'Analitik & Ringkasan Laporan Residu'}
                    {activePage === 'Tentang' && 'Tentang Tim & Informasi Karya'}
                  </Text>
                </Box>

                <Box
                  as="button"
                  type="button"
                  onClick={() => handleSelectDestination('Dashboard')}
                  px={4}
                  py={2}
                  borderRadius="lg"
                  bg={btnBg}
                  color={btnColor}
                  fontSize="xs"
                  fontWeight="bold"
                  cursor="pointer"
                  _hover={{ bg: btnHoverBg }}
                >
                  Buka Dashboard Siklus Residu
                </Box>
              </Flex>

              {activePage === 'Fitur' && (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Card
                    title="1. Pencatatan Sumber & Pengumpulan"
                    description="Mencatat volume residu masuk berdasarkan sumber, waktu, dan kategori material secara terstruktur di tingkat lokal."
                    badge="Tahap 01–02"
                  />
                  <Card
                    title="2. Pemilahan Berbasis Karakteristik"
                    description="Memisahkan residu organik basah, ampas organik, minyak residu, serta serat kemasan agar siap disalurkan ke proses yang tepat."
                    badge="Tahap 03"
                  />
                  <Card
                    title="3. Pemantauan Pengolahan & Pemanfaatan"
                    description="Melacak porsi residu yang berhasil dimanfaatkan kembali dibandingkan dengan residu akhir yang tersisa."
                    badge="Tahap 04–05"
                  />
                  <Card
                    title="4. Simulasi Input Data Interaktif"
                    description="Mendukung penambahan catatan residu secara langsung pada mode demo lokal untuk menguji perubahan KPI dan grafik."
                    badge="Interaktif"
                    onClick={() => handleSelectDestination('Dashboard')}
                  />
                </SimpleGrid>
              )}

              {activePage === 'Analitik' && (
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Card
                    variant="kpi"
                    title="Rasio Pemanfaatan (Simulasi)"
                    metricValue={Math.round(
                      (kpiMetrics.dimanfaatkan / Math.max(kpiMetrics.totalMasuk, 1)) * 100
                    )}
                    metricUnit="%"
                    metricSubtext={`${kpiMetrics.dimanfaatkan} kg dimanfaatkan dari ${kpiMetrics.totalMasuk} kg total`}
                    isActive={true}
                  />
                  <Card
                    variant="kpi"
                    title="Dalam Proses Pemilahan/Kumpul"
                    metricValue={kpiMetrics.sedangDiproses}
                    metricUnit="kg"
                    metricSubtext="Menunggu penyaluran tahap berikutnya"
                  />
                  <Card
                    variant="kpi"
                    title="Porsi Residu Akhir"
                    metricValue={Math.round(
                      (kpiMetrics.residuAkhir / Math.max(kpiMetrics.totalMasuk, 1)) * 100
                    )}
                    metricUnit="%"
                    metricSubtext={`${kpiMetrics.residuAkhir} kg memerlukan penanganan akhir`}
                  />
                </SimpleGrid>
              )}

              {activePage === 'Tentang' && (
                <Card
                  variant="panel"
                  title="PROYEK.ID — Sistem Pemantauan Siklus Residu"
                  description="Antarmuka web berbasis React dan Chakra UI yang dirancang untuk memvisualisasikan alur pencatatan, pemilahan, dan pemanfaatan residu secara bersih, responsif, dan mudah dipahami."
                  footer={
                    <Text fontSize="xs" color={textMuted}>
                      Disusun oleh{' '}
                      <Box as="span" fontWeight="bold" color={textMain}>
                        Krisna, Nico, dan Yehez
                      </Box>{' '}
                      • Mode Demo & Simulasi Frontend
                    </Text>
                  }
                />
              )}

              {/* Navigasi Cepat Antarmodul */}
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
                {NAV_DESTINATIONS.map((dest) => (
                  <Card
                    key={dest.id}
                    title={dest.label}
                    description={dest.desc}
                    icon={dest.icon}
                    isActive={activePage === dest.id}
                    badge={activePage === dest.id ? 'Aktif' : null}
                    compact
                    onClick={() => handleSelectDestination(dest.id)}
                  />
                ))}
              </SimpleGrid>
            </VStack>
          )}
        </Box>
      </Flex>

      {/* Footer Adaptif Mode Gelap & Terang */}
      <Box
        as="footer"
        w="100%"
        pos="relative"
        zIndex={1}
        bg={surfaceBg}
        borderTop="1px solid"
        borderColor={borderSubtle}
        py={5}
        px={6}
      >
        <Flex
          maxW="1120px"
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
            letterSpacing="0.04em"
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