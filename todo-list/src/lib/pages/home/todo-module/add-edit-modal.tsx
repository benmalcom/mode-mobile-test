import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Box,
  useBreakpointValue,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  Flex,
  FormHelperText,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import type React from 'react';
import type { Resolver, SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import type { Todo, TodoPriority } from '~/lib/types/todo';
import { TODO_PRIORITIES } from '~/lib/utils/constants';

type TodoWithOptionalId = Omit<Todo, 'id'> & { id?: string };

type TodoModalProps = {
  onSave(values: TodoWithOptionalId, callback?: () => void): void;
  initialValues?: Todo;
  isOpen: boolean;
  onClose(): void;
  loading?: boolean;
};

type TodoFormValues = {
  title: string;
  description: string;
  priority: TodoPriority;
  dueDate: Date;
};

const schema = yup
  .object({
    title: yup
      .string()
      .required('The title is required')
      .max(30, 'The title must be at most 30 characters'),
    description: yup.string().required('The description is required'),
    priority: yup
      .mixed()
      .oneOf(
        TODO_PRIORITIES.map((item) => item.value),
        'Invalid priority'
      )
      .required('Priority is required'),
    dueDate: yup.date().required('The due date is required'),
  })
  .required();

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() - 1);

const TodoModal: React.FC<TodoModalProps> = ({
  initialValues,
  onSave,
  isOpen,
  onClose,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors = {} },
    control,
    watch,
  } = useForm<TodoFormValues>({
    resolver: yupResolver(schema) as unknown as Resolver<TodoFormValues>,
    shouldUnregister: true,
    defaultValues: {
      priority: 'medium',
      dueDate: new Date(),
      ...initialValues,
    },
  });

  const formValues = watch();

  const onSubmit: SubmitHandler<TodoFormValues> = (values) => {
    onSave(values, onClose);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent>
        <ModalHeader>
          {initialValues?.id ? 'Edit Todo' : 'Add Todo'}{' '}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              pb={{ base: '4', sm: '8' }}
              bg={useBreakpointValue({
                base: 'transparent',
                sm: 'bg-surface',
              })}
              borderRadius={{ base: 'none', sm: 'xl' }}
            >
              <Stack spacing="6">
                {' '}
                <Stack spacing="5">
                  <FormControl isInvalid={Boolean(errors.title)}>
                    <FormLabel htmlFor="name">Title</FormLabel>
                    <Input
                      id="name"
                      type="text"
                      {...register('title')}
                      placeholder="Todo title"
                      errorBorderColor="red.300"
                      maxLength={30}
                    />
                    <Flex justifyContent="space-between">
                      <FormErrorMessage>
                        {errors?.title?.message &&
                          errors.title.message.toString()}
                      </FormErrorMessage>
                      <FormHelperText fontSize="sm">
                        {formValues.title?.length || 0}/30
                      </FormHelperText>
                    </Flex>
                  </FormControl>

                  <FormControl isInvalid={Boolean(errors.description)}>
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="A brief description"
                      errorBorderColor="red.300"
                    />
                    <FormErrorMessage>
                      {errors?.description?.message &&
                        errors.description.message.toString()}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={Boolean(errors.priority)}>
                    <FormLabel htmlFor="priority">Priority</FormLabel>
                    <Controller
                      name="priority"
                      control={control}
                      render={({ field }) => (
                        <Stack direction="row" spacing={1} align="center">
                          {TODO_PRIORITIES.map((item, index) => (
                            <Button
                              colorScheme="blackAlpha"
                              variant={
                                field.value === item.value ? 'solid' : 'outline'
                              }
                              key={`${item.label + index}`}
                              size="sm"
                              onClick={() =>
                                field.onChange(item.value as TodoPriority)
                              }
                            >
                              {item.label}
                            </Button>
                          ))}
                        </Stack>
                      )}
                    />
                    <FormErrorMessage>
                      {errors?.priority?.message &&
                        errors.priority.message.toString()}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={Boolean(errors.dueDate)}>
                    <FormLabel htmlFor="duration">Due Date</FormLabel>
                    <Controller
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <SingleDatepicker
                          triggerVariant="default"
                          date={value}
                          onDateChange={onChange}
                          minDate={tomorrow}
                        />
                      )}
                      name="dueDate"
                    />
                    <FormErrorMessage>
                      {errors?.dueDate?.message &&
                        errors.dueDate.message.toString()}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
                <Stack spacing="1" direction="row" justifyContent="end">
                  <Button colorScheme="gray" mr={2} onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="purple"
                    isDisabled={loading}
                    isLoading={loading}
                  >
                    Submit
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

type ModalManagerProps = Omit<TodoModalProps, 'isOpen' | 'onClose'> & {
  triggerFunc({ trigger }: { trigger(): void }): React.ReactNode;
};

export const ModalManager: React.FC<ModalManagerProps> = ({
  triggerFunc,
  ...props
}) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <TodoModal isOpen={isOpen} onClose={onToggle} {...props} />
      {triggerFunc({
        trigger: onToggle,
      })}
    </>
  );
};
