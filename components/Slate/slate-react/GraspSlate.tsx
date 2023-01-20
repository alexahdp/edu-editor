import React, { ReactNode } from 'react';
import { useState } from 'react';
import { Slate } from 'slate-react';
import { Box } from '@chakra-ui/react';
import { Descendant, Editor } from 'slate';

interface GraspSlateProps {
  value: Descendant[];
  editor: Editor;
  onChange: (v: Descendant[]) => void;
  children: ReactNode;
  editorKey?: string;
}

/**
 * Rich Slate
 *
 * It is the provider of the useSlate hook.
 */
export const GraspSlate = ({ value, editor, onChange, children }: GraspSlateProps) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Box onBlur={() => setIsFocused(false)} onFocus={() => setIsFocused(true)}>
      <Slate value={value} editor={editor} onChange={(value) => onChange(value)}>
        {children}
      </Slate>
    </Box>
  );
};
