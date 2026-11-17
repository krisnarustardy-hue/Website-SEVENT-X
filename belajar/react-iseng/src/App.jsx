import { useState } from 'react'
import {
  Box,
  Flex,
  HStack,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'

const MENUS = ['Beranda', 'Fitur', 'Tentang']

function App() {
  const [activeMenu, setActiveMenu] = useState('Beranda')
  const { colorMode, toggleColorMode } = useColorMode()

  // Mode terang memakai tone warm paper / off-white agar tidak silau
  const bgMain = useColorModeValue('#F3F2EE', '#0F172A')
  const textMain = useColorModeValue('#1E293B', '#F8FAFC')
  const navBg = useColorModeValue('#FAF9F6', '#1E293B')
  const navBorder = useColorModeValue('#E2E0D8', '#334155')
  const navShadow = useColorModeValue(
    '0 8px 24px rgba(30, 41, 59, 0.06)',
    '0 10px 25px rgba(2, 6, 23, 0.65)'
  )
  const pillActiveBg = useColorModeValue('#E8E6DF', 'whiteAlpha.100')
  const textMuted = useColorModeValue('#646873', '#94A3B8')
  const btnBg = useColorModeValue('#1E293B', '#F8FAFC')
  const btnColor = useColorModeValue('#FAF9F6', '#0F172A')
  const btnHoverBg = useColorModeValue('#334155', '#E2E8F0')

  return (
    <Box
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
      `}</style>

      <Box as="nav" pos="fixed" top={0} left={0} w="100%" zIndex={100} pt={4} px={4}>
        <Flex
          maxW="680px"
          h="54px"
          mx="auto"
          px={5}
          align="center"
          justify="space-between"
          bg={navBg}
          borderRadius="full"
          border="1px solid"
          borderColor={navBorder}
          boxShadow={navShadow}
          animation="dropUnblur 0.65s cubic-bezier(0.16, 1, 0.3, 1) both"
          transition="background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease"
        >
          <Text
            fontFamily="'Figtree', sans-serif"
            fontWeight="extrabold"
            fontSize="sm"
            letterSpacing="wide"
            pl={1}
            animation="contentReveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both"
          >
            PROYEK.ID
          </Text>

          <HStack
            spacing={1}
            animation="contentReveal 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both"
          >
            {MENUS.map((item) => {
              const isActive = activeMenu === item
              return (
                <Text
                  key={item}
                  onClick={() => setActiveMenu(item)}
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
              Mulai
            </Box>
          </HStack>
        </Flex>
      </Box>
    </Box>
  )
}

export default App