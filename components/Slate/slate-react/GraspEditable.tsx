import React, { ReactNode, useCallback } from 'react';
import { Descendant, Editor, Transforms } from 'slate';
import { Editable, useSlate, RenderElementProps, RenderLeafProps } from 'slate-react';
import isHotkey from 'is-hotkey';

import { defaultRenderElement } from './defaultRenderElement';
import { defaultRenderLeaf } from './defaultRenderLeaf';
import { defaultHotkeys } from './defaultHotkeys';

const editableStyle: React.CSSProperties | undefined = {
  paddingLeft: '0.25rem',
  paddingRight: '0.25rem',
  paddingBottom: '0.25rem',
};

interface GraspEditableProps {
  name?: string;
  renderElement?: (props: RenderElementProps) => JSX.Element;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element;
  placeholder: string;
  hotkeys: Record<string, { type: string; value: string }>;
  onHotkey: (props: {
    event: React.KeyboardEvent<HTMLDivElement>;
    editor: Editor;
    hotkey?: { type: string; value: string };
    pressedKeys: string;
    hotkeys: Record<string, { type: string; value: string }>;
  }) => void;
  children: ReactNode;
  className: string;
  readOnly: boolean;
}

/**
 * Wrapper of Slate Editable
 *
 */
export const GraspEditable = ({
  name = 'main',
  renderElement,
  renderLeaf,
  placeholder = 'Type some text...',
  hotkeys = defaultHotkeys,
  onHotkey,
  children,
  className,
  readOnly = false,
  ...props
}: Partial<GraspEditableProps>) => {
  const editor = useSlate();
  const CMD_KEY = '/';
  // Define a rendering function based on the element passed to `props`.
  // Props is deconstructed in the {element, attributes, children, rest (any other prop)
  // We use `useCallback` here to memoize the function for subsequent renders.
  const handleRenderElement = useCallback((props: RenderElementProps) => {
    return renderElement ? renderElement(props) : defaultRenderElement({ ...props });
  }, []);

  const handleRenderLeaf = useCallback((props: RenderLeafProps) => {
    return renderLeaf ? renderLeaf(props) : defaultRenderLeaf(props);
  }, []);

  const handleOnKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    for (const pressedKeys of Object.keys(hotkeys)) {
      if (isHotkey(pressedKeys, event)) {
        const hotkey = hotkeys[pressedKeys];

        event.preventDefault();
        if (hotkey.type === 'mark') {
          editor.toggleMark(hotkey.value);
        }
        if (hotkey.type === 'block') {
          editor.toggleBlock(hotkey.value);
        }
        if (hotkey.type === 'newline') {
          editor.insertText('\n');
          //The following line updates the cursor
          Transforms.move(editor, { distance: 0, unit: 'offset' });
        }

        return onHotkey && onHotkey({ event, editor, hotkey, pressedKeys, hotkeys });
      }
      // if (event.key === CMD_KEY) {
      //     editor.isCommandMenu = true
      //     // editor.insertText('hey')
      // }
      if (event.key === 'Enter') {
        if (!editor.isCommandMenu) {
          const currentType = editor.getCurrentNode().type as string;
          // const currentNodeText = editor.getCurrentNodeText().type as string;

          if (!editor.LIST_TYPES.includes(currentType) && currentType !== 'list-item') {
            event.preventDefault();
            const newLine = {
              type: 'paragraph',
              children: [
                {
                  text: '',
                },
              ],
            } as Descendant;
            Transforms.insertNodes(editor, newLine);
            return onHotkey && onHotkey({ event, editor, pressedKeys, hotkeys });
          }
        } else {
          event.preventDefault();
        }
      }
    }
  };

  return (
    <Editable
      data-editor-name={name}
      readOnly={readOnly}
      renderElement={handleRenderElement}
      renderLeaf={handleRenderLeaf}
      onKeyDown={(event) => handleOnKeyDown(event)}
      placeholder={placeholder}
      style={editableStyle}
      {...props}
    >
      {children}
    </Editable>
  );
};
