import { useDisclosure } from '@chakra-ui/react';
import React, { Ref, useCallback } from 'react';
import { MdAddLink } from 'react-icons/md';
import { useSlate } from 'slate-react';
import { PromptImage } from '../Prompts/PromptImage';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';

/**
 * Toolbar button for link
 *
 * @see ToolbarButton
 */
export const ImageButton = React.forwardRef(
  (props: Partial<ToolbarButtonProps>, ref: Ref<HTMLButtonElement>) => {
    const editor = useSlate();
    const { onOpen, onClose, isOpen } = useDisclosure();
    const onApply = useCallback((url: string) => {
      editor.wrapLink(url);
      onClose();
    }, []);

    return (
      <>
        <ToolbarButton
          icon={<MdAddLink />}
          type="mark"
          format="image"
          ref={ref}
          {...props}
          onMouseDown={onOpen}
        />
        <PromptImage isOpen={isOpen} onApply={onApply} onCancel={onClose} />
      </>
    );
  },
);

ImageButton.displayName = 'ImageButton';
