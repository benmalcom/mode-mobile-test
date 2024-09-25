import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import type React from 'react';

import type { Todo } from '~/lib/types/todo';

type ViewTodoModalProps = {
  todo: Todo;
  isOpen: boolean;
  onClose(): void;
};

const ViewTodoModal: React.FC<ViewTodoModalProps> = ({
  todo,
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent pb={2}>
        <ModalHeader>{todo.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box bg="gray.50" borderRadius="sm" p={2}>
            {todo.description}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

type ModalManagerProps = Omit<ViewTodoModalProps, 'isOpen' | 'onClose'> & {
  triggerFunc({ trigger }: { trigger(): void }): React.ReactNode;
};

export const ModalManager: React.FC<ModalManagerProps> = ({
  triggerFunc,
  ...props
}) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <ViewTodoModal isOpen={isOpen} onClose={onToggle} {...props} />
      {triggerFunc({
        trigger: onToggle,
      })}
    </>
  );
};
