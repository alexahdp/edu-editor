import React, { Ref } from 'react';
import { MdFormatBold } from 'react-icons/md';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';

/**
 * Toolbar button for bold text mark
 *
 * @see ToolbarButton
 */
export const BoldButton = React.forwardRef(
  (props: Partial<ToolbarButtonProps>, ref: Ref<HTMLButtonElement>) => (
    <ToolbarButton icon={<MdFormatBold />} type="mark" format="bold" ref={ref} {...props} />
  ),
);

BoldButton.displayName = 'BoldButton';
