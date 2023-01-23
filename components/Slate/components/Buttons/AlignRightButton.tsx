import React, { Ref } from 'react';
import { MdFormatAlignRight } from 'react-icons/md';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';

/**
 * Toolbar button for aligne left text mark
 *
 * @see ToolbarButton
 */
export const AlignRightButton = React.forwardRef(
  (props: Partial<ToolbarButtonProps>, ref: Ref<HTMLButtonElement>) => (
    <ToolbarButton
      icon={<MdFormatAlignRight />}
      type="block"
      format="align-right"
      ref={ref}
      {...props}
    />
  ),
);

AlignRightButton.displayName = 'AlignRightButton';
