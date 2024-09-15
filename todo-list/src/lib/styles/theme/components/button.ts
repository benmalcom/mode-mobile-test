import type { ComponentStyleConfig } from '@chakra-ui/react';

export const Button: ComponentStyleConfig = {
  variants: {
    custom: {
      bg: 'black',
      color: 'white',
      _hover: {
        bg: 'gray.700', // Darker shade on hover
      },
      _active: {
        bg: 'gray.800', // Even darker shade when active
      },
      _focus: {
        boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)', // Optional focus ring
      },
    },
  },
};
