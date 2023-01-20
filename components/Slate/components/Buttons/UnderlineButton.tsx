import React, { LegacyRef } from 'react';
import { MdFormatUnderlined } from 'react-icons/md';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';

/**
 * Toolbar button for underlined text mark
 * @see ToolbarButton
 */
export const UnderlineButton = React.forwardRef(
  (props: Partial<ToolbarButtonProps>, ref: LegacyRef<HTMLButtonElement>) => (
    <ToolbarButton
      icon={<MdFormatUnderlined />}
      type="mark"
      format="underline"
      ref={ref}
      {...props}
    />
  ),
);

UnderlineButton.displayName = 'UnderlineButton';
