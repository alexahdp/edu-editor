import React, { LegacyRef } from 'react';
import { MdFormatListNumbered } from 'react-icons/md';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';

/**
 * Toolbar button for numbered list block
 * @see ToolbarButton
 */
export const NumberedListButton = React.forwardRef(
  (props: Partial<ToolbarButtonProps>, ref: LegacyRef<HTMLButtonElement>) => (
    <ToolbarButton
      icon={<MdFormatListNumbered />}
      type="block"
      format="numbered-list"
      ref={ref}
      {...props}
    />
  ),
);

NumberedListButton.displayName = 'NumberedListButton';
