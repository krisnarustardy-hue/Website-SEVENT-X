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

// Navigasi wajib tepat tiga menu dengan urutan: CuPI | History Track | Profile
const NAV_ITEMS = ['CuPI', 'History Track', 'Profile']

const FOOD_CATEGORIES = [
  {
    id: 'cooked',
    label: 'Makanan Matang & Lauk Siap Saji',
    hint: 'Nasi, sup, olahan daging, ayam, ikan, tumisan sayur',
    roomLimitHours: 2,
    roomMaxHours: 4,
    fridgeLimitHours: 72,
  },
  {
    id: 'dairy_chilled',
    label: 'Susu, Olahan Dingin & Masakan Bersantan',
    hint: 'Susu cair, gulai/opor bersantan, keju lunak, puding susu',
    roomLimitHours: 2,
    roomMaxHours: 3,
    fridgeLimitHours: 48,
  },
  {
    id: 'produce_cut',
    label: 'Buah Kupas & Sayur Potong Segar',
    hint: 'Buah potong, salad sayur segar, lalapan siap santap',
    roomLimitHours: 2,
    roomMaxHours: 4,
    fridgeLimitHours: 48,
  },
  {
    id: 'bakery_dry',
    label: 'Roti, Kue & Makanan Kering',
    hint: 'Roti tawar, kue tanpa isian krim basah, makanan panggang',
    roomLimitHours: 24,
    roomMaxHours: 48,
    fridgeLimitHours: 120,
  },
]

const STORAGE_OPTIONS = [
  {
    id: 'fridge',
    label: 'Lemari Pendingin / Kulkas (≤ 4°C)',
    desc: 'Disimpan tertutup di rak dingin kulkas',
  },
  {
    id: 'room_covered',
    label: 'Suhu Ruang — Wadah Tertutup',
    desc: 'Di meja makan atau dapur dengan penutup rapat',
  },
  {
    id: 'room_open',
    label: 'Suhu Ruang — Terbuka',
    desc: 'Tanpa penutup atau terpapar udara ruang langsung',
  },
  {
    id: 'freezer',
    label: 'Freezer Beku (≤ -18°C)',
    desc: 'Disimpan dalam kondisi beku secara konsisten',
  },
  {
    id: 'unknown',
    label: 'Tidak Diketahui / Ragu',
    desc: 'Riwayat tempat dan suhu penyimpanan tidak pasti',
  },
]

const SENSORY_CHECKS = [
  {
    id: 'odorChange',
    label: 'Aroma asam, tengik, atau menyengat tidak wajar',
    detail: 'Bau berbeda jelas dari aroma normal makanan tersebut',
  },
  {
    id: 'textureChange',
    label: 'Permukaan berlendir, berbusa, atau berair tidak normal',
    detail: 'Tekstur terasa licin atau menggumpal saat diamati',
  },
  {
    id: 'colorMoldChange',
    label: 'Perubahan warna mencolok atau bercak menyerupai jamur',
    detail: 'Titik putih, hijau, keabu-abuan, atau warna kusam ekstrem',
  },
  {
    id: 'packagingSwollen',
    label: 'Wadah menggembung atau tutup terdorong gas',
    detail: 'Terdapat indikasi fermentasi atau gas di dalam wadah',
  },
]

// Data contoh awal yang diberi label eksplisit "Contoh data (Mode demo)"
const INITIAL_HISTORY_DEMO = [
  {
    id: 'CUPI-DEMO-01',
    isDemo: true,
    createdAt: '24 Nov 2026, 18:20',
    foodName: 'Ayam Gulai Santan Rumahan',
    categoryId: 'dairy_chilled',
    categoryLabel: 'Susu, Olahan Dingin & Masakan Bersantan',
    durationHours: '5',
    storageId: 'room_covered',
    storageLabel: 'Suhu Ruang — Wadah Tertutup',
    sensoryFlags: ['odorChange'],
    sensoryUnknown: false,
    imagePreview: null,
    notes: 'Contoh skenario: sisa makan siang disimpan di meja makan sejak pukul 13.00.',
    status: 'Risiko terindikasi',
    summary:
      'Makanan bersantan telah berada di suhu ruang selama 5 jam (melebihi batas acuan 2–3 jam) disertai perubahan aroma.',
    timeStorageFactor:
      'Penyimpanan suhu ruang selama 5 jam pada masakan bersantan melewati batas waktu aman di suhu ruang.',
    sensoryFactor:
      'Dilaporkan aroma asam/tidak wajar yang memperkuat indikasi penurunan mutu makanan.',
    reasoning:
      'Faktor durasi waktu di suhu ruang telah melampaui batas keamanan pangan, ditambah adanya tanda perubahan bau.',
    recommendation:
      'Disarankan untuk tidak mengonsumsi makanan ini. Pisahkan ke wadah sampah organik tertutup dan jangan dibagikan.',
    wasteGuidance: null,
  },
  {
    id: 'CUPI-DEMO-02',
    isDemo: true,
    createdAt: '24 Nov 2026, 12:40',
    foodName: 'Sup Ayam Sayur Bening',
    categoryId: 'cooked',
    categoryLabel: 'Makanan Matang & Lauk Siap Saji',
    durationHours: '16',
    storageId: 'fridge',
    storageLabel: 'Lemari Pendingin / Kulkas (≤ 4°C)',
    sensoryFlags: [],
    sensoryUnknown: false,
    imagePreview: null,
    notes: 'Contoh skenario: disimpan di wadah kedap udara di dalam kulkas setelah uap panas hilang.',
    status: 'Perlu perhatian',
    summary:
      'Riwayat penyimpanan dingin (16 jam di kulkas) masih berada dalam rentang acuan, tanpa keluhan bau, warna, atau tekstur.',
    timeStorageFactor:
      'Disimpan di lemari pendingin (≤ 4°C) selama 16 jam (masih di bawah batas acuan 72 jam untuk makanan matang).',
    sensoryFactor:
      'Tidak ditemukan perubahan aroma, tekstur berlendir, atau perubahan warna pada pengamatan pengguna.',
    reasoning:
      'Kondisi waktu dan suhu penyimpanan mendukung, namun pemeriksaan visual dan indera tidak menggantikan uji laboratorium.',
    recommendation:
      'Panaskan kembali secara merata hingga mendidih sebelum disajikan, dan pastikan aromanya tetap normal saat dipanaskan.',
    wasteGuidance:
      'Prioritaskan untuk dikonsumsi hari ini agar tidak terbuang. Bila ingin dibagikan ke pihak lain/komunitas, jaga suhu dingin selama perjalanan dan informasikan waktu masak agar penerima dapat memeriksa ulang.',
  },
  {
    id: 'CUPI-DEMO-03',
    isDemo: true,
    createdAt: '23 Nov 2026, 20:15',
    foodName: 'Nasi Kotak Acara Sore',
    categoryId: 'cooked',
    categoryLabel: 'Makanan Matang & Lauk Siap Saji',
    durationHours: '',
    storageId: 'unknown',
    storageLabel: 'Tidak Diketahui / Ragu',
    sensoryFlags: [],
    sensoryUnknown: true,
    imagePreview: null,
    notes: 'Contoh skenario: dibawa pulang dari acara tanpa label jam masak pada kemasan.',
    status: 'Perlu informasi tambahan',
    summary:
      'Informasi belum cukup: waktu masak dan riwayat penyimpanan sebelum makanan diterima belum diketahui.',
    timeStorageFactor:
      'Durasi paparan suhu ruang dan kondisi penyimpanan sebelumnya belum dapat dipastikan.',
    sensoryFactor:
      'Pengamatan bau dan tekstur belum dikonfirmasi; tampilan fisik yang tampak normal tidak menjamin makanan bebas risiko.',
    reasoning:
      'Keamanan pangan bergantung pada kepastian waktu dan suhu. Tanpa kedua data tersebut, kelayakan tidak dapat disimpulkan hanya dari tampilan luar.',
    recommendation:
      'Pastikan jam masak kepada penyedia makanan. Apabila makanan diperkirakan sudah berada di suhu ruang lebih dari 4 jam, hindari konsumsi.',
    wasteGuidance: null,
  },
]

const DEFAULT_PROFILE = {
  displayName: 'Pengguna CuPI',
  contextRole: 'Pencatatan Dapur & Rumah Tangga',
  contactNote: '',
  autoSaveHistory: true,
  strictRoomTempAlert: true,
  showWasteGuidance: true,
}

const STORAGE_KEYS = {
  HISTORY: 'cupi_history_track_v2',
  PROFILE: 'cupi_user_profile_v2',
}

// Mesin Evaluasi Keamanan Pangan CuPI
// Aturan utama: Waktu & Suhu adalah penentu utama. Visual/indera normal TIDAK BOLEH menaikkan status yang berisiko karena waktu/suhu.
function evaluateFoodCondition({
  foodName,
  categoryId,
  durationKnown,
  durationHours,
  storageId,
  sensoryFlags,
  sensoryUnknown,
  imagePreview,
  notes,
  strictRoomTempAlert,
}) {
  const category =
    FOOD_CATEGORIES.find((c) => c.id === categoryId) || FOOD_CATEGORIES[0]
  const storage =
    STORAGE_OPTIONS.find((s) => s.id === storageId) || STORAGE_OPTIONS[0]

  const parsedHours = Number(durationHours)
  const hasValidHours =
    durationKnown === 'known' &&
    durationHours !== '' &&
    !Number.isNaN(parsedHours) &&
    parsedHours >= 0

  const hasSensoryIssue = Array.isArray(sensoryFlags) && sensoryFlags.length > 0

  // 1. Jika ada temuan indera negatif (bau asam, lendir, jamur, kemasan gembung) -> Risiko terindikasi
  if (hasSensoryIssue) {
    const issueLabels = SENSORY_CHECKS.filter((item) =>
      sensoryFlags.includes(item.id)
    ).map((item) => item.label.toLowerCase())

    return {
      status: 'Risiko terindikasi',
      summary: `Terdeteksi tanda perubahan fisik atau indera pada "${foodName}" (${issueLabels.join(', ')}).`,
      timeStorageFactor: hasValidHours
        ? `Tercatat disimpan selama ${parsedHours} jam pada kondisi: ${storage.label}.`
        : `Tempat penyimpanan: ${storage.label} (durasi jam pasti tidak tercatat).`,
      sensoryFactor: `Temuan pengamatan pengguna: ${issueLabels.join('; ')}.`,
      reasoning:
        'Perubahan bau, tekstur berlendir, bercak jamur, atau wadah yang menggembung menandakan aktivitas pembusukan yang berisiko bagi kesehatan.',
      recommendation:
        'Jangan dikonsumsi dan jangan dicicipi. Buang makanan ke wadah tertutup dan jangan disalurkan untuk konsumsi pihak lain.',
      wasteGuidance: null,
    }
  }

  // 2. Jika data waktu atau penyimpanan tidak tersedia -> "Perlu informasi tambahan" atau "Tidak dapat dinilai"
  if (
    durationKnown === 'unknown' ||
    !hasValidHours ||
    storageId === 'unknown'
  ) {
    const isBothUnknown =
      (durationKnown === 'unknown' || !hasValidHours) && storageId === 'unknown'

    return {
      status: isBothUnknown ? 'Tidak dapat dinilai' : 'Perlu informasi tambahan',
      summary: isBothUnknown
        ? `Informasi belum cukup: riwayat waktu dan kondisi penyimpanan "${foodName}" sama-sama tidak diketahui sehingga tidak dapat dinilai.`
        : `Informasi belum cukup: penilaian "${foodName}" memerlukan kepastian durasi waktu dan kondisi suhu penyimpanan.`,
      timeStorageFactor:
        storageId === 'unknown'
          ? 'Riwayat suhu dan tempat penyimpanan belum diketahui.'
          : `Tempat penyimpanan tercatat (${storage.label}), namun durasi waktu simpan belum diketahui.`,
      sensoryFactor: sensoryUnknown
        ? 'Pengamatan bau, warna, dan tekstur belum dilakukan secara langsung.'
        : 'Tidak ada tanda kerusakan kasatmata yang dilaporkan, namun foto dan pengamatan indera bukan bukti tunggal bahwa makanan aman.',
      reasoning:
        'Bakteri patogen pada pangan dapat berkembang tanpa mengubah warna atau aroma makanan. Tanpa data waktu dan suhu, status keamanan tidak boleh diasumsikan aman.',
      recommendation:
        'Lengkapi data waktu masak/simpan dan kondisi suhu. Jika makanan dicurigai telah berada di suhu ruang lebih dari 4 jam tanpa pendinginan, sebaiknya tidak dikonsumsi.',
      wasteGuidance: null,
    }
  }

  // 3. Evaluasi faktor waktu & suhu penyimpanan sebagai penentu utama
  const warningRoomHours = strictRoomTempAlert
    ? category.roomLimitHours
    : category.roomMaxHours
  const isRoomStorage =
    storageId === 'room_covered' || storageId === 'room_open'

  if (isRoomStorage) {
    // Melewati batas aman suhu ruang -> Risiko terindikasi (walaupun foto/bau normal)
    if (
      parsedHours > category.roomMaxHours ||
      (storageId === 'room_open' && parsedHours > category.roomLimitHours)
    ) {
      return {
        status: 'Risiko terindikasi',
        summary: `"${foodName}" telah berada di suhu ruang selama ${parsedHours} jam, melewati batas waktu aman untuk kategori ${category.label.toLowerCase()}.`,
        timeStorageFactor: `Durasi ${parsedHours} jam pada ${storage.label} melampaui batas acuan keamanan suhu ruang (${category.roomLimitHours}–${category.roomMaxHours} jam).`,
        sensoryFactor: imagePreview
          ? 'Foto konteks visual terlampir dan tidak ada keluhan bau/tekstur, namun tampilan normal tidak membatalkan risiko dari riwayat waktu dan suhu.'
          : 'Tidak ada keluhan bau, warna, atau tekstur, namun hasil indera yang tampak normal tidak dapat menaikkan status yang berisiko karena faktor waktu.',
        reasoning:
          'Makanan yang berada terlalu lama di suhu ruang rentan terhadap pertumbuhan mikroorganisme meskipun belum menunjukkan perubahan aroma atau warna.',
        recommendation:
          'Disarankan untuk tidak mengonsumsi makanan ini. Ke depannya, simpan makanan matang atau mudah rusak ke dalam kulkas maksimal 2 jam setelah disajikan.',
        wasteGuidance: null,
      }
    }

    // Mendekati batas waktu suhu ruang -> Perlu perhatian
    if (parsedHours >= warningRoomHours || sensoryUnknown) {
      return {
        status: 'Perlu perhatian',
        summary: `"${foodName}" telah berada di suhu ruang selama ${parsedHours} jam dan mendekati batas waktu simpan suhu ruang.`,
        timeStorageFactor: `Tercatat ${parsedHours} jam pada ${storage.label} (ambang kewaspadaan suhu ruang: ${warningRoomHours} jam).`,
        sensoryFactor: sensoryUnknown
          ? 'Observasi bau dan tekstur belum dikonfirmasi sepenuhnya oleh pengguna.'
          : 'Tidak ditemukan perubahan bau, warna, atau tekstur pada pengamatan awal.',
        reasoning:
          'Durasi di suhu ruang sudah mendekati batas toleransi sehingga memerlukan tindakan segera sebelum risiko meningkat.',
        recommendation:
          'Apabila hendak dikonsumsi sekarang, panaskan kembali hingga panas merata dan periksa aromanya. Jangan dibiarkan lebih lama di suhu ruang dan tidak disarankan untuk didonasikan.',
        wasteGuidance:
          'Konsumsi segera setelah dipanaskan merata, atau pindahkan porsi yang belum tersentuh ke lemari pendingin bila durasi suhu ruang belum melewati 2 jam.',
      }
    }
  }

  // Evaluasi penyimpanan dingin (Kulkas)
  if (storageId === 'fridge' && parsedHours > category.fridgeLimitHours) {
    return {
      status: 'Risiko terindikasi',
      summary: `"${foodName}" telah disimpan di lemari pendingin selama ${parsedHours} jam, melewati acuan waktu simpan dingin (${category.fridgeLimitHours} jam).`,
      timeStorageFactor: `Durasi penyimpanan kulkas ${parsedHours} jam melebihi batas acuan ${category.fridgeLimitHours} jam untuk kategori ${category.label}.`,
      sensoryFactor:
        'Meskipun tampilan dan bau tampak normal, penyimpanan dingin yang melampaui batas waktu tetap berisiko.',
      reasoning:
        'Pendinginan di kulkas hanya memperlambat pertumbuhan mikroba, bukan menghentikannya tanpa batas waktu.',
      recommendation:
        'Sebaiknya tidak dikonsumsi. Gunakan label tanggal simpan pada wadah makanan di kulkas untuk mencegah penyimpanan berlebih.',
      wasteGuidance: null,
    }
  }

  // 4. Waktu & suhu sesuai, tetapi observasi indera belum dilakukan
  if (sensoryUnknown) {
    return {
      status: 'Perlu informasi tambahan',
      summary: `Informasi belum cukup: riwayat waktu (${parsedHours} jam) dan suhu (${storage.label}) masih sesuai acuan, namun pengamatan bau dan tekstur belum dikonfirmasi.`,
      timeStorageFactor: `Disimpan pada ${storage.label} selama ${parsedHours} jam (dalam rentang acuan kategori ${category.label}).`,
      sensoryFactor:
        'Pengguna menandai belum memeriksa bau, warna, dan tekstur makanan secara langsung.',
      reasoning:
        'Penilaian kondisi makanan memerlukan gabungan riwayat waktu/suhu yang baik dan konfirmasi bahwa tidak ada tanda pembusukan fisik.',
      recommendation:
        'Periksa aroma, tekstur permukaan, dan kondisi bagian dalam makanan sebelum memutuskan untuk memanaskan atau mengonsumsinya.',
      wasteGuidance: null,
    }
  }

  // 5. Waktu, suhu, dan observasi indera semuanya dalam batas wajar -> Status: "Perlu perhatian"
  // (Tidak pernah menggunakan klaim absolut "100% Aman")
  return {
    status: 'Perlu perhatian',
    summary: `Riwayat waktu (${parsedHours} jam) pada ${storage.label.toLowerCase()} masih berada dalam batas acuan untuk "${foodName}", tanpa indikasi perubahan bau, warna, atau tekstur.`,
    timeStorageFactor: `Tercatat ${parsedHours} jam pada ${storage.label} (acuan kategori: ${
      isRoomStorage
        ? `maks. ${category.roomLimitHours}–${category.roomMaxHours} jam suhu ruang`
        : `maks. ${category.fridgeLimitHours} jam suhu kulkas`
    }).`,
    sensoryFactor: imagePreview
      ? 'Foto konteks visual disertakan dan pengguna mengonfirmasi tidak ada perubahan bau, tekstur lendir, atau warna tidak wajar.'
      : 'Pengguna mengonfirmasi tidak ada perubahan bau, tekstur lendir, atau warna tidak wajar.',
    reasoning:
      'Riwayat penyimpanan dan pengamatan indera mendukung, namun pemeriksaan mandiri tidak dapat mendeteksi mikroorganisme tak kasatmata sehingga penanganan higienis tetap diperlukan.',
    recommendation:
      'Gunakan peralatan makan bersih. Untuk makanan matang atau makanan dari kulkas, panaskan kembali hingga panas merata sebelum dikonsumsi dan periksa aromanya.',
    wasteGuidance:
      notes && notes.trim().length > 0
        ? `Catatan ("${notes.trim()}") telah dicatat. Untuk mengurangi food waste secara bertanggung jawab, habiskan sesuai porsi. Jika ingin disalurkan ke penerima atau food bank, pastikan suhu penyimpanan tetap terjaga dan ingatkan penerima untuk tetap melakukan pemeriksaan kelayakan sendiri.`
        : 'Untuk mengurangi food waste secara bertanggung jawab, prioritaskan konsumsi tepat waktu atau beri label jam simpan. Bila ingin dibagikan, pastikan rantai suhu terjaga dan penerima/food bank tetap melakukan pemeriksaan mandiri sebelum konsumsi.',
  }
}

function App() {
  const [activeNav, setActiveNav] = useState('CuPI')
  const { colorMode, toggleColorMode } = useColorMode()

  // State History Track
  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // Fallback ke data demo
    }
    return INITIAL_HISTORY_DEMO
  })

  // State Profile
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_PROFILE, ...parsed }
        }
      }
    } catch {
      // Fallback ke default profile
    }
    return DEFAULT_PROFILE
  })

  // State Form Pemeriksaan Makanan
  const [foodName, setFoodName] = useState('')
  const [categoryId, setCategoryId] = useState('cooked')
  const [durationKnown, setDurationKnown] = useState('known')
  const [durationHours, setDurationHours] = useState('')
  const [storageId, setStorageId] = useState('fridge')
  const [sensoryFlags, setSensoryFlags] = useState([])
  const [sensoryUnknown, setSensoryUnknown] = useState(false)
  const [notes, setNotes] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFileName, setImageFileName] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [isDraggingFile, setIsDraggingFile] = useState(false)

  // State Proses & Hasil
  const [formErrors, setFormErrors] = useState({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState(null)
  const [isResultSaved, setIsResultSaved] = useState(false)

  // State History Track Filter & Detail
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [expandedHistoryId, setExpandedHistoryId] = useState('CUPI-DEMO-01')

  // State Profile Edit
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileDraft, setProfileDraft] = useState(profile)
  const [profileFeedback, setProfileFeedback] = useState('')
  const [confirmClearHistory, setConfirmClearHistory] = useState(false)

  const analyzeTimerRef = useRef(null)
  const feedbackTimerRef = useRef(null)
  const fileInputRef = useRef(null)
  const resultSectionRef = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyList))
    } catch {
      // Abaikan error kuota localStorage
    }
  }, [historyList])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile))
    } catch {
      // Abaikan error localStorage
    }
  }, [profile])

  useEffect(() => {
    return () => {
      if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current)
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    }
  }, [])

  // Design Tokens CuPI (Fresh Botanical Green + Warm Food Neutrals)
  const bgMain = useColorModeValue('#E8F1E5', '#0E1A13')
  const surfaceSage = useColorModeValue('#F0F5ED', '#15251B')
  const surfaceCream = useColorModeValue('#F6F4E9', '#1A2D21')
  const surfaceInteractive = useColorModeValue('#DCE9D7', '#213829')
  const primaryGreen = useColorModeValue('#285B3D', '#78A96B')
  const primaryBtnBg = useColorModeValue('#285B3D', '#78A96B')
  const primaryBtnText = useColorModeValue('#F6F4E9', '#0E1A13')
  const primaryBtnHover = useColorModeValue('#1F4930', '#8AB97D')
  const freshGreen = useColorModeValue('#78A96B', '#5E8E53')
  const textMain = useColorModeValue('#203329', '#EEF3EC')
  const textMuted = useColorModeValue('#65766A', '#9BB0A1')
  const borderSubtle = useColorModeValue('#C5D7C0', '#273F30')
  const borderStrong = useColorModeValue('#97B891', '#3B5E47')
  const inputBg = useColorModeValue('#FAFBF8', '#101E15')

  // Warna Status
  const amberStatus = useColorModeValue('#D99A38', '#E5AC4C')
  const amberBg = useColorModeValue('#F7EEDB', '#322614')
  const amberText = useColorModeValue('#6B460B', '#F6D594')

  const redStatus = useColorModeValue('#B9574F', '#DF7870')
  const redBg = useColorModeValue('#F6E5E3', '#351A19')
  const redText = useColorModeValue('#70231D', '#F6B6B1')

  const infoStatus = useColorModeValue('#4A6B54', '#88AE93')
  const infoBg = useColorModeValue('#E2ECE3', '#1E3326')
  const infoText = useColorModeValue('#1F3828', '#D4E6DA')

  const elevatedShadow = useColorModeValue(
    '0 8px 24px rgba(32, 51, 41, 0.06), 0 1px 3px rgba(32, 51, 41, 0.04)',
    '0 12px 28px rgba(3, 8, 5, 0.6), 0 2px 6px rgba(3, 8, 5, 0.4)'
  )

  const getStatusTokens = (status) => {
    if (status === 'Risiko terindikasi') {
      return {
        accent: redStatus,
        bg: redBg,
        text: redText,
      }
    }
    if (status === 'Perlu perhatian') {
      return {
        accent: amberStatus,
        bg: amberBg,
        text: amberText,
      }
    }
    return {
      accent: infoStatus,
      bg: infoBg,
      text: infoText,
    }
  }

  // Handler Unggah Foto Makanan
  const handleFileProcess = (file) => {
    setUploadError('')
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setUploadError('Format file belum didukung. Gunakan gambar JPG, PNG, atau WEBP.')
      return
    }

    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Ukuran file melebihi 4 MB. Pilih foto dengan ukuran lebih kecil.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
      setImageFileName(file.name)
    }
    reader.onerror = () => {
      setUploadError('Gagal memuat foto. Silakan pilih file gambar lain.')
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) handleFileProcess(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageFileName('')
    setUploadError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleToggleSensoryFlag = (flagId) => {
    setSensoryUnknown(false)
    setSensoryFlags((prev) =>
      prev.includes(flagId)
        ? prev.filter((item) => item !== flagId)
        : [...prev, flagId]
    )
  }

  const handleToggleSensoryUnknown = () => {
    setSensoryUnknown((prev) => {
      const next = !prev
      if (next) setSensoryFlags([])
      return next
    })
  }

  const handleRunAssessment = (e) => {
    e.preventDefault()
    const errors = {}

    if (!foodName.trim()) {
      errors.foodName = 'Nama atau jenis makanan wajib diisi terlebih dahulu.'
    }

    if (durationKnown === 'known') {
      if (durationHours === '' || Number.isNaN(Number(durationHours))) {
        errors.durationHours =
          'Isi perkiraan durasi simpan (jam), atau pilih "Tidak diketahui / ragu".'
      } else if (Number(durationHours) < 0 || Number(durationHours) > 720) {
        errors.durationHours = 'Masukkan angka durasi yang wajar (0–720 jam).'
      }
    }

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsAnalyzing(true)
    setIsResultSaved(false)

    if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current)
    analyzeTimerRef.current = setTimeout(() => {
      const cleanName = foodName.trim()
      const categoryObj =
        FOOD_CATEGORIES.find((c) => c.id === categoryId) || FOOD_CATEGORIES[0]
      const storageObj =
        STORAGE_OPTIONS.find((s) => s.id === storageId) || STORAGE_OPTIONS[0]

      const evaluated = evaluateFoodCondition({
        foodName: cleanName,
        categoryId,
        durationKnown,
        durationHours,
        storageId,
        sensoryFlags,
        sensoryUnknown,
        imagePreview,
        notes,
        strictRoomTempAlert: profile.strictRoomTempAlert,
      })

      const now = new Date()
      const formattedDate = now.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      const formattedTime = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })

      const newRecord = {
        id: `CUPI-${Math.floor(1000 + Math.random() * 9000)}`,
        isDemo: false,
        createdAt: `${formattedDate}, ${formattedTime}`,
        foodName: cleanName,
        categoryId,
        categoryLabel: categoryObj.label,
        durationHours: durationKnown === 'known' ? String(durationHours) : '',
        storageId,
        storageLabel: storageObj.label,
        sensoryFlags: [...sensoryFlags],
        sensoryUnknown,
        imagePreview,
        notes: notes.trim(),
        ...evaluated,
      }

      setAssessmentResult(newRecord)
      setIsAnalyzing(false)

      if (profile.autoSaveHistory) {
        setHistoryList((prev) => [newRecord, ...prev])
        setExpandedHistoryId(newRecord.id)
        setIsResultSaved(true)
      }

      setTimeout(() => {
        if (resultSectionRef.current) {
          resultSectionRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }, 80)
    }, 420)
  }

  const handleSaveToHistoryManual = () => {
    if (!assessmentResult || isResultSaved) return
    setHistoryList((prev) => [assessmentResult, ...prev])
    setExpandedHistoryId(assessmentResult.id)
    setIsResultSaved(true)
  }

  const handleResetForm = () => {
    setFoodName('')
    setCategoryId('cooked')
    setDurationKnown('known')
    setDurationHours('')
    setStorageId('fridge')
    setSensoryFlags([])
    setSensoryUnknown(false)
    setNotes('')
    handleRemoveImage()
    setFormErrors({})
    setAssessmentResult(null)
    setIsResultSaved(false)
  }

  const handleFillSampleInput = (sampleType) => {
    setFormErrors({})
    setAssessmentResult(null)
    setIsResultSaved(false)

    if (sampleType === 'room_risk') {
      setFoodName('Opor Ayam Santan')
      setCategoryId('dairy_chilled')
      setDurationKnown('known')
      setDurationHours('5.5')
      setStorageId('room_open')
      setSensoryFlags([])
      setSensoryUnknown(false)
      setNotes('Contoh uji: dibiarkan di suhu ruang sejak siang, tampilan masih terlihat biasa.')
    } else {
      setFoodName('Capcay Sayur Ayam')
      setCategoryId('cooked')
      setDurationKnown('known')
      setDurationHours('14')
      setStorageId('fridge')
      setSensoryFlags([])
      setSensoryUnknown(false)
      setNotes('Contoh uji: disimpan tertutup di lemari pendingin.')
    }
  }

  const filteredHistory = useMemo(() => {
    return historyList.filter((item) => {
      const matchQuery =
        !searchQuery.trim() ||
        item.foodName.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (item.categoryLabel &&
          item.categoryLabel.toLowerCase().includes(searchQuery.trim().toLowerCase()))

      const matchStatus =
        statusFilter === 'Semua' || item.status === statusFilter

      return matchQuery && matchStatus
    })
  }, [historyList, searchQuery, statusFilter])

  const handleDeleteHistoryItem = (id) => {
    setHistoryList((prev) => prev.filter((item) => item.id !== id))
    if (expandedHistoryId === id) {
      setExpandedHistoryId(null)
    }
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    const cleanName = profileDraft.displayName.trim() || 'Pengguna CuPI'
    const updated = {
      ...profileDraft,
      displayName: cleanName,
    }
    setProfile(updated)
    setProfileDraft(updated)
    setIsEditingProfile(false)
    setProfileFeedback('Perubahan profil lokal berhasil disimpan.')

    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    feedbackTimerRef.current = setTimeout(() => {
      setProfileFeedback('')
    }, 3200)
  }

  const handlePreferenceToggle = (key) => {
    setProfile((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      setProfileDraft(updated)
      return updated
    })
  }

  const userInitials = useMemo(() => {
    const parts = (profile.displayName || 'CuPI').trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }, [profile.displayName])

  return (
    <Flex
      direction="column"
      minH="100vh"
      w="100%"
      bg={bgMain}
      color={textMain}
      fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      className="cupi-root-transition"
    >
      <style>{`
        .cupi-root-transition,
        .cupi-root-transition nav,
        .cupi-root-transition footer,
        .cupi-root-transition button,
        .cupi-root-transition input,
        .cupi-root-transition select,
        .cupi-root-transition textarea,
        .cupi-root-transition [data-cupi-el="true"] {
          transition:
            background-color 0.34s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.34s cubic-bezier(0.22, 1, 0.36, 1),
            color 0.28s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.34s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes dropUnblur {
          from {
            opacity: 0;
            transform: translateY(-14px) scale(0.98);
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
            transform: rotate(-70deg) scale(0.55);
          }
          to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes pageFadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loadingDotPulse {
          0%, 100% {
            opacity: 0.95;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.25);
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

      {/* ================================================================== */}
      {/* NAVBAR KAPSUL TENGAH — MEMPERTAHANKAN DNA VISUAL ASLI              */}
      {/* HANYA BERISI TEPAT 3 MENU: CuPI | History Track | Profile          */}
      {/* ================================================================== */}
      <Box
        as="header"
        pos="fixed"
        top={0}
        left={0}
        w="100%"
        zIndex={100}
        pt={{ base: 3, sm: 4 }}
        px={{ base: 3, sm: 5 }}
        pointerEvents="none"
      >
        <Flex
          as="nav"
          aria-label="Navigasi Utama CuPI"
          data-cupi-el="true"
          maxW="720px"
          minH="54px"
          mx="auto"
          px={{ base: 3.5, sm: 5 }}
          py={{ base: 1.5, sm: 0 }}
          align="center"
          justify="space-between"
          gap={2}
          bg={surfaceSage}
          borderRadius="full"
          border="1px solid"
          borderColor={borderSubtle}
          boxShadow={elevatedShadow}
          pointerEvents="auto"
          animation="dropUnblur 0.55s cubic-bezier(0.16, 1, 0.3, 1) both"
        >
          {/* Wordmark CuPI */}
          <HStack
            as="button"
            type="button"
            spacing={2}
            onClick={() => setActiveNav('CuPI')}
            pl={1}
            cursor="pointer"
            userSelect="none"
            animation="contentReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both"
            _focusVisible={{
              outline: '2px solid',
              outlineColor: primaryGreen,
              outlineOffset: '3px',
              borderRadius: 'full',
            }}
          >
            <Box w="8px" h="8px" borderRadius="full" bg={primaryGreen} />
            <Text
              fontFamily="'Figtree', sans-serif"
              fontWeight="extrabold"
              fontSize={{ base: 'sm', sm: 'md' }}
              letterSpacing="0.02em"
              color={textMain}
            >
              CuPI
            </Text>
          </HStack>

          {/* Tiga Item Navigasi: CuPI | History Track | Profile */}
          <HStack
            spacing={{ base: 0.5, sm: 1.5 }}
            animation="contentReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item
              return (
                <Box
                  as="button"
                  type="button"
                  key={item}
                  onClick={() => setActiveNav(item)}
                  aria-current={isActive ? 'page' : undefined}
                  px={{ base: 2.5, sm: 3.5 }}
                  py={1.5}
                  borderRadius="full"
                  fontSize={{ base: 'xs', sm: 'sm' }}
                  fontWeight={isActive ? 'bold' : 'medium'}
                  color={isActive ? primaryBtnText : textMuted}
                  bg={isActive ? primaryBtnBg : 'transparent'}
                  cursor="pointer"
                  userSelect="none"
                  whiteSpace="nowrap"
                  transition="background-color 0.2s ease, color 0.2s ease, transform 0.15s ease"
                  _hover={{
                    bg: isActive ? primaryBtnHover : surfaceInteractive,
                    color: isActive ? primaryBtnText : textMain,
                  }}
                  _active={{ transform: 'scale(0.96)' }}
                  _focusVisible={{
                    outline: '2px solid',
                    outlineColor: primaryGreen,
                    outlineOffset: '1px',
                  }}
                >
                  {item}
                </Box>
              )
            })}
          </HStack>

          {/* Tombol Toggle Mode Terang / Gelap */}
          <HStack
            spacing={2}
            animation="contentReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both"
          >
            <Box
              as="button"
              type="button"
              onClick={toggleColorMode}
              aria-label={
                colorMode === 'dark'
                  ? 'Beralih ke mode terang'
                  : 'Beralih ke mode gelap'
              }
              w="34px"
              h="34px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="full"
              bg={surfaceCream}
              color={textMain}
              border="1px solid"
              borderColor={borderSubtle}
              cursor="pointer"
              userSelect="none"
              _hover={{
                borderColor: borderStrong,
                bg: surfaceInteractive,
                transform: 'scale(1.06)',
              }}
              _active={{ transform: 'scale(0.9)' }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: primaryGreen,
                outlineOffset: '2px',
              }}
            >
              <Box
                as="span"
                key={colorMode}
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                animation="iconSwitch 0.36s cubic-bezier(0.22, 1, 0.36, 1) both"
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
          </HStack>
        </Flex>
      </Box>

      {/* ================================================================== */}
      {/* AREA KONTEN UTAMA                                                  */}
      {/* ================================================================== */}
      <Flex
        as="main"
        flex="1"
        direction="column"
        align="center"
        w="100%"
        pt={{ base: '92px', sm: '104px' }}
        pb={{ base: '48px', md: '64px' }}
        px={{ base: 4, sm: 6 }}
      >
        <Box
          key={activeNav}
          w="100%"
          maxW="880px"
          animation="pageFadeUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) both"
        >
          {/* ============================================================== */}
          {/* 1. HALAMAN UTAMA: CuPI (PEMERIKSAAN KONDISI MAKANAN)           */}
          {/* ============================================================== */}
          {activeNav === 'CuPI' && (
            <VStack spacing={6} align="stretch" w="100%">
              {/* Editorial Header Terbuka (Tanpa Card-in-Card) */}
              <Box px={{ base: 1, sm: 2 }}>
                <HStack spacing={2} mb={2}>
                  <Box w="7px" h="7px" borderRadius="full" bg={primaryGreen} />
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    letterSpacing="0.04em"
                    textTransform="uppercase"
                    color={primaryGreen}
                  >
                    CuPI • Food Condition & Safety Assistant
                  </Text>
                </HStack>

                <Text
                  fontFamily="'Figtree', sans-serif"
                  fontSize={{ base: '2xl', sm: '3xl' }}
                  fontWeight="extrabold"
                  letterSpacing="-0.02em"
                  lineHeight="1.2"
                  color={textMain}
                >
                  Periksa Kelayakan Makanan dari Waktu, Penyimpanan, dan Fisik
                </Text>

                <Text fontSize="sm" color={textMuted} mt={2} maxW="720px" lineHeight="1.65">
                  Penilaian mengutamakan{' '}
                  <Box as="span" fontWeight="semibold" color={textMain}>
                    durasi waktu dan kondisi suhu penyimpanan
                  </Box>{' '}
                  sebagai faktor penentu utama, dilengkapi pengamatan indera serta foto konteks visual. Makanan yang tampak atau berbau normal tetap berisiko apabila melewati batas waktu suhu ruang.
                </Text>
              </Box>

              {/* Panel Tunggal Pemeriksaan Makanan (Tanpa Nested Cards) */}
              <Card
                as="form"
                onSubmit={handleRunAssessment}
                surface="sage"
                title="Pemeriksaan Kondisi Makanan"
                subtitle="Isi data waktu, tempat penyimpanan, dan hasil pengamatan langsung Anda."
                headerAction={
                  <HStack spacing={1.5} flexWrap="wrap">
                    <Text fontSize="11px" color={textMuted} mr={1}>
                      Uji contoh:
                    </Text>
                    <Box
                      as="button"
                      type="button"
                      onClick={() => handleFillSampleInput('fridge_watch')}
                      px={2.5}
                      py={1}
                      borderRadius="md"
                      bg={surfaceCream}
                      border="1px solid"
                      borderColor={borderSubtle}
                      fontSize="11px"
                      fontWeight="semibold"
                      color={textMain}
                      cursor="pointer"
                      _hover={{ borderColor: borderStrong, bg: surfaceInteractive }}
                    >
                      Simpan Kulkas (14j)
                    </Box>
                    <Box
                      as="button"
                      type="button"
                      onClick={() => handleFillSampleInput('room_risk')}
                      px={2.5}
                      py={1}
                      borderRadius="md"
                      bg={surfaceCream}
                      border="1px solid"
                      borderColor={borderSubtle}
                      fontSize="11px"
                      fontWeight="semibold"
                      color={textMain}
                      cursor="pointer"
                      _hover={{ borderColor: borderStrong, bg: surfaceInteractive }}
                    >
                      Suhu Ruang (5.5j)
                    </Box>
                  </HStack>
                }
                footer={
                  <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    align={{ base: 'stretch', sm: 'center' }}
                    justify="space-between"
                    gap={3}
                  >
                    <Text fontSize="xs" color={textMuted}>
                      {profile.autoSaveHistory
                        ? 'Hasil pemeriksaan otomatis dicatat ke History Track lokal.'
                        : 'Penyimpanan otomatis nonaktif — Anda dapat menyimpan manual setelah evaluasi.'}
                    </Text>

                    <HStack spacing={2.5} justify="flex-end">
                      <Box
                        as="button"
                        type="button"
                        onClick={handleResetForm}
                        px={4}
                        py={2}
                        borderRadius="lg"
                        bg={surfaceCream}
                        color={textMain}
                        border="1px solid"
                        borderColor={borderSubtle}
                        fontSize="xs"
                        fontWeight="bold"
                        cursor="pointer"
                        _hover={{ bg: surfaceInteractive }}
                      >
                        Reset
                      </Box>

                      <Box
                        as="button"
                        type="submit"
                        disabled={isAnalyzing}
                        px={5}
                        py={2}
                        borderRadius="lg"
                        bg={primaryBtnBg}
                        color={primaryBtnText}
                        fontSize="xs"
                        fontWeight="bold"
                        cursor={isAnalyzing ? 'wait' : 'pointer'}
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={2}
                        _hover={{
                          bg: isAnalyzing ? primaryBtnBg : primaryBtnHover,
                          transform: isAnalyzing ? 'none' : 'translateY(-1px)',
                        }}
                        _active={{ transform: 'scale(0.98)' }}
                      >
                        {isAnalyzing ? (
                          <>
                            <Box
                              w="7px"
                              h="7px"
                              borderRadius="full"
                              bg={primaryBtnText}
                              animation="loadingDotPulse 0.9s infinite"
                            />
                            <span>Memeriksa Riwayat Waktu & Suhu...</span>
                          </>
                        ) : (
                          <span>Periksa Kondisi Makanan</span>
                        )}
                      </Box>
                    </HStack>
                  </Flex>
                }
              >
                <VStack spacing={6} align="stretch">
                  {/* SEKSI 1: Nama & Kategori Makanan */}
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      color={primaryGreen}
                      mb={3}
                    >
                      1. Identitas & Jenis Makanan
                    </Text>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text
                          as="label"
                          htmlFor="food-name-input"
                          fontSize="xs"
                          fontWeight="semibold"
                          display="block"
                          mb={1.5}
                        >
                          Nama Makanan *
                        </Text>
                        <Box
                          as="input"
                          id="food-name-input"
                          type="text"
                          value={foodName}
                          onChange={(e) => {
                            setFoodName(e.target.value)
                            if (formErrors.foodName) {
                              setFormErrors((prev) => ({ ...prev, foodName: '' }))
                            }
                          }}
                          placeholder="Mis. Sayur Sop, Ayam Goreng, Puding Susu"
                          w="100%"
                          px={3.5}
                          py={2}
                          fontSize="sm"
                          bg={inputBg}
                          color={textMain}
                          borderRadius="lg"
                          border="1px solid"
                          borderColor={formErrors.foodName ? redStatus : borderSubtle}
                          _focusVisible={{
                            outline: '2px solid',
                            outlineColor: primaryGreen,
                          }}
                        />
                        {formErrors.foodName && (
                          <Text fontSize="xs" color={redStatus} fontWeight="semibold" mt={1}>
                            {formErrors.foodName}
                          </Text>
                        )}
                      </Box>

                      <Box>
                        <Text
                          as="label"
                          htmlFor="food-category-select"
                          fontSize="xs"
                          fontWeight="semibold"
                          display="block"
                          mb={1.5}
                        >
                          Kelompok Makanan
                        </Text>
                        <Box
                          as="select"
                          id="food-category-select"
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          w="100%"
                          px={3}
                          py={2}
                          fontSize="sm"
                          bg={inputBg}
                          color={textMain}
                          borderRadius="lg"
                          border="1px solid"
                          borderColor={borderSubtle}
                          _focusVisible={{
                            outline: '2px solid',
                            outlineColor: primaryGreen,
                          }}
                        >
                          {FOOD_CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.label}
                            </option>
                          ))}
                        </Box>
                        <Text fontSize="11px" color={textMuted} mt={1}>
                          {
                            (
                              FOOD_CATEGORIES.find((c) => c.id === categoryId) ||
                              FOOD_CATEGORIES[0]
                            ).hint
                          }
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  {/* Garis Pemisah Seksi */}
                  <Box borderTop="1px solid" borderColor={borderSubtle} />

                  {/* SEKSI 2: Faktor Utama — Durasi Waktu & Kondisi Penyimpanan */}
                  <Box>
                    <Flex align="center" justify="space-between" mb={3} flexWrap="wrap" gap={2}>
                      <Text fontSize="xs" fontWeight="bold" color={primaryGreen}>
                        2. Riwayat Waktu & Suhu Penyimpanan (Penentu Utama)
                      </Text>
                      <Text fontSize="11px" color={textMuted}>
                        Wajib diketahui untuk menilai keamanan pangan
                      </Text>
                    </Flex>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                      {/* Input Durasi Waktu */}
                      <Box>
                        <Text fontSize="xs" fontWeight="semibold" mb={2}>
                          Durasi sejak dimasak / dibeli / disimpan
                        </Text>

                        <HStack spacing={2} mb={2.5}>
                          <Box
                            as="button"
                            type="button"
                            onClick={() => setDurationKnown('known')}
                            px={3}
                            py={1.5}
                            borderRadius="md"
                            fontSize="xs"
                            fontWeight={durationKnown === 'known' ? 'bold' : 'medium'}
                            bg={durationKnown === 'known' ? primaryBtnBg : surfaceCream}
                            color={durationKnown === 'known' ? primaryBtnText : textMain}
                            border="1px solid"
                            borderColor={durationKnown === 'known' ? primaryBtnBg : borderSubtle}
                            cursor="pointer"
                          >
                            Waktu Diketahui
                          </Box>
                          <Box
                            as="button"
                            type="button"
                            onClick={() => {
                              setDurationKnown('unknown')
                              setDurationHours('')
                              if (formErrors.durationHours) {
                                setFormErrors((prev) => ({ ...prev, durationHours: '' }))
                              }
                            }}
                            px={3}
                            py={1.5}
                            borderRadius="md"
                            fontSize="xs"
                            fontWeight={durationKnown === 'unknown' ? 'bold' : 'medium'}
                            bg={durationKnown === 'unknown' ? primaryBtnBg : surfaceCream}
                            color={durationKnown === 'unknown' ? primaryBtnText : textMain}
                            border="1px solid"
                            borderColor={durationKnown === 'unknown' ? primaryBtnBg : borderSubtle}
                            cursor="pointer"
                          >
                            Tidak Diketahui / Ragu
                          </Box>
                        </HStack>

                        {durationKnown === 'known' ? (
                          <Box>
                            <HStack spacing={2} align="center" flexWrap="wrap">
                              <Box
                                as="input"
                                type="number"
                                step="0.5"
                                min="0"
                                max="720"
                                value={durationHours}
                                onChange={(e) => {
                                  setDurationHours(e.target.value)
                                  if (formErrors.durationHours) {
                                    setFormErrors((prev) => ({ ...prev, durationHours: '' }))
                                  }
                                }}
                                placeholder="Mis. 3"
                                w="110px"
                                px={3}
                                py={1.5}
                                fontSize="sm"
                                bg={inputBg}
                                color={textMain}
                                borderRadius="lg"
                                border="1px solid"
                                borderColor={formErrors.durationHours ? redStatus : borderSubtle}
                              />
                              <Text fontSize="xs" fontWeight="semibold" color={textMuted}>
                                jam
                              </Text>

                              <HStack spacing={1}>
                                {['1', '2', '4', '6', '12', '24'].map((hr) => (
                                  <Box
                                    as="button"
                                    type="button"
                                    key={hr}
                                    onClick={() => {
                                      setDurationHours(hr)
                                      if (formErrors.durationHours) {
                                        setFormErrors((prev) => ({ ...prev, durationHours: '' }))
                                      }
                                    }}
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                    fontSize="11px"
                                    fontWeight="semibold"
                                    bg={durationHours === hr ? surfaceInteractive : surfaceCream}
                                    border="1px solid"
                                    borderColor={durationHours === hr ? primaryGreen : borderSubtle}
                                    color={textMain}
                                    cursor="pointer"
                                  >
                                    {hr}j
                                  </Box>
                                ))}
                              </HStack>
                            </HStack>
                            {formErrors.durationHours && (
                              <Text fontSize="xs" color={redStatus} fontWeight="semibold" mt={1}>
                                {formErrors.durationHours}
                              </Text>
                            )}
                          </Box>
                        ) : (
                          <Text fontSize="xs" color={textMuted} lineHeight="1.5">
                            Bila waktu tidak diketahui, CuPI akan memberikan status{' '}
                            <Box as="span" fontWeight="semibold" color={textMain}>
                              Perlu informasi tambahan
                            </Box>{' '}
                            dan tidak mengasumsikan makanan aman.
                          </Text>
                        )}
                      </Box>

                      {/* Pilihan Tempat & Suhu Penyimpanan */}
                      <Box>
                        <Text fontSize="xs" fontWeight="semibold" mb={2}>
                          Kondisi Penyimpanan
                        </Text>
                        <VStack spacing={1.5} align="stretch">
                          {STORAGE_OPTIONS.map((opt) => {
                            const selected = storageId === opt.id
                            return (
                              <Flex
                                as="button"
                                type="button"
                                key={opt.id}
                                onClick={() => setStorageId(opt.id)}
                                align="center"
                                justify="space-between"
                                px={3}
                                py={2}
                                textAlign="left"
                                borderRadius="lg"
                                bg={selected ? surfaceInteractive : surfaceCream}
                                border="1px solid"
                                borderColor={selected ? primaryGreen : borderSubtle}
                                cursor="pointer"
                                _hover={{ borderColor: borderStrong }}
                              >
                                <Box pr={2}>
                                  <Text fontSize="xs" fontWeight="bold" color={textMain}>
                                    {opt.label}
                                  </Text>
                                  <Text fontSize="11px" color={textMuted}>
                                    {opt.desc}
                                  </Text>
                                </Box>
                                <Box
                                  w="12px"
                                  h="12px"
                                  borderRadius="full"
                                  border="2px solid"
                                  borderColor={selected ? primaryGreen : borderStrong}
                                  bg={selected ? primaryGreen : 'transparent'}
                                  flexShrink={0}
                                />
                              </Flex>
                            )
                          })}
                        </VStack>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  {/* Garis Pemisah Seksi */}
                  <Box borderTop="1px solid" borderColor={borderSubtle} />

                  {/* SEKSI 3: Observasi Indera & Foto Konteks Visual */}
                  <SimpleGrid columns={{ base: 1, md: 12 }} spacing={5}>
                    {/* Observasi Indera (7 Kolom) */}
                    <Box gridColumn={{ base: 'span 1', md: 'span 7' }}>
                      <Text fontSize="xs" fontWeight="bold" color={primaryGreen} mb={1}>
                        3. Observasi Indera (Bau, Tekstur, Warna)
                      </Text>
                      <Text fontSize="11px" color={textMuted} mb={2.5}>
                        Centang bila ada perubahan fisik. Biarkan kosong bila tidak ditemukan tanda di bawah.
                      </Text>

                      <VStack spacing={1.5} align="stretch">
                        {SENSORY_CHECKS.map((chk) => {
                          const checked = sensoryFlags.includes(chk.id)
                          return (
                            <Flex
                              as="button"
                              type="button"
                              key={chk.id}
                              onClick={() => handleToggleSensoryFlag(chk.id)}
                              align="center"
                              justify="space-between"
                              px={3}
                              py={2}
                              textAlign="left"
                              borderRadius="lg"
                              bg={checked ? redBg : surfaceCream}
                              border="1px solid"
                              borderColor={checked ? redStatus : borderSubtle}
                              cursor="pointer"
                            >
                              <Box pr={2}>
                                <Text
                                  fontSize="xs"
                                  fontWeight="bold"
                                  color={checked ? redText : textMain}
                                >
                                  {chk.label}
                                </Text>
                                <Text fontSize="11px" color={textMuted}>
                                  {chk.detail}
                                </Text>
                              </Box>
                              <Flex
                                w="16px"
                                h="16px"
                                align="center"
                                justify="center"
                                borderRadius="sm"
                                border="1.5px solid"
                                borderColor={checked ? redStatus : borderStrong}
                                bg={checked ? redStatus : 'transparent'}
                                color="#FFFFFF"
                                flexShrink={0}
                              >
                                {checked && (
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </Flex>
                            </Flex>
                          )
                        })}

                        <Flex
                          as="button"
                          type="button"
                          onClick={handleToggleSensoryUnknown}
                          align="center"
                          justify="space-between"
                          px={3}
                          py={2}
                          textAlign="left"
                          borderRadius="lg"
                          bg={sensoryUnknown ? amberBg : surfaceCream}
                          border="1px solid"
                          borderColor={sensoryUnknown ? amberStatus : borderSubtle}
                          cursor="pointer"
                        >
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color={sensoryUnknown ? amberText : textMain}
                          >
                            Belum memeriksa aroma/tekstur secara langsung
                          </Text>
                          <Box
                            w="14px"
                            h="14px"
                            borderRadius="sm"
                            border="1.5px solid"
                            borderColor={sensoryUnknown ? amberStatus : borderStrong}
                            bg={sensoryUnknown ? amberStatus : 'transparent'}
                            flexShrink={0}
                          />
                        </Flex>
                      </VStack>
                    </Box>

                    {/* Unggah Foto Konteks Visual & Catatan (5 Kolom) */}
                    <Box gridColumn={{ base: 'span 1', md: 'span 5' }}>
                      <Text fontSize="xs" fontWeight="bold" color={primaryGreen} mb={1}>
                        4. Foto Konteks Visual & Catatan (Opsional)
                      </Text>
                      <Text fontSize="11px" color={textMuted} mb={2.5}>
                        Sebagai dokumentasi riwayat, bukan penentu tunggal keamanan.
                      </Text>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                      />

                      {!imagePreview ? (
                        <Flex
                          direction="column"
                          align="center"
                          justify="center"
                          p={3.5}
                          textAlign="center"
                          borderRadius="lg"
                          bg={isDraggingFile ? surfaceInteractive : surfaceCream}
                          border="1.5px dashed"
                          borderColor={
                            uploadError
                              ? redStatus
                              : isDraggingFile
                              ? primaryGreen
                              : borderStrong
                          }
                          cursor="pointer"
                          onClick={() =>
                            fileInputRef.current && fileInputRef.current.click()
                          }
                          onDragOver={(e) => {
                            e.preventDefault()
                            setIsDraggingFile(true)
                          }}
                          onDragLeave={() => setIsDraggingFile(false)}
                          onDrop={(e) => {
                            e.preventDefault()
                            setIsDraggingFile(false)
                            const file =
                              e.dataTransfer.files && e.dataTransfer.files[0]
                            if (file) handleFileProcess(file)
                          }}
                          _hover={{ borderColor: primaryGreen, bg: surfaceInteractive }}
                        >
                          <Box color={primaryGreen} mb={1}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </Box>
                          <Text fontSize="xs" fontWeight="bold" color={textMain}>
                            Pilih foto makanan (opsional)
                          </Text>
                          <Text fontSize="11px" color={textMuted}>
                            JPG, PNG, WEBP • Maks. 4 MB
                          </Text>
                        </Flex>
                      ) : (
                        <Flex
                          align="center"
                          gap={3}
                          p={2.5}
                          borderRadius="lg"
                          bg={surfaceCream}
                          border="1px solid"
                          borderColor={borderStrong}
                        >
                          <Box
                            as="img"
                            src={imagePreview}
                            alt="Preview makanan"
                            w="54px"
                            h="54px"
                            objectFit="cover"
                            borderRadius="md"
                            flexShrink={0}
                          />
                          <Box flex="1" minW={0}>
                            <Text fontSize="xs" fontWeight="bold" color={textMain} isTruncated>
                              {imageFileName || 'Foto Terlampir'}
                            </Text>
                            <HStack spacing={2.5} mt={1}>
                              <Box
                                as="button"
                                type="button"
                                onClick={() =>
                                  fileInputRef.current && fileInputRef.current.click()
                                }
                                fontSize="11px"
                                fontWeight="semibold"
                                color={primaryGreen}
                              >
                                Ganti
                              </Box>
                              <Box
                                as="button"
                                type="button"
                                onClick={handleRemoveImage}
                                fontSize="11px"
                                fontWeight="semibold"
                                color={redStatus}
                              >
                                Hapus
                              </Box>
                            </HStack>
                          </Box>
                        </Flex>
                      )}

                      {uploadError && (
                        <Text fontSize="xs" color={redStatus} fontWeight="semibold" mt={1}>
                          {uploadError}
                        </Text>
                      )}

                      <Box mt={3}>
                        <Text
                          as="label"
                          htmlFor="notes-textarea"
                          fontSize="xs"
                          fontWeight="semibold"
                          display="block"
                          mb={1}
                        >
                          Catatan Tambahan
                        </Text>
                        <Box
                          as="textarea"
                          id="notes-textarea"
                          rows={2}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Mis. Sudah pernah dipanaskan 1 kali..."
                          w="100%"
                          px={3}
                          py={2}
                          fontSize="xs"
                          bg={inputBg}
                          color={textMain}
                          borderRadius="lg"
                          border="1px solid"
                          borderColor={borderSubtle}
                        />
                      </Box>
                    </Box>
                  </SimpleGrid>
                </VStack>
              </Card>

              {/* ============================================================ */}
              {/* AREA HASIL PEMERIKSAAN (LEMBAR DIAGNOSTIK TERSTRUKTUR)       */}
              {/* ============================================================ */}
              {assessmentResult && (
                <Box
                  ref={resultSectionRef}
                  animation="pageFadeUp 0.32s cubic-bezier(0.16, 1, 0.3, 1) both"
                >
                  <Card
                    surface="cream"
                    status={assessmentResult.status}
                    title={`Hasil Pemeriksaan: ${assessmentResult.foodName}`}
                    subtitle={`${assessmentResult.categoryLabel} • Diperiksa ${assessmentResult.createdAt}`}
                    badge={assessmentResult.status}
                    footer={
                      <Flex
                        w="100%"
                        align="center"
                        justify="space-between"
                        flexWrap="wrap"
                        gap={3}
                      >
                        <Text fontSize="11px" color={textMuted}>
                          Panduan CuPI berdasarkan waktu, suhu, dan observasi pengguna (bukan pengganti uji laboratorium).
                        </Text>

                        <HStack spacing={2}>
                          {!isResultSaved ? (
                            <Box
                              as="button"
                              type="button"
                              onClick={handleSaveToHistoryManual}
                              px={3.5}
                              py={1.5}
                              borderRadius="lg"
                              bg={primaryBtnBg}
                              color={primaryBtnText}
                              fontSize="xs"
                              fontWeight="bold"
                              cursor="pointer"
                            >
                              Simpan ke History Track
                            </Box>
                          ) : (
                            <Text fontSize="xs" fontWeight="bold" color={primaryGreen}>
                              ✓ Tersimpan di History Track
                            </Text>
                          )}

                          <Box
                            as="button"
                            type="button"
                            onClick={() => setActiveNav('History Track')}
                            px={3}
                            py={1.5}
                            borderRadius="lg"
                            bg={surfaceSage}
                            border="1px solid"
                            borderColor={borderSubtle}
                            fontSize="xs"
                            fontWeight="bold"
                            color={textMain}
                            cursor="pointer"
                            _hover={{ bg: surfaceInteractive }}
                          >
                            Lihat History Track →
                          </Box>
                        </HStack>
                      </Flex>
                    }
                  >
                    {/* Ringkasan Utama Status */}
                    <Flex
                      align="flex-start"
                      gap={3.5}
                      p={3.5}
                      borderRadius="xl"
                      bg={getStatusTokens(assessmentResult.status).bg}
                      mb={4}
                    >
                      {assessmentResult.imagePreview && (
                        <Box
                          as="img"
                          src={assessmentResult.imagePreview}
                          alt={assessmentResult.foodName}
                          w="64px"
                          h="64px"
                          objectFit="cover"
                          borderRadius="lg"
                          flexShrink={0}
                        />
                      )}
                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color={getStatusTokens(assessmentResult.status).text}
                          lineHeight="1.5"
                        >
                          {assessmentResult.summary}
                        </Text>
                        <Text fontSize="xs" color={textMuted} mt={1} lineHeight="1.55">
                          {assessmentResult.reasoning}
                        </Text>
                      </Box>
                    </Flex>

                    {/* Rincian Baris Diagnostik (Tanpa Grid Kartu Seragam) */}
                    <VStack
                      spacing={3}
                      align="stretch"
                      divider={<Box borderTop="1px solid" borderColor={borderSubtle} />}
                    >
                      <Flex
                        direction={{ base: 'column', sm: 'row' }}
                        justify="space-between"
                        gap={1}
                      >
                        <Text fontSize="xs" fontWeight="bold" color={primaryGreen} minW="210px">
                          Faktor Waktu & Penyimpanan
                        </Text>
                        <Text fontSize="xs" color={textMain} flex="1" lineHeight="1.55">
                          {assessmentResult.timeStorageFactor}
                        </Text>
                      </Flex>

                      <Flex
                        direction={{ base: 'column', sm: 'row' }}
                        justify="space-between"
                        gap={1}
                      >
                        <Text fontSize="xs" fontWeight="bold" color={primaryGreen} minW="210px">
                          Temuan Visual & Indera
                        </Text>
                        <Text fontSize="xs" color={textMain} flex="1" lineHeight="1.55">
                          {assessmentResult.sensoryFactor}
                        </Text>
                      </Flex>

                      <Flex
                        direction={{ base: 'column', sm: 'row' }}
                        justify="space-between"
                        gap={1}
                      >
                        <Text fontSize="xs" fontWeight="bold" color={primaryGreen} minW="210px">
                          Rekomendasi Tindakan
                        </Text>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color={textMain}
                          flex="1"
                          lineHeight="1.55"
                        >
                          {assessmentResult.recommendation}
                        </Text>
                      </Flex>

                      {profile.showWasteGuidance && assessmentResult.wasteGuidance && (
                        <Flex
                          direction={{ base: 'column', sm: 'row' }}
                          justify="space-between"
                          gap={1}
                        >
                          <Text fontSize="xs" fontWeight="bold" color={primaryGreen} minW="210px">
                            Pencegahan Food Waste
                          </Text>
                          <Text fontSize="xs" color={textMuted} flex="1" lineHeight="1.55">
                            {assessmentResult.wasteGuidance}
                          </Text>
                        </Flex>
                      )}
                    </VStack>
                  </Card>
                </Box>
              )}
            </VStack>
          )}

          {/* ============================================================== */}
          {/* 2. HALAMAN HISTORY TRACK (CATATAN RIWAYAT YANG DAPAT DITELUSURI) */}
          {/* ============================================================== */}
          {activeNav === 'History Track' && (
            <VStack spacing={5} align="stretch" w="100%">
              <Flex
                direction={{ base: 'column', sm: 'row' }}
                align={{ base: 'flex-start', sm: 'flex-end' }}
                justify="space-between"
                gap={3}
                px={1}
              >
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="0.05em"
                    color={primaryGreen}
                  >
                    History Track • Penyimpanan Browser Lokal
                  </Text>
                  <Text
                    fontFamily="'Figtree', sans-serif"
                    fontSize={{ base: '2xl', sm: '3xl' }}
                    fontWeight="extrabold"
                    color={textMain}
                    lineHeight="1.2"
                    mt={1}
                  >
                    Catatan Riwayat Pemeriksaan Makanan
                  </Text>
                </Box>

                <Box
                  as="button"
                  type="button"
                  onClick={() => setActiveNav('CuPI')}
                  px={4}
                  py={2}
                  borderRadius="lg"
                  bg={primaryBtnBg}
                  color={primaryBtnText}
                  fontSize="xs"
                  fontWeight="bold"
                  cursor="pointer"
                  _hover={{ bg: primaryBtnHover }}
                >
                  + Pemeriksaan Baru
                </Box>
              </Flex>

              {/* Bar Pencarian & Filter Status */}
              <Card surface="sage" compact>
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  align={{ base: 'stretch', md: 'center' }}
                  justify="space-between"
                  gap={3}
                >
                  <Box
                    as="input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama makanan atau kategori..."
                    w={{ base: '100%', md: '280px' }}
                    px={3}
                    py={1.5}
                    fontSize="xs"
                    bg={inputBg}
                    color={textMain}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={borderSubtle}
                  />

                  <HStack spacing={1.5} flexWrap="wrap">
                    {[
                      'Semua',
                      'Perlu perhatian',
                      'Risiko terindikasi',
                      'Perlu informasi tambahan',
                      'Tidak dapat dinilai',
                    ].map((st) => {
                      const active = statusFilter === st
                      return (
                        <Box
                          as="button"
                          type="button"
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          px={2.5}
                          py={1}
                          borderRadius="md"
                          fontSize="11px"
                          fontWeight={active ? 'bold' : 'medium'}
                          bg={active ? primaryBtnBg : surfaceCream}
                          color={active ? primaryBtnText : textMuted}
                          border="1px solid"
                          borderColor={active ? primaryBtnBg : borderSubtle}
                          cursor="pointer"
                        >
                          {st}
                        </Box>
                      )
                    })}
                  </HStack>
                </Flex>
              </Card>

              {/* Daftar Log Riwayat Vertikal */}
              {filteredHistory.length === 0 ? (
                <Card
                  surface="cream"
                  title="Belum Ada Catatan Pemeriksaan"
                  description={
                    historyList.length === 0
                      ? 'Riwayat pemeriksaan lokal Anda masih kosong. Lakukan pemeriksaan makanan pertama di halaman CuPI.'
                      : 'Tidak ada catatan riwayat yang cocok dengan kata kunci atau filter status yang dipilih.'
                  }
                >
                  <HStack spacing={2.5} mt={2}>
                    {historyList.length > 0 && (
                      <Box
                        as="button"
                        type="button"
                        onClick={() => {
                          setSearchQuery('')
                          setStatusFilter('Semua')
                        }}
                        px={3}
                        py={1.5}
                        borderRadius="md"
                        bg={surfaceSage}
                        border="1px solid"
                        borderColor={borderSubtle}
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        Reset Filter
                      </Box>
                    )}
                    <Box
                      as="button"
                      type="button"
                      onClick={() => setActiveNav('CuPI')}
                      px={3.5}
                      py={1.5}
                      borderRadius="md"
                      bg={primaryBtnBg}
                      color={primaryBtnText}
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      Ke Halaman Pemeriksaan
                    </Box>
                  </HStack>
                </Card>
              ) : (
                <VStack spacing={3} align="stretch">
                  {filteredHistory.map((item) => {
                    const isExpanded = expandedHistoryId === item.id
                    return (
                      <Card
                        key={item.id}
                        surface={isExpanded ? 'cream' : 'sage'}
                        status={item.status}
                        isActive={isExpanded}
                        compact
                        onClick={() =>
                          setExpandedHistoryId((prev) =>
                            prev === item.id ? null : item.id
                          )
                        }
                        title={item.foodName}
                        subtitle={`${item.createdAt} • ${item.storageLabel}${
                          item.durationHours ? ` (${item.durationHours} jam)` : ''
                        }`}
                        badge={item.status}
                        headerAction={
                          item.isDemo ? (
                            <Box
                              px={2}
                              py={0.5}
                              borderRadius="sm"
                              bg={surfaceInteractive}
                              fontSize="10px"
                              fontWeight="bold"
                              color={textMuted}
                            >
                              Contoh data (Mode demo)
                            </Box>
                          ) : null
                        }
                      >
                        <Flex align="flex-start" gap={3}>
                          {item.imagePreview && (
                            <Box
                              as="img"
                              src={item.imagePreview}
                              alt={item.foodName}
                              w="48px"
                              h="48px"
                              objectFit="cover"
                              borderRadius="md"
                              flexShrink={0}
                            />
                          )}
                          <Text fontSize="xs" color={textMain} lineHeight="1.55" flex="1">
                            {item.summary}
                          </Text>
                        </Flex>

                        {/* Rincian Terbuka Saat Item Diklik */}
                        {isExpanded && (
                          <Box
                            mt={3.5}
                            pt={3}
                            borderTop="1px solid"
                            borderColor={borderSubtle}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <VStack spacing={2} align="stretch" fontSize="xs">
                              <Text color={textMain}>
                                <Box as="span" fontWeight="bold" color={primaryGreen}>
                                  Waktu & Suhu:{' '}
                                </Box>
                                {item.timeStorageFactor}
                              </Text>
                              <Text color={textMain}>
                                <Box as="span" fontWeight="bold" color={primaryGreen}>
                                  Observasi Indera:{' '}
                                </Box>
                                {item.sensoryFactor}
                              </Text>
                              <Text color={textMain}>
                                <Box as="span" fontWeight="bold" color={primaryGreen}>
                                  Rekomendasi:{' '}
                                </Box>
                                {item.recommendation}
                              </Text>
                              {item.notes && (
                                <Text color={textMuted}>
                                  <Box as="span" fontWeight="bold">
                                    Catatan:{' '}
                                  </Box>
                                  {item.notes}
                                </Text>
                              )}
                            </VStack>

                            <Flex justify="space-between" align="center" mt={3} pt={2}>
                              <Box
                                as="button"
                                type="button"
                                onClick={() => handleDeleteHistoryItem(item.id)}
                                fontSize="11px"
                                fontWeight="bold"
                                color={redStatus}
                                cursor="pointer"
                              >
                                Hapus Catatan Ini
                              </Box>
                              <Box
                                as="button"
                                type="button"
                                onClick={() => setExpandedHistoryId(null)}
                                fontSize="11px"
                                fontWeight="bold"
                                color={primaryGreen}
                                cursor="pointer"
                              >
                                Tutup Rincian
                              </Box>
                            </Flex>
                          </Box>
                        )}
                      </Card>
                    )
                  })}
                </VStack>
              )}
            </VStack>
          )}

          {/* ============================================================== */}
          {/* 3. HALAMAN PROFILE (SEDERHANA, FUNGSIONAL, TANPA DASHBOARD MINI) */}
          {/* ============================================================== */}
          {activeNav === 'Profile' && (
            <VStack spacing={5} align="stretch" w="100%" maxW="720px" mx="auto">
              <Box px={1}>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                  color={primaryGreen}
                >
                  Profile • Pengaturan Pengguna Lokal
                </Text>
                <Text
                  fontFamily="'Figtree', sans-serif"
                  fontSize={{ base: '2xl', sm: '3xl' }}
                  fontWeight="extrabold"
                  color={textMain}
                  mt={1}
                >
                  Profil & Preferensi CuPI
                </Text>
              </Box>

              {/* Kartu Identitas Pengguna Lokal */}
              <Card
                surface="sage"
                title={profile.displayName}
                subtitle={`${profile.contextRole} • Mode Penyimpanan Perangkat Lokal`}
                headerAction={
                  <Box
                    as="button"
                    type="button"
                    onClick={() => {
                      setProfileDraft(profile)
                      setIsEditingProfile((prev) => !prev)
                    }}
                    px={3}
                    py={1.5}
                    borderRadius="lg"
                    bg={isEditingProfile ? surfaceInteractive : primaryBtnBg}
                    color={isEditingProfile ? textMain : primaryBtnText}
                    fontSize="xs"
                    fontWeight="bold"
                    cursor="pointer"
                  >
                    {isEditingProfile ? 'Batal' : 'Ubah Profil'}
                  </Box>
                }
              >
                {profileFeedback && (
                  <Box
                    mb={3}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    bg={surfaceInteractive}
                    fontSize="xs"
                    fontWeight="bold"
                    color={primaryGreen}
                  >
                    {profileFeedback}
                  </Box>
                )}

                <HStack spacing={3.5}>
                  <Flex
                    w="48px"
                    h="48px"
                    borderRadius="xl"
                    bg={primaryBtnBg}
                    color={primaryBtnText}
                    align="center"
                    justify="center"
                    fontFamily="'Figtree', sans-serif"
                    fontSize="lg"
                    fontWeight="extrabold"
                    flexShrink={0}
                  >
                    {userInitials}
                  </Flex>
                  <Box fontSize="xs" color={textMuted}>
                    <Text color={textMain} fontWeight="semibold">
                      Catatan Kontak / Label Lokal:{' '}
                      {profile.contactNote ? profile.contactNote : 'Belum diisi (opsional)'}
                    </Text>
                    <Text mt={0.5}>
                      Tidak memerlukan login akun. Data hanya disimpan pada browser perangkat ini.
                    </Text>
                  </Box>
                </HStack>

                {isEditingProfile && (
                  <Box
                    as="form"
                    onSubmit={handleSaveProfile}
                    mt={4}
                    pt={4}
                    borderTop="1px solid"
                    borderColor={borderSubtle}
                  >
                    <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3} mb={3}>
                      <Box>
                        <Text fontSize="xs" fontWeight="semibold" mb={1}>
                          Nama Tampilan
                        </Text>
                        <Box
                          as="input"
                          type="text"
                          value={profileDraft.displayName}
                          onChange={(e) =>
                            setProfileDraft((prev) => ({
                              ...prev,
                              displayName: e.target.value,
                            }))
                          }
                          w="100%"
                          px={3}
                          py={1.5}
                          fontSize="xs"
                          bg={inputBg}
                          borderRadius="md"
                          border="1px solid"
                          borderColor={borderSubtle}
                        />
                      </Box>

                      <Box>
                        <Text fontSize="xs" fontWeight="semibold" mb={1}>
                          Konteks Penggunaan
                        </Text>
                        <Box
                          as="input"
                          type="text"
                          value={profileDraft.contextRole}
                          onChange={(e) =>
                            setProfileDraft((prev) => ({
                              ...prev,
                              contextRole: e.target.value,
                            }))
                          }
                          w="100%"
                          px={3}
                          py={1.5}
                          fontSize="xs"
                          bg={inputBg}
                          borderRadius="md"
                          border="1px solid"
                          borderColor={borderSubtle}
                        />
                      </Box>

                      <Box>
                        <Text fontSize="xs" fontWeight="semibold" mb={1}>
                          Email / Catatan Lokal
                        </Text>
                        <Box
                          as="input"
                          type="text"
                          value={profileDraft.contactNote}
                          onChange={(e) =>
                            setProfileDraft((prev) => ({
                              ...prev,
                              contactNote: e.target.value,
                            }))
                          }
                          placeholder="Opsional"
                          w="100%"
                          px={3}
                          py={1.5}
                          fontSize="xs"
                          bg={inputBg}
                          borderRadius="md"
                          border="1px solid"
                          borderColor={borderSubtle}
                        />
                      </Box>
                    </SimpleGrid>

                    <Flex justify="flex-end">
                      <Box
                        as="button"
                        type="submit"
                        px={4}
                        py={1.5}
                        borderRadius="md"
                        bg={primaryBtnBg}
                        color={primaryBtnText}
                        fontSize="xs"
                        fontWeight="bold"
                        cursor="pointer"
                      >
                        Simpan Profil
                      </Box>
                    </Flex>
                  </Box>
                )}
              </Card>

              {/* Daftar Preferensi Fungsional dengan Divider Bersih */}
              <Card
                surface="sage"
                title="Preferensi Pemeriksaan & Tampilan"
                subtitle="Mengatur perilaku evaluasi kondisi makanan dan penyimpanan riwayat."
                footer={
                  <Flex align="center" justify="space-between" flexWrap="wrap" gap={2}>
                    <Text fontSize="xs" color={textMuted}>
                      Riwayat tersimpan di browser: {historyList.length} item
                    </Text>

                    {!confirmClearHistory ? (
                      <Box
                        as="button"
                        type="button"
                        onClick={() => setConfirmClearHistory(true)}
                        fontSize="xs"
                        fontWeight="bold"
                        color={redStatus}
                        cursor="pointer"
                      >
                        Kosongkan Riwayat Lokal
                      </Box>
                    ) : (
                      <HStack spacing={2}>
                        <Box
                          as="button"
                          type="button"
                          onClick={() => {
                            setHistoryList([])
                            setExpandedHistoryId(null)
                            setConfirmClearHistory(false)
                          }}
                          px={2.5}
                          py={1}
                          borderRadius="md"
                          bg={redStatus}
                          color="#FFFFFF"
                          fontSize="xs"
                          fontWeight="bold"
                        >
                          Ya, Hapus Semua
                        </Box>
                        <Box
                          as="button"
                          type="button"
                          onClick={() => setConfirmClearHistory(false)}
                          px={2.5}
                          py={1}
                          borderRadius="md"
                          bg={surfaceCream}
                          fontSize="xs"
                          fontWeight="semibold"
                        >
                          Batal
                        </Box>
                      </HStack>
                    )}
                  </Flex>
                }
              >
                <VStack
                  spacing={3.5}
                  align="stretch"
                  divider={<Box borderTop="1px solid" borderColor={borderSubtle} />}
                >
                  <Flex align="center" justify="space-between" gap={3}>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color={textMain}>
                        Tema Tampilan (Light / Dark)
                      </Text>
                      <Text fontSize="11px" color={textMuted}>
                        {colorMode === 'light'
                          ? 'Mode Terang aktif (Fresh Botanical Leaf & Warm Cream)'
                          : 'Mode Gelap aktif (Deep Forest Green)'}
                      </Text>
                    </Box>
                    <Box
                      as="button"
                      type="button"
                      onClick={toggleColorMode}
                      px={3}
                      py={1.5}
                      borderRadius="md"
                      bg={surfaceCream}
                      border="1px solid"
                      borderColor={borderStrong}
                      fontSize="xs"
                      fontWeight="bold"
                      color={textMain}
                      cursor="pointer"
                    >
                      Ubah ke {colorMode === 'light' ? 'Dark' : 'Light'}
                    </Box>
                  </Flex>

                  <Flex align="center" justify="space-between" gap={3}>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color={textMain}>
                        Simpan Otomatis ke History Track
                      </Text>
                      <Text fontSize="11px" color={textMuted}>
                        Simpan setiap hasil pemeriksaan baru ke riwayat perangkat secara langsung.
                      </Text>
                    </Box>
                    <Box
                      as="button"
                      type="button"
                      onClick={() => handlePreferenceToggle('autoSaveHistory')}
                      px={3}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="bold"
                      bg={profile.autoSaveHistory ? primaryBtnBg : surfaceCream}
                      color={profile.autoSaveHistory ? primaryBtnText : textMuted}
                      border="1px solid"
                      borderColor={profile.autoSaveHistory ? primaryBtnBg : borderSubtle}
                      cursor="pointer"
                    >
                      {profile.autoSaveHistory ? 'Aktif' : 'Nonaktif'}
                    </Box>
                  </Flex>

                  <Flex align="center" justify="space-between" gap={3}>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color={textMain}>
                        Batas Peringatan Dini Suhu Ruang (2 Jam)
                      </Text>
                      <Text fontSize="11px" color={textMuted}>
                        Tandai status Perlu perhatian saat makanan matang berada di suhu ruang selama 2 jam.
                      </Text>
                    </Box>
                    <Box
                      as="button"
                      type="button"
                      onClick={() => handlePreferenceToggle('strictRoomTempAlert')}
                      px={3}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="bold"
                      bg={profile.strictRoomTempAlert ? primaryBtnBg : surfaceCream}
                      color={profile.strictRoomTempAlert ? primaryBtnText : textMuted}
                      border="1px solid"
                      borderColor={profile.strictRoomTempAlert ? primaryBtnBg : borderSubtle}
                      cursor="pointer"
                    >
                      {profile.strictRoomTempAlert ? 'Ketat (2 Jam)' : 'Standar'}
                    </Box>
                  </Flex>

                  <Flex align="center" justify="space-between" gap={3}>
                    <Box>
                      <Text fontSize="xs" fontWeight="bold" color={textMain}>
                        Panduan Pencegahan Food Waste Bertanggung Jawab
                      </Text>
                      <Text fontSize="11px" color={textMuted}>
                        Tampilkan saran pemanfaatan hanya saat waktu dan suhu makanan masih memenuhi syarat.
                      </Text>
                    </Box>
                    <Box
                      as="button"
                      type="button"
                      onClick={() => handlePreferenceToggle('showWasteGuidance')}
                      px={3}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="bold"
                      bg={profile.showWasteGuidance ? primaryBtnBg : surfaceCream}
                      color={profile.showWasteGuidance ? primaryBtnText : textMuted}
                      border="1px solid"
                      borderColor={profile.showWasteGuidance ? primaryBtnBg : borderSubtle}
                      cursor="pointer"
                    >
                      {profile.showWasteGuidance ? 'Aktif' : 'Nonaktif'}
                    </Box>
                  </Flex>
                </VStack>
              </Card>
            </VStack>
          )}
        </Box>
      </Flex>

      {/* ================================================================== */}
      {/* FOOTER ADAPTIF                                                     */}
      {/* ================================================================== */}
      <Box
        as="footer"
        w="100%"
        bg={surfaceSage}
        borderTop="1px solid"
        borderColor={borderSubtle}
        py={4}
        px={6}
      >
        <Flex
          maxW="880px"
          mx="auto"
          direction={{ base: 'column', sm: 'row' }}
          align="center"
          justify="space-between"
          gap={2}
          fontSize="xs"
          color={textMuted}
        >
          <HStack spacing={2}>
            <Box w="6px" h="6px" borderRadius="full" bg={freshGreen} />
            <Text fontFamily="'Figtree', sans-serif" fontWeight="bold" color={textMain}>
              CuPI
            </Text>
            <Text>• Food Condition & Safety Assistant</Text>
          </HStack>

          <Text textAlign="center">
            Riwayat waktu & suhu penyimpanan adalah penentu utama keamanan pangan
          </Text>
        </Flex>
      </Box>
    </Flex>
  )
}

export default App