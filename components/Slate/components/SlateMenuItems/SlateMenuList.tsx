import React from 'react';
import { MenuList, useColorModeValue } from '@chakra-ui/react';
import { CustomEditor } from 'components/Slate/slateTypes';
import { SlateMenus } from '../..';
import { SlateMenuItem } from './SlateMenuItem';

interface SlateMenuListProps {
  editor: CustomEditor;
  editorRef: HTMLElement | null;
  ref?: null;
}

export const SlateMenuList = ({ editor, editorRef, ref = null }: SlateMenuListProps) => {
  const menuListBorderColor = useColorModeValue('1px solid #ddd', '1px solid #444');
  const menuListBGColor = useColorModeValue('white', 'gray.800');
  const menuListColor = useColorModeValue('black', 'white');

  if (!editor || !editorRef) {
    return null;
  }

  return (
    <MenuList
      ref={ref}
      key="SlateSideMenuList"
      minWidth="185px"
      height="300px"
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
      {SlateMenus.map((x) => (
        <SlateMenuItem
          key={x.name}
          editor={editor}
          editorRef={editorRef}
          id={x.name}
          x={x}
          isMenuItemActive={editor.isBlockActive(x.type)}
        />
      ))}
    </MenuList>
  );
};
