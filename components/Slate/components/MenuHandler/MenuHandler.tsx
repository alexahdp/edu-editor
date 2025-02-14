import React, { useState, useRef, useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { Ancestor, Editor, Element, Path, Range } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  Stack,
  StackProps,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdFormatListBulleted, MdFormatListNumbered, MdFormatQuote, MdTitle } from 'react-icons/md';
import { BiParagraph } from 'react-icons/bi';
import { AddIcon } from '@chakra-ui/icons';
import { SlateMenuList } from '../SlateMenuItems/SlateMenuList';
import { Heading1, Heading2, Heading3 } from '../../icons/headings';

const Portal = ({ children }: { children: ReactNode }) => {
  return ReactDOM.createPortal(children, document.body);
};

/**
 * A hovering toolbar that is, a toolbar that appears over a selected text, and only when there is
 * a selection.
 *
 * If no children are provided it displays the following buttons:
 * Bold, italic, underline, strike through and code.
 *
 * Children will typically be `ToolbarButton`.
 */
export const MenuHandler = ({
  children,
  ...props
}: { children?: ReactNode } & Partial<StackProps>) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const editor = useSlate();

  const menuButtonColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700');
  const menuButtonBorderColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700');

  const editorRef = useRef<HTMLElement | null>(null);

  // TODO!!!
  //   const { colorMode, toggleColorMode } = useColorMode();

  const [selectedElement, setSelectedElement] = useState<Ancestor | null>(null);

  useEffect(() => {
    const menuBox = menuRef.current;
    const { selection } = editor;

    if (!editorRef) return;

    editorRef.current = ReactEditor.toDOMNode(editor, editor);
    const rootRect = editorRef.current.getBoundingClientRect();

    if (!menuBox) {
      return;
    }
    if (!ReactEditor.isFocused(editor)) {
      menuBox.removeAttribute('style');
      return;
    }
    // setMenuIcon(getIconByType(Editor.node(editor, [editor.selection?.anchor.path[0]])[0]?.type))
    const domSelection = window.getSelection();
    if (!domSelection) return;

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    menuBox.style.opacity = '1';
    // el.style.top = `${rect.top + window.pageYOffset}px`
    menuBox.style.left = `${rootRect.left - 60}px`;

    // TODO
    // @ts-ignore
    if (editor.selection && Range.isCollapsed(selection)) {
      const [element] = Editor.parent(editor, editor.selection);

      menuBox.style.top =
        ReactEditor.toDOMNode(editor, element).getBoundingClientRect().y +
        window.pageYOffset +
        'px';

      setSelectedElement(element);
    } else menuBox.style.top = `${rect.top + window.pageYOffset}px`;

    // `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`
  });

  const getIconByType = (type: string): ReactNode => {
    switch (type) {
      case 'block-quote':
        return <MdFormatQuote size="15px" />;
      case 'list-item': {
        if (editor.selection) {
          const [element] = Editor.parent(editor, Path.parent(editor?.selection.anchor.path));
          if (Element.isElement(element)) return getIconByType(element.type);
        }
        return <MdFormatListBulleted size="15px" />;
      }

      case 'numbered-list':
        return <MdFormatListNumbered size="15px" />;
      case 'bulleted-list':
        return <MdFormatListBulleted size="15px" />;
      case 'heading-0':
        return <MdTitle size="20px" />;
      case 'heading-1':
        return <Heading1 />;
      case 'heading-2':
        return <Heading2 />;
      case 'heading-3':
        return <Heading3 />;
      default:
        return <BiParagraph size="15px" />;
    }
  };

  // @ts-ignore
  const iseSelectedEmpty = selectedElement?.children && selectedElement?.children[0]?.text === '';

  if (!editor.selection || (editor.selection && !Range.isCollapsed(editor.selection))) return <></>;

  return (
    <Portal>
      <Stack
        direction="row"
        borderRadius="lg"
        spacing=".1"
        ref={menuRef}
        position="absolute"
        padding="1"
        zIndex="1"
        top="-10000px"
        left="-10000px"
        opacity={1}
        transition="opacity 0.75s"
        {...props}
      >
        {!children && (
          <React.Fragment>
            <Menu closeOnSelect={false}>
              <MenuButton
                as={IconButton}
                color={
                  iseSelectedEmpty && selectedElement?.type !== 'list-item'
                    ? 'blue.500'
                    : menuButtonColor
                }
                icon={
                  selectedElement ? (
                    !iseSelectedEmpty || selectedElement.type !== 'paragraph' ? (
                      getIconByType(selectedElement.type)
                    ) : (
                      <AddIcon />
                    )
                  ) : (
                    <AddIcon />
                  )
                }
                // onClick={handleClick}
                aria-label="slateMenuHandler"
                variant="link"
                height={
                  selectedElement
                    ? ReactEditor.toDOMNode(editor, selectedElement).getBoundingClientRect()
                        .height + 'px'
                    : '25px'
                }
                // height ="25px"
              />
              <SlateMenuList
                key="SlateSideMenuList"
                editor={editor}
                editorRef={editorRef.current}
              />
            </Menu>
            <Box
              as="span"
              display="inline"
              borderColor={
                iseSelectedEmpty && selectedElement?.type !== 'list-item'
                  ? 'blue.500'
                  : menuButtonBorderColor
              }
              borderRightWidth="1px"
            ></Box>
          </React.Fragment>
        )}
        {children && children}
      </Stack>
    </Portal>
  );
};
