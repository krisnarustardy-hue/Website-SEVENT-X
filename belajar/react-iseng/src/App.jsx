import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

const animGradasi = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`
const berputar = keyframes`
0% {transform: translate(0px,0px); 
30% { transform: translate(-6px,-3px); }
60% { transform: translate(-4px,4px); }`
function App() {
  return (
    <Box
      minH="100vh"
      w="100%"
      bgGradient="radial(circle at top left,teal.50,green.100,gray.300)"
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
              bg:'whiteAlpha.300',
              color: 'whiteAlpha.700',
              cursor: 'pointer',
            }}>Beranda</Text>
            <Text            
             px={4}
             py={1.5}
             borderRadius="full"
             color="white"
             transition="all 0.2s ease"
             _hover={{
              bg:'whiteAlpha.300',
              color: 'whiteAlpha.700',
              cursor: 'pointer',
            }}>Feature</Text>
            <Text
              px={4}
             py={1.5}
             borderRadius="full"
             color="white"
             transition="all 0.2s ease"
             _hover={{
              bg:'whiteAlpha.300',
              color: 'whiteAlpha.700',
              cursor: 'pointer',
            }}>About</Text>
          </HStack>
        </Flex>
      </Box>
      <Box
      h="1000px"
      w="1000px"
      pos="absolute"
      borderRadius="full"
      borderWidth="0"
      top="150px"
      right="-500px"
      bgGradient="linear(to-r, teal.400, green.600, current)"
      opacity={0.35}
      pointerEvents="none">
      </Box>
    </Box>
  )
}

export default App