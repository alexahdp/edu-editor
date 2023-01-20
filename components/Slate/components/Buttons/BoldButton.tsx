import React, { LegacyRef } from 'react';
import { MdFormatBold } from 'react-icons/md';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';

/**
 * Toolbar button for bold text mark
 *
 * @see ToolbarButton
 */
export const BoldButton = React.forwardRef(
  (props: Partial<ToolbarButtonProps>, ref: LegacyRef<HTMLButtonElement>) => (
    <ToolbarButton icon={<MdFormatBold />} type="mark" format="bold" ref={ref} {...props} />
  ),
);

BoldButton.displayName = 'BoldButton';
