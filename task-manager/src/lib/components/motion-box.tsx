'use client';

import type { ChakraComponent } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import type { MotionProps } from 'framer-motion';
import { motion } from 'framer-motion';

export const MotionBox = chakra(motion.div) as ChakraComponent<
  'div',
  MotionProps
>;
