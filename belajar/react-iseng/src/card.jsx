import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

function Card({
  title = '',
  subtitle = '',
  description = '',
  icon = null,
  badge = null,
  headerAction = null,
  footer = null,
  children = null,
  surface = 'sage',
  status = '',
  isActive = false,
  compact = false,
  onClick,
  ...rest
}) {
  // Palet Permukaan CuPI: Pale Sage & Warm Cream
  const sageSurface = useColorModeValue('#F0F5ED', '#15251B')
  const creamSurface = useColorModeValue('#F6F4E9', '#1A2D21')
  const activeSurface = useColorModeValue('#E2EFE0', '#1E3426')

  const borderDefault = useColorModeValue('#C5D7C0', '#273F30')
  const borderActive = useColorModeValue('#285B3D', '#78A96B')

  const textMain = useColorModeValue('#203329', '#EEF3EC')
  const textMuted = useColorModeValue('#65766A', '#9BB0A1')
  const primaryGreen = useColorModeValue('#285B3D', '#78A96B')

  // Token Warna Status Keamanan Pangan
  const amberAccent = useColorModeValue('#D99A38', '#E5AC4C')
  const amberBadgeBg = useColorModeValue('#F7EEDB', '#322614')
  const amberBadgeText = useColorModeValue('#6B460B', '#F6D594')

  const redAccent = useColorModeValue('#B9574F', '#DF7870')
  const redBadgeBg = useColorModeValue('#F6E5E3', '#351A19')
  const redBadgeText = useColorModeValue('#70231D', '#F6B6B1')

  const infoAccent = useColorModeValue('#4A6B54', '#88AE93')
  const infoBadgeBg = useColorModeValue('#E2ECE3', '#1E3326')
  const infoBadgeText = useColorModeValue('#1F3828', '#D4E6DA')

  const cardShadow = useColorModeValue(
    '0 2px 10px rgba(32, 51, 41, 0.04), 0 1px 2px rgba(32, 51, 41, 0.03)',
    '0 6px 18px rgba(3, 8, 5, 0.45), 0 2px 4px rgba(3, 8, 5, 0.35)'
  )
  const hoverShadow = useColorModeValue(
    '0 6px 16px rgba(32, 51, 41, 0.07), 0 2px 4px rgba(32, 51, 41, 0.04)',
    '0 10px 22px rgba(3, 8, 5, 0.65), 0 3px 6px rgba(3, 8, 5, 0.45)'
  )

  const resolvedBg = isActive
    ? activeSurface
    : surface === 'cream'
    ? creamSurface
    : sageSurface

  let statusAccent = primaryGreen
  let badgeBg = infoBadgeBg
  let badgeColor = infoBadgeText

  if (status === 'Risiko terindikasi') {
    statusAccent = redAccent
    badgeBg = redBadgeBg
    badgeColor = redBadgeText
  } else if (status === 'Perlu perhatian') {
    statusAccent = amberAccent
    badgeBg = amberBadgeBg
    badgeColor = amberBadgeText
  } else if (
    status === 'Perlu informasi tambahan' ||
    status === 'Tidak dapat dinilai'
  ) {
    statusAccent = infoAccent
    badgeBg = infoBadgeBg
    badgeColor = infoBadgeText
  }

  const isInteractive = typeof onClick === 'function'

  const handleKeyDown = (event) => {
    if (!isInteractive) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick(event)
    }
  }

  return (
    <Flex
      data-cupi-el="true"
      direction="column"
      justify="space-between"
      pos="relative"
      overflow="hidden"
      w="100%"
      p={compact ? { base: 3.5, sm: 4 } : { base: 5, sm: 6 }}
      bg={resolvedBg}
      color={textMain}
      borderRadius={compact ? 'xl' : '2xl'}
      border="1px solid"
      borderColor={
        isActive ? borderActive : status ? statusAccent : borderDefault
      }
      boxShadow={cardShadow}
      cursor={isInteractive ? 'pointer' : 'default'}
      userSelect={isInteractive ? 'none' : 'auto'}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      transition="background-color 0.34s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s ease, box-shadow 0.22s ease, transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)"
      _hover={
        isInteractive
          ? {
              transform: 'translateY(-1.5px)',
              boxShadow: hoverShadow,
              borderColor: status ? statusAccent : borderActive,
            }
          : undefined
      }
      _active={
        isInteractive
          ? {
              transform: 'translateY(0)',
            }
          : undefined
      }
      _focusVisible={
        isInteractive
          ? {
              outline: '2px solid',
              outlineColor: primaryGreen,
              outlineOffset: '2px',
            }
          : undefined
      }
      {...rest}
    >
      {/* Garis Penanda Status di Sisi Kiri Hanya Jika Kartu Memiliki Status Keamanan Pangan */}
      {status && (
        <Box
          pos="absolute"
          top={0}
          bottom={0}
          left={0}
          w="4px"
          bg={statusAccent}
        />
      )}

      <Box pl={status ? 1.5 : 0}>
        {(title || subtitle || icon || badge || headerAction) && (
          <Flex
            align="flex-start"
            justify="space-between"
            gap={3}
            mb={description || children ? (compact ? 2.5 : 4) : 0}
            flexWrap="wrap"
          >
            <HStack spacing={3} align="flex-start">
              {icon && (
                <Flex
                  w="36px"
                  h="36px"
                  flexShrink={0}
                  align="center"
                  justify="center"
                  borderRadius="lg"
                  bg={creamSurface}
                  color={primaryGreen}
                  border="1px solid"
                  borderColor={borderDefault}
                >
                  {icon}
                </Flex>
              )}

              <Box>
                {title && (
                  <Text
                    fontFamily="'Figtree', sans-serif"
                    fontSize={compact ? 'sm' : { base: 'md', sm: 'lg' }}
                    fontWeight="bold"
                    color={textMain}
                    lineHeight="1.3"
                  >
                    {title}
                  </Text>
                )}
                {subtitle && (
                  <Text fontSize="xs" color={textMuted} mt={0.5}>
                    {subtitle}
                  </Text>
                )}
              </Box>
            </HStack>

            <HStack spacing={2} flexWrap="wrap">
              {headerAction}
              {badge && (
                <Box
                  px={2.5}
                  py={0.5}
                  borderRadius="md"
                  bg={badgeBg}
                  border="1px solid"
                  borderColor={statusAccent}
                  fontSize="11px"
                  fontWeight="bold"
                  color={badgeColor}
                  flexShrink={0}
                >
                  {badge}
                </Box>
              )}
            </HStack>
          </Flex>
        )}

        {description && (
          <Text fontSize="xs" color={textMuted} lineHeight="1.6">
            {description}
          </Text>
        )}

        {children && <Box mt={description ? 3 : 0}>{children}</Box>}
      </Box>

      {footer && (
        <Box
          pl={status ? 1.5 : 0}
          mt={compact ? 3 : 5}
          pt={3}
          borderTop="1px solid"
          borderColor={borderDefault}
        >
          {footer}
        </Box>
      )}
    </Flex>
  )
}

export default Card