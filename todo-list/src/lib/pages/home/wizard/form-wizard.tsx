import { Flex, List, ListIcon, ListItem, Button, Icon } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import type React from 'react';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { GoCheckCircle, GoCircle } from 'react-icons/go';
import * as yup from 'yup';

import { Authentication } from './authentication';
import { BasicInformation } from './basic-information';

// Validation Schema using yup
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
});

const steps = [
  {
    name: 'Basic Information',
    index: 1,
    fields: ['name', 'email', 'phoneNumber'],
  },
  { name: 'Authentication', index: 2 },
];

export const FormWizard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    shouldUnregister: false,
  });

  const { trigger } = methods;

  const onNext = async () => {
    const { fields } = steps[activeTab - 1];
    let isValid = true;
    if (fields?.length) {
      // @ts-expect-error: Suppress error
      isValid = await trigger(fields); // Validate the current tab's fields
    }

    if (isValid && activeTab < 2) {
      setActiveTab((current) => current + 1);
    }
  };

  const onPrev = () => {
    if (activeTab > 1) {
      setActiveTab((current) => current - 1);
    }
  };

  const onSubmit = (data: Record<string, unknown>) => {
    // Handle form submission
    console.log('data ', data);
  };

  return (
    <FormProvider {...methods}>
      <Flex w="full" h="400px">
        <List
          spacing={3}
          w="150px"
          borderRight="1px solid"
          borderRightColor="gray.200"
          h="full"
        >
          {steps.map((step, index) => {
            const isPassed = index + 1 < activeTab;
            return (
              <ListItem
                fontSize="12px"
                key={step.index}
                as={Flex}
                alignItems="center"
                color={isPassed ? 'green.500' : 'inherit'}
              >
                <ListIcon
                  as={isPassed ? GoCheckCircle : GoCircle}
                  fontSize="20px"
                  color={isPassed ? 'green.500' : 'inherit'}
                />
                {step.name}
              </ListItem>
            );
          })}
        </List>

        <Flex
          flex={1}
          as="form"
          h="full"
          onSubmit={methods.handleSubmit(onSubmit)}
          justify="space-between"
        >
          <Flex
            w="full"
            pl={8}
            gap={2}
            flexDir="column"
            justify="space-between"
            pb={8}
          >
            {activeTab === 1 && <BasicInformation />}
            {activeTab === 2 && <Authentication />}
            <Flex
              align="center"
              justify={activeTab === 1 ? 'end' : 'space-between'}
              w="full"
            >
              {activeTab > 1 && (
                <Button
                  leftIcon={<Icon as={FiArrowLeft} />}
                  size="sm"
                  onClick={onPrev}
                  isDisabled={activeTab === 1}
                  variant="link"
                >
                  Back
                </Button>
              )}
              <Button
                rightIcon={<Icon as={FiArrowRight} />}
                colorScheme="teal"
                size="sm"
                onClick={onNext}
                type={activeTab === 2 ? 'submit' : 'button'}
                variant="custom"
              >
                {activeTab === 2 ? 'Complete' : 'Continue'}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </FormProvider>
  );
};
