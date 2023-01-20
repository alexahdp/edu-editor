import React, { LegacyRef } from 'react';
import { Heading1, Heading2, Heading3 } from '../../icons/headings';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';

/**
 * Toolbar button for underline text mark
 * @see ToolbarButton
 */
export const HeadingButtons = React.forwardRef(
  (props: Partial<ToolbarButtonProps>, ref: LegacyRef<HTMLButtonElement>) => (
    <>
      <ToolbarButton icon={<Heading1 />} type="block" format="heading-one" ref={ref} {...props} />
      <ToolbarButton icon={<Heading2 />} type="block" format="heading-two" ref={ref} {...props} />
      <ToolbarButton icon={<Heading3 />} type="block" format="heading-three" ref={ref} {...props} />
    </>
  ),
);

HeadingButtons.displayName = 'HeadingButtons';
