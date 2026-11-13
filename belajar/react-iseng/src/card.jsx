import { Box,Text } from "@chakra-ui/react";

function card(){
    return(
       
        <Box
        p="6rem"
        border="8px"
        borderWidth="medium"
        borderStyle="hidden"
        colors="transparant"
        boxSize="sm"
        borderRadius="16px"
        bgGradient="linear(to-br, whiteAlpha.300, whiteAlpha.100)"
        borderColor="5px solid"
        w="35vw"
        h="50vh"
        boxShadow="xl">
             <Text 
             fontFamily="'IBM Plex Sans', sans-serif"
             fontSize="50px"
             color="white"
             lineHeight="short"
             textTransform="uppercase"
             textDecoration="none">
                Belajar
             </Text>
        </Box>
    )
}

export default card