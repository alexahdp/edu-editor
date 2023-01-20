import React, { LegacyRef } from 'react';
import { Ref } from 'react';
import { MdFormatQuote } from 'react-icons/md';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';

/**
 * Toolbar button for underline text mark
 * @see ToolbarButton
 */
export const BlockquoteButton = React.forwardRef(
  (props: Partial<ToolbarButtonProps>, ref: Ref<HTMLButtonElement>) => (
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
