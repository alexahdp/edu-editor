import React from 'react';
import { Center, Divider, useColorModeValue } from '@chakra-ui/react';

/**
 * Toolbar button separator.
 *
 * Displays an horizontal line. Use it for separating groups of buttons.
 *
 */
export const ButtonSeparator = ({ borderColor = null, ...other }) => {
  const dividerBorderColor = useColorModeValue('gray.400', 'gray.600');
  return (
    <Center display="inline-flex">
      <Divider
        marginLeft="2px"
        marginRight="2px"
        orientation="vertical"
        display="inline"
        borderColor={dividerBorderColor}
      />
    </Center>
  );
};
