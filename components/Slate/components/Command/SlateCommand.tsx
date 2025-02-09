import React, { useState, useRef, useEffect, ReactNode, LegacyRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Range } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { matchSorter } from 'match-sorter';
import {
  Box,
  Button,
  Interpolation,
  Menu,
  MenuDivider,
  MenuList,
  Stack,
  StackProps,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { MenuCommandItem, SlateMenus } from '../..';
import { getEditorId } from '../../slate-utils';
import { PromptImage } from '../Prompts/PromptImage';

const Portal = ({ children }: { children: ReactNode }) => {
  return ReactDOM.createPortal(children, document.body);
};

const editorId = 'mainEditor';
const editorName = 'main';

/**
 * A hovering toolbar that is, a toolbar that appears over a selected text, and only when there is
 * a selection.
 *
 * If no children are provided it displays the following buttons:
 * Bold, italic, underline, strike through and code.
 *
 * Children will typically be `ToolbarButton`.
 */
export const SlateCommand = ({
  children,
  ...props
}: { children?: ReactNode } & Partial<StackProps>) => {
  const CMD_KEY = '/';

  const ref = useRef<HTMLDivElement | undefined>();
  const editorRef = useRef<HTMLElement | null>(null);
  const menuListRef = useRef<HTMLElement | null>(null);

  const editor = useSlate();

  useEffect(() => {
    editorRef.current = ReactEditor.toDOMNode(editor, editor);
  }, []);

  // const { colorMode, toggleColorMode } = useColorMode()
  const [selected, setSelected] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const left = useRef(150);

  const commandTextRef = useRef('');
  const commandsLengthRef = useRef(SlateMenus.length);
  // const isBlockEmpty = useRef(true)
  const commandOffset = useRef(0);
  const [commands, setCommands] = useState(() => [...SlateMenus]);

  const menuListBorderColor = useColorModeValue('1px solid #ddd', '1px solid #444');
  const menuListBGColor = useColorModeValue('white', 'gray.800');
  const menuListColor = useColorModeValue('black', 'white');

  const menuItemBorderColor = useColorModeValue('blue.500', 'blue.400');
  const menuItemBorderColor2 = useColorModeValue('white', 'gray.800');
  // const menuItemBGColor = useColorModeValue('blue.100', 'blue.600')

  const {
    isOpen: imageAddPromptIsOpen,
    onOpen: openImageAddPrompt,
    onClose: closeImageAddPrompt,
  } = useDisclosure();

  const onImageAdd = useCallback((url: string): void => {
    editor.deleteCurrentNodeText(commandOffset.current);
    editor.insertImage(url);
    closeImageAddPrompt();
  }, []);

  const buttonStyles: Interpolation<{}> = {
    textDecoration: 'none',
    color: 'inherit',
    userSelect: 'none',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    textAlign: 'start',
    flex: '0 0 auto',
    outline: '0',
    // ...styles.item,
  };

  const openTagSelectorMenu = () => {
    // if (!isOpen) {
    menuListRef.current?.scrollTo(0, 0);
    editor.isCommandMenu = true;
    setIsOpen(true);
    // }

    document.addEventListener('click', closeTagSelectorMenu, false);
  };

  const closeTagSelectorMenu = () => {
    commandTextRef.current = '';
    editor.isCommandMenu = false;
    setIsOpen(false);
    resetCommands();
    // setSelected(0)
    // commandOffset.current = 0
    document.removeEventListener('click', closeTagSelectorMenu, false);
  };

  const resetCommands = () => {
    setCommands([...SlateMenus]);
    commandsLengthRef.current = SlateMenus.length;
    setSelected(0);
    // commandOffset.current = 0
    editor.commands = [...SlateMenus];
    editor.selectedCommand = 0;
  };

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (editor.isCommandMenu) openTagSelectorMenu();

    if (!el) {
      return;
    }

    if (!selection || !ReactEditor.isFocused(editor) || !Range.isCollapsed(selection)) {
      el.removeAttribute('style');
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection) {
      return;
    }
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = '1';

    let elementHeight = 35;
    try {
      elementHeight = ReactEditor.toDOMNode(editor, editor.getCurrentNode()).getBoundingClientRect()
        .height;
      // eslint-disable-next-line no-empty
    } catch {}
    elementHeight = elementHeight > 30 ? 35 : elementHeight;
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight + elementHeight + 5}px`;

    el.style.left = isOpen
      ? left.current.toString()
      : `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2 - 12}px`;

    if (!isOpen) left.current = Number(el.style.left);
  });

  const handleMouseover = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, idx: number) => {
    e.preventDefault();
    if (selected != idx) setSelected(idx);
    // setSelected(Number(e.target.getAttribute(listItemDataAttr)))
    // editorRef.current.focus()
  };

  const handleOnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    x: MenuCommandItem,
  ) => {
    e.preventDefault();
    if (x.type === 'image') {
      openImageAddPrompt();
      return;
    }

    editor.toggleBlock(x.type);
    editor.deleteCurrentNodeText(commandOffset.current);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const confirmEditor = (e: KeyboardEvent): boolean => {
    let selectedEditorName: string | null = null;
    if (e) selectedEditorName = getEditorId(e.target);
    return selectedEditorName === editorName && editor.editorId === editorId;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editor.isFocused() && confirmEditor(e)) {
        if (editor.isCommandMenu || e.key === CMD_KEY) {
          // const commandText = editor.getCurrentNodeText(commandOffset.current)
          if (e.key === CMD_KEY) {
            commandTextRef.current = '';
            commandsLengthRef.current = SlateMenus.length;
            openTagSelectorMenu();
            const eSelection = editor.selection;
            commandOffset.current = eSelection?.anchor?.offset ?? 0;
          } else if (e.key === 'Backspace') {
            if (commandTextRef.current.length > 0)
              commandTextRef.current = commandTextRef.current.slice(0, -1);

            if (commandTextRef.current === '/') resetCommands();
            else if (commandTextRef.current === '') closeTagSelectorMenu();
          } else if (e.key === 'Escape') {
            closeTagSelectorMenu();
          } else if (e.key === 'Enter') {
            if (confirmEditor(e)) {
              e.preventDefault();
              if (editor.commands[editor.selectedCommand].type === 'image') {
                openImageAddPrompt();
                return;
              }
              if (commandsLengthRef.current > 0 && editor.commands[editor.selectedCommand]) {
                editor.toggleBlock(editor.commands[editor.selectedCommand].type);
              }
              editor.deleteCurrentNodeText(commandOffset.current);
              closeTagSelectorMenu();
            }
          }
          if (e.key === 'Tab' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (commandsLengthRef.current === 1) {
              setSelected(0);
              editor.selectedCommand = 0;
            } else
              setSelected((selected) => {
                const newSelected = selected === commandsLengthRef.current - 1 ? 0 : selected + 1;
                editor.selectedCommand = newSelected;
                // document
                //     .querySelector(`[${listItemDataAttr}="${newSelected}"]`)
                //     ?.scrollIntoView()
                return newSelected;
              });
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandsLengthRef.current === 1) {
              setSelected(0);
              editor.selectedCommand = 0;
            } else
              setSelected((selected) => {
                const newSelected = selected === 0 ? commandsLengthRef.current - 1 : selected - 1;
                // document
                //     .querySelector(`[${listItemDataAttr}="${newSelected}"]`)
                //     ?.scrollIntoView()
                editor.selectedCommand = newSelected;
                return newSelected;
              });
          } else {
            if (
              e.key.length === 1 &&
              ((e.key >= 'a' && e.key <= 'z') || (e.key >= '0' && e.key <= '9') || e.key === '/')
            ) {
              commandTextRef.current += e.key;
            }

            // const CommandText = editor.getCurrentNodeText(commandOffset.current)

            if (commandTextRef.current.substring(1, commandTextRef.current.length).length > 0) {
              // setSelected(0)
              const matchedCommands = matchSorter(
                SlateMenus,
                commandTextRef.current.substring(1, commandTextRef.current.length),
                {
                  keys: ['type', 'name'],
                },
              );
              setCommands([...(matchedCommands ?? [])]);
              commandsLengthRef.current = matchedCommands.length;
              editor.commands = matchedCommands;
              editor.selectedCommand = 0;
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <PromptImage
        isOpen={imageAddPromptIsOpen}
        onApply={onImageAdd}
        onCancel={closeImageAddPrompt}
      />

      <Portal>
        <Stack
          // onBlur={closeTagSelectorMenu}
          direction="row"
          borderRadius="lg"
          spacing=".1"
          ref={ref as LegacyRef<HTMLDivElement>}
          position="absolute"
          padding="1"
          zIndex="1"
          top="-10000px"
          left="-10000px"
          opacity={1}
          // backgroundColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
          transition="opacity 0.75s"
          {...props}
        >
          {!children && (
            <React.Fragment>
              <Menu isOpen={isOpen} key="SlateCommandMenu">
                <MenuList
                  ref={menuListRef as LegacyRef<HTMLDivElement>}
                  key="SlateCommandMenuList"
                  minWidth="185px"
                  max-height="300px"
                  overflow="auto"
                  border={menuListBorderColor}
                  css={{
                    '&::-webkit-scrollbar': {
                      height: '8px',
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      height: '6px',
                      width: '5px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#d1d1d1',
                      // borderRadius: '24px',
                    },
                  }}
                  // boxShadow="0 2px 2px rgba(0, 0, 0, 0.4)"
                  // boxShadow="0 1px 4px 0 rgb(0 0 0 / 50%)"
                  boxShadow="base"
                  bg={menuListBGColor}
                  color={menuListColor}
                  // p="0"
                  // my="3px"
                  borderRadius="0"
                  _hover={{}}
                >
                  {commandsLengthRef.current > 0 ? (
                    commands.map((x, idx) => {
                      const isMenuItemActive = editor.isBlockActive(x.type);
                      return (
                        <Box key={x.type + '-Box'}>
                          <Button
                            key={x.type + '-command-btn'}
                            css={buttonStyles}
                            // TODO: extract
                            onClick={(e) => {
                              handleOnClick(e, x);
                            }}
                            data-commandmenuitemidx={idx}
                            // isFocusable={true}
                            // onMouseEnter={handleMouseover}
                            onMouseMove={(e) => handleMouseover(e, idx)}
                            // onMouseLeave={handleMouseover}
                            px="4"
                            borderRadius="0"
                            boxSizing="border-box"
                            borderLeftWidth="3px"
                            // {editor.isBlockActive(x.type)&&
                            backgroundColor={
                              // isMenuItemActive
                              //     ? menuItemBGColor
                              //     :
                              idx === selected ? 'gray.100' : 'unset'
                            }
                            borderColor={
                              isMenuItemActive ? menuItemBorderColor : menuItemBorderColor2
                            }
                            _hover={
                              {
                                // backgroundColor: 'gray.100',
                                // borderLeftWidth: '3px',
                                // borderColor: menuItemBorderColor,
                              }
                            }
                            aria-disabled={false}
                          >
                            <Box me="2" fontSize="sm" as="span">
                              {x.icon}
                            </Box>
                            <Box as="span" fontWeight="400" flex="1 1 0%">
                              {x.name}
                            </Box>
                          </Button>
                          {x.divider && <MenuDivider key={x.type + 'commandMenuDivider'} />}
                        </Box>
                      );
                    })
                  ) : (
                    <Button variant="ghost" disabled={true}>
                      No result
                    </Button>
                  )}
                </MenuList>
              </Menu>
            </React.Fragment>
          )}
          {children && children}
        </Stack>
      </Portal>
    </>
  );
};
