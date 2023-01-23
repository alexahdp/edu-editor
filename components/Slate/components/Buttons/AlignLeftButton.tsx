import React, { Ref } from 'react';
import { MdFormatAlignLeft } from 'react-icons/md';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';

/**
 * Toolbar button for aligne left text mark
 *
 * @see ToolbarButton
 */
export const AlignLeftButton = React.forwardRef(
  (props: Partial<ToolbarButtonProps>, ref: Ref<HTMLButtonElement>) => (
    <ToolbarButton
      icon={<MdFormatAlignLeft />}
      type="mark"
      format="align-left"
      ref={ref}
      {...props}
    />
  ),
);

AlignLeftButton.displayName = 'AlignLeftButton';
