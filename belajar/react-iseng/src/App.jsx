import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

const animGradasi = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const berputar = keyframes`
  0%   { transform: translate(0px, 0px); }
  30%  { transform: translate(-6px, -3px); }
  60%  { transform: translate(-4px, 4px); }
  100% { transform: translate(0px, 0px); }
`

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
      <Box
      pos="absolute"
      top="0px"
      right="20px"
      zIndex={1}
      w="220px"
      h="220px"
      bgGradient="linear(to-tr,teal.400,green.500)"
      borderTopLeftRadius="100%"
      borderBottomRightRadius="40px"
      transform="rotate(18deg)">
      </Box>
      <Box
        h="340px"
        w="400px"
        pos="absolute"
        borderRadius="full"
        borderWidth="0" 
        zIndex={2}
        right="0px"
        bgGradient="linear(to-r, teal.500, green.700)"
        pointerEvents="none"
        bottom="20px"
        borderTopLeftRadius="190px"
        borderBottomLeftRadius="140px"
        borderTopRightRadius="200px"
        borderBottomRightRadius="160px"
      />
    </Box>
  )
}

export default App