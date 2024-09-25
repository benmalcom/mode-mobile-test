import type { ComponentStyleConfig } from '@chakra-ui/react';

export const Button: ComponentStyleConfig = {
  variants: {
    custom: {
      bg: 'black',
      color: 'white',
      border: 'none',
      _hover: {
        _disabled: {
          bg: 'black', // Maintain original background color
        },
      },
      _active: {
        bg: 'gray.800', // Even darker shade when active
      },
      _focus: {},
    },
  },
};
