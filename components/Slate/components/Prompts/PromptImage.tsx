import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useCallback } from 'react';

const imageUrl =
  'https://sun9-68.userapi.com/impg/KHtPH-iZfkIHouN1T4NaPiLFiQlxqGID73oDfQ/PL1pQ_R2rWk.jpg?size=919x1224&quality=96&sign=3414beaa11f3a3cd68ba981f39e1daa0&type=album';

export const PromptImage = ({
  isOpen,
  onCancel,
  onApply,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onApply: (s: string) => void;
}) => {
  const [file, setFile] = useState(imageUrl);
  const onSave = useCallback(() => onApply(file), [file, onApply]);

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Drop Image here</ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onSave}>
            Apply
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
