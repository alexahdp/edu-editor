import React, { Ref } from 'react';
import { MdStrikethroughS } from 'react-icons/md';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';

/**
 * Toolbar button for strike through text mark
 *
 * @see ToolbarButton
 */
export const StrikethroughButton = React.forwardRef(
  (props: Partial<ToolbarButtonProps>, ref: Ref<HTMLButtonElement>) => (
    <ToolbarButton
      icon={<MdStrikethroughS />}
      type="mark"
      format="strikethrough"
      ref={ref}
      {...props}
    />
  ),
);

StrikethroughButton.displayName = 'StrikethroughButton';
