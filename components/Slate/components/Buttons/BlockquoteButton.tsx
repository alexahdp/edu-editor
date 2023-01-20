import React, { LegacyRef } from 'react';
import { MdFormatQuote } from 'react-icons/md';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';

/**
 * Toolbar button for underline text mark
 * @see ToolbarButton
 */
export const BlockquoteButton = React.forwardRef(
  (props: Partial<ToolbarButtonProps>, ref: LegacyRef<HTMLButtonElement>) => (
    <ToolbarButton
      icon={<MdFormatQuote />}
      type="block"
      format="block-quote"
      ref={ref}
      {...props}
    />
  ),
);

BlockquoteButton.displayName = 'BlockquoteButton';
