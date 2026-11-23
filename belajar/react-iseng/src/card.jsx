import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

function Card({
  title = 'Belajar',
  description = '',
  icon = null,
  badge = null,
  footer = null,
  children = null,
  isActive = false,
  compact = false,
  variant = 'default',
  metricValue = null,
  metricUnit = '',
  metricSubtext = '',
  onClick,
  ...rest
}) {
  // Palet Fresh Botanical (Light) & Deep Forest Green (Dark)
  const featuredBg = useColorModeValue('#D8EAD4', '#1D3324')
  const panelBg = useColorModeValue('#E5F1E2', '#17281D')
  const compactBg = useColorModeValue('#E8F3E5', '#17281D')
  const activeBg = useColorModeValue('#CFE4CA', '#223B2A')

  const resolvedBg =
    variant === 'featured'
      ? featuredBg
      : isActive
      ? activeBg
      : compact
      ? compactBg
      : panelBg

  const borderDefault = useColorModeValue('#B5D0B2', '#36533C')
  const borderActive = useColorModeValue('#397A46', '#91C887')
  const borderHover = useColorModeValue('#589464', '#79B470')

  const textMain = useColorModeValue('#193B28', '#EAF3E7')
  const textMuted = useColorModeValue('#4E6D54', '#A9BDA8')
  const accentColor = useColorModeValue('#397A46', '#91C887')

  const iconSurface = useColorModeValue('#C8E0C4', '#243B2A')
  const iconActiveBg = useColorModeValue('#397A46', '#91C887')
  const iconActiveColor = useColorModeValue('#F4FAF2', '#101D15')

  const badgeBg = useColorModeValue('#C5DFC1', '#2B4931')
  const dividerColor = useColorModeValue('#BDCEB9', '#2E4935')

  const baseShadow = useColorModeValue(
    '0 2px 10px rgba(25, 59, 40, 0.05), 0 1px 3px rgba(25, 59, 40, 0.03)',
    '0 6px 18px rgba(5, 11, 8, 0.45), 0 2px 4px rgba(5, 11, 8, 0.35)'
  )
  const hoverShadow = useColorModeValue(
    '0 10px 24px rgba(25, 59, 40, 0.10), 0 3px 8px rgba(25, 59, 40, 0.05)',
    '0 12px 28px rgba(5, 11, 8, 0.65), 0 4px 10px rgba(5, 11, 8, 0.45)'
  )

  const isInteractive = typeof onClick === 'function'
  const isKpi = variant === 'kpi' || metricValue !== null

  const handleKeyDown = (event) => {
    if (!isInteractive) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick(event)
    }
  }

  return (
    <Flex
      data-theme-transition="true"
      direction="column"
      justify="space-between"
      pos="relative"
      overflow="hidden"
      w="100%"
      p={compact ? 4 : { base: 5, sm: 6 }}
      bg={resolvedBg}
      color={textMain}
      borderRadius={compact ? 'xl' : '2xl'}
      border="1px solid"
      borderColor={isActive ? borderActive : borderDefault}
      boxShadow={baseShadow}
      cursor={isInteractive ? 'pointer' : 'default'}
      userSelect={isInteractive ? 'none' : 'auto'}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      transition="background-color 0.48s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease, color 0.4s ease, box-shadow 0.25s ease, transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)"
      _hover={
        isInteractive
          ? {
              transform: 'translateY(-3px)',
              borderColor: borderHover,
              boxShadow: hoverShadow,
            }
          : undefined
      }
      _active={
        isInteractive
          ? {
              transform: 'translateY(0px) scale(0.99)',
            }
          : undefined
      }
      _focusVisible={
        isInteractive
          ? {
              outline: '2px solid',
              outlineColor: accentColor,
              outlineOffset: '2px',
            }
          : undefined
      }
      {...rest}
    >
      {/* Indikator Samping Halus untuk Featured Card atau Card yang Sedang Aktif */}
      {(variant === 'featured' || isActive) && (
        <Box
          pos="absolute"
          top={0}
          bottom={0}
          left={0}
          w={variant === 'featured' ? '5px' : '3.5px'}
          bg={accentColor}
        />
      )}

      <Box pl={variant === 'featured' || isActive ? 1.5 : 0}>
        {/* Anatomi 1: KPI / Stat Card */}
        {isKpi ? (
          <Box>
            <Flex align="center" justify="space-between" gap={2} mb={2.5}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={textMuted}
                letterSpacing="0.02em"
              >
                {title}
              </Text>
              {icon && (
                <Flex
                  data-theme-transition="true"
                  w="34px"
                  h="34px"
                  align="center"
                  justify="center"
                  borderRadius="lg"
                  bg={isActive ? iconActiveBg : iconSurface}
                  color={isActive ? iconActiveColor : textMain}
                >
                  {icon}
                </Flex>
              )}
            </Flex>

            <HStack align="baseline" spacing={1.5} my={1}>
              <Text
                fontFamily="'Figtree', 'IBM Plex Sans', sans-serif"
                fontSize={{ base: '2xl', md: '3xl' }}
                fontWeight="extrabold"
                color={textMain}
                lineHeight="1.1"
              >
                {metricValue}
              </Text>
              {metricUnit && (
                <Text fontSize="sm" fontWeight="bold" color={accentColor}>
                  {metricUnit}
                </Text>
              )}
            </HStack>

            {metricSubtext && (
              <Text fontSize="11px" color={textMuted} mt={1.5} lineHeight="1.4">
                {metricSubtext}
              </Text>
            )}
          </Box>
        ) : (
          /* Anatomi 2: Featured, Panel, atau Navigation Card */
          <Box>
            <Flex
              align="flex-start"
              justify="space-between"
              gap={3}
              mb={description || children ? 2.5 : 0}
            >
              <HStack spacing={3} align="center">
                {icon && (
                  <Flex
                    data-theme-transition="true"
                    w={compact ? '38px' : '42px'}
                    h={compact ? '38px' : '42px'}
                    flexShrink={0}
                    align="center"
                    justify="center"
                    borderRadius="lg"
                    bg={isActive || variant === 'featured' ? iconActiveBg : iconSurface}
                    color={
                      isActive || variant === 'featured' ? iconActiveColor : textMain
                    }
                    transition="transform 0.2s ease, background-color 0.3s ease"
                  >
                    {icon}
                  </Flex>
                )}

                <Box>
                  {variant === 'featured' && (
                    <Text
                      fontSize="11px"
                      fontWeight="bold"
                      textTransform="uppercase"
                      letterSpacing="0.07em"
                      color={accentColor}
                      mb={0.5}
                    >
                      Modul Utama PROYEK.ID
                    </Text>
                  )}
                  {title && (
                    <Text
                      fontFamily="'Figtree', 'IBM Plex Sans', sans-serif"
                      fontSize={
                        variant === 'featured'
                          ? { base: 'lg', sm: 'xl' }
                          : compact
                          ? 'sm'
                          : 'md'
                      }
                      fontWeight="bold"
                      color={textMain}
                      lineHeight="1.3"
                    >
                      {title}
                    </Text>
                  )}
                </Box>
              </HStack>

              {badge ? (
                <Box
                  data-theme-transition="true"
                  px={2.5}
                  py={0.5}
                  borderRadius="full"
                  bg={badgeBg}
                  border="1px solid"
                  borderColor={isActive ? borderActive : borderDefault}
                  fontSize="11px"
                  fontWeight="bold"
                  color={textMain}
                  flexShrink={0}
                >
                  {badge}
                </Box>
              ) : (
                isInteractive && (
                  <Box as="span" color={textMuted} opacity={0.75} aria-hidden="true" mt={1}>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </Box>
                )
              )}
            </Flex>

            {description && (
              <Text
                fontSize={compact ? 'xs' : 'sm'}
                color={textMuted}
                lineHeight="1.6"
              >
                {description}
              </Text>
            )}

            {children && <Box mt={3}>{children}</Box>}
          </Box>
        )}
      </Box>

      {footer && (
        <Box
          pl={variant === 'featured' || isActive ? 1.5 : 0}
          mt={4}
          pt={3}
          borderTop="1px solid"
          borderColor={dividerColor}
        >
          {footer}
        </Box>
      )}
    </Flex>
  )
}

export default Card