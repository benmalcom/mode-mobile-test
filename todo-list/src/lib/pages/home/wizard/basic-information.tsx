import { FormControl, FormLabel, Stack, Text, Input } from '@chakra-ui/react';
import type React from 'react';
import { useFormContext } from 'react-hook-form';

type BasicInformationProps = {};
type FormFields = {
  name: string;
  email: string;
  phoneNumber: string;
};
export const BasicInformation: React.FC<BasicInformationProps> = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormFields>();

  return (
    <Stack w="full">
      <Stack mb={4}>
        <Text fontWeight={700} fontSize="lg">
          Basic Information
        </Text>
        <Text fontSize="sm" color="gray.600">
          Let's start by learning a bit more about yourself.
        </Text>
      </Stack>
      <Stack w="full">
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input placeholder="John Smith" size="sm" {...register('name')} />
          {errors.name && (
            <Text color="red.500" fontSize="sm">
              {errors.name.message}
            </Text>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="john.smith@acme.xyz"
            size="sm"
            {...register('email')}
          />
          {errors.email && (
            <Text color="red.500" fontSize="sm">
              {errors.email.message}
            </Text>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.phoneNumber}>
          <FormLabel>Phone Number</FormLabel>
          <Input
            placeholder="111-111-111"
            size="sm"
            {...register('phoneNumber')}
          />
          {errors.phoneNumber && (
            <Text color="red.500" fontSize="sm">
              {errors.phoneNumber.message}
            </Text>
          )}
        </FormControl>
      </Stack>
    </Stack>
  );
};
