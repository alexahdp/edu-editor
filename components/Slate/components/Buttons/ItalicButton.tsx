import React, { LegacyRef } from 'react';
import { MdFormatItalic } from 'react-icons/md';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';

/**
 * Toolbar button for italic text mark
 *
 * @see ToolbarButton
 */
export const ItalicButton = React.forwardRef(
  (props: Partial<ToolbarButtonProps>, ref: LegacyRef<HTMLButtonElement>) => (
    <ToolbarButton icon={<MdFormatItalic />} type="mark" format="italic" ref={ref} {...props} />
  ),
);

ItalicButton.displayName = 'ItalicButton';
