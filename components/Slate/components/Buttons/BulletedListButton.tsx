import React, { LegacyRef } from 'react';
import { MdFormatListBulleted } from 'react-icons/md';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';

/**
 * Toolbar button for underlined text mark
 * @see ToolbarButton
 */
export const BulletedListButton = React.forwardRef(
  (props: Partial<ToolbarButtonProps>, ref: LegacyRef<HTMLButtonElement>) => (
    <ToolbarButton
      icon={<MdFormatListBulleted />}
      type="block"
      format="bulleted-list"
      ref={ref}
      {...props}
    />
  ),
);

BulletedListButton.displayName = 'BulletedListButton';
