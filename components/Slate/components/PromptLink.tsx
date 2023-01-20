import { Ref, forwardRef, useRef, useState, RefObject, useCallback } from 'react';
import FocusLock from 'react-focus-lock';
import isUrl from 'is-url';
import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  Stack,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

const TextInput = forwardRef(
  (
    props: {
      id: string;
      label: string;
      defaultValue?: string;
      onChange: () => void;
      isInvalid: boolean;
      errormessage: ReactNode;
    },
    ref: Ref<HTMLInputElement>,
  ) => {
    return (
      <FormControl isInvalid={props.isInvalid}>
        <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
        <Input ref={ref} {...props} />
        {props.errormessage}
      </FormControl>
    );
  },
);

TextInput.displayName = 'TextInput';

const Form = ({
  firstFieldRef,
  onCancel,
  onSubmit,
}: {
  firstFieldRef: RefObject<HTMLInputElement>;
  onCancel: () => void;
  onSubmit: () => void;
}) => {
  const [isInvalid, setIsInvalid] = useState(false);
  const onSave = useCallback(() => {
    if (firstFieldRef?.current) {
      const value = firstFieldRef?.current.value as string;
      if (isUrl(value)) {
        onSubmit();
      } else {
        setIsInvalid(true);
      }
    }
  }, [onSubmit]);

  const handleChange = useCallback(() => setIsInvalid(false), []);

  return (
    <Stack spacing={4}>
      <TextInput
        label="URL"
        id="url"
        ref={firstFieldRef}
        defaultValue=""
        onChange={handleChange}
        isInvalid={isInvalid}
        errormessage={<FormErrorMessage>String is not a correct url</FormErrorMessage>}
      />
      <ButtonGroup display="flex" justifyContent="flex-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button colorScheme="teal" onClick={onSave}>
          Save
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

export const PromptLink = ({
  isOpen,
  onApply,
  onCancel,
}: {
  isOpen: boolean;
  onApply: (url: string) => void;
  onCancel: () => void;
}) => {
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const onSubmit = useCallback(() => {
    if (firstFieldRef.current) {
      onApply(firstFieldRef.current.value);
    }
  }, []);

  return (
    <Popover isOpen={isOpen} initialFocusRef={firstFieldRef} placement="right" closeOnBlur={false}>
      <PopoverContent p={5}>
        <FocusLock returnFocus persistentFocus={false}>
          <PopoverArrow />
          <PopoverCloseButton />
          <Form firstFieldRef={firstFieldRef} onSubmit={onSubmit} onCancel={onCancel} />
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};
