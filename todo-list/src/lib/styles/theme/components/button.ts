import type { ComponentStyleConfig } from '@chakra-ui/react';

export const Button: ComponentStyleConfig = {
  variants: {
    custom: {
      bg: 'black',
      color: 'white',
      border: 'none',
      _hover: {
        bg: 'gray.700', // Darker shade on hover
      },
      _active: {
        bg: 'gray.800', // Even darker shade when active
      },
      _focus: {},
    },
  },
};
