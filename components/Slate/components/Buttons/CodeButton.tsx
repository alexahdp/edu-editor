import React, { Ref } from 'react';
import { MdCode } from 'react-icons/md';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';

/**
 * Toolbar button for adding code mono-spaced text mark
 *
 * @see ToolbarButton
 */
export const CodeButton = React.forwardRef(
  (props: Partial<ToolbarButtonProps>, ref: Ref<HTMLButtonElement>) => (
    <ToolbarButton icon={<MdCode />} type="mark" format="code" ref={ref} {...props} />
  ),
);

CodeButton.displayName = 'CodeButton';
