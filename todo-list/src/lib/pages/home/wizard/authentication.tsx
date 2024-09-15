import {
  FormLabel,
  Stack,
  Text,
  Switch,
  Flex,
  Button,
  List,
  ListItem,
  Icon,
} from '@chakra-ui/react';
import type React from 'react';
import { useState } from 'react';
import { CiMobile1 } from 'react-icons/ci';
import { HiOutlineMail } from 'react-icons/hi';
import { MdOutlineSmsFailed } from 'react-icons/md';

const mfas = [
  {
    icon: CiMobile1,
    label: 'Authenticator App',
    ctaText: 'Add Authenticator App',
  },
  {
    icon: HiOutlineMail,
    label: 'Email Address',
    ctaText: 'Add Authenticator App',
  },
  { icon: MdOutlineSmsFailed, label: 'SMS', ctaText: 'Send Verification Code' },
];

type AuthenticationProps = {};
export const Authentication: React.FC<AuthenticationProps> = ({}) => {
  const [isMFAEnabled, setMFAEnabled] = useState(false);
  const toggleMFA = () => setMFAEnabled((active) => !active);
  return (
    <Stack w="full">
      <Stack mb={4} spacing={0}>
        <Text fontWeight={700} fontSize="lg" mb={1}>
          Authentication
        </Text>
        <Text fontSize="sm" color="gray.600">
          Security is a primary focus for us and it should be for you too.{' '}
        </Text>
      </Stack>
      <Stack w="full">
        <Flex justify="space-between" align="center" gap={12}>
          <Stack>
            <FormLabel fontSize="14px" mb={0}>
              Email Verification
            </FormLabel>
            <Text fontSize="8px" color="gray.600">
              Please verify your email address by following the instruction in
              the confirmation email.
            </Text>
          </Stack>
          <Button
            fontSize="8px"
            bg="#000"
            color="#fff"
            h="18px"
            w="117px"
            p="4px 8px"
            fontWeight={400}
            borderRadius="4px"
          >
            Resend Confirmation Email
          </Button>
        </Flex>

        <Flex justify="space-between" align="center">
          <Stack>
            <FormLabel fontSize="14px" mb={0}>
              Multi-Factor Authentication
            </FormLabel>
            <Text fontSize="8px" color="gray.600">
              Please verify your email address by following the instruction in
              the confirmation email.
            </Text>
          </Stack>
          <Switch
            colorScheme="blackAlpha"
            checked={isMFAEnabled}
            onChange={toggleMFA}
          />
        </Flex>
        {isMFAEnabled && (
          <List w="full" mt={4} as={Stack}>
            {mfas.map((mfa, i) => (
              <ListItem
                key={i}
                as={Flex}
                w="full"
                justifyContent="space-between"
                alignItems="center"
              >
                <Flex h="full" align="center" gap={1}>
                  <Icon as={mfa.icon} />
                  <Text fontSize="10px">{mfa.label}</Text>
                </Flex>
                <Button
                  fontSize="8px"
                  colorScheme="gray"
                  size="xs"
                  h="18px"
                  p="4px 8px"
                  fontWeight={400}
                  borderRadius="4px"
                >
                  {mfa.ctaText}
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
    </Stack>
  );
};
