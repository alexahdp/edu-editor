import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';

export const Card = ({ children, ...rest }: BoxProps) => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const color = useColorModeValue('black', 'white');
  return (
    <Box
      w="full"
      bg={bgColor}
      color={color}
      boxShadow="md"
      rounded="lg"
      p={6}
      // textAlign="center"
      {...rest}
    >
      {children}
    </Box>
  );
};
