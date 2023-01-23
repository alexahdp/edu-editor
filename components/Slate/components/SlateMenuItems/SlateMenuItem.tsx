import { MenuItem, MenuDivider, useColorModeValue, Box } from '@chakra-ui/react';
import { MenuCommandItem } from 'components/Slate';
import { CustomEditor } from 'components/Slate/slateTypes';
import { ReactElement } from 'react';

interface SlateMenuItemProps {
  editor: CustomEditor;
  editorRef: HTMLElement;
  id: string;
  x: MenuCommandItem;
  isMenuItemActive: boolean;
}

export const SlateMenuItem = ({
  editor,
  editorRef,
  id,
  x,
  isMenuItemActive,
}: SlateMenuItemProps) => {
  const menuItemBorderColor = useColorModeValue('blue.500', 'blue.400');
  const menuItemBorderColor2 = useColorModeValue('white', 'gray.800');
  const menuItemBGColor = useColorModeValue('blue.100', 'blue.600');

  return (
    <Box>
      <MenuItem
        onClick={() => {
          editor.toggleBlock(x.type);
          editorRef.focus();
        }}
        px="4"
        borderRadius="0"
        boxSizing="border-box"
        borderLeftWidth="3px"
        // {editor.isBlockActive(x.type)&&
        backgroundColor={isMenuItemActive ? menuItemBGColor : 'none'}
        borderColor={isMenuItemActive ? menuItemBorderColor : menuItemBorderColor2}
        _hover={{
          backgroundColor: menuItemBGColor,
          borderLeftWidth: '3px',
          borderColor: menuItemBorderColor,
        }}
        icon={x.icon as ReactElement}
      >
        {x.name}
      </MenuItem>
      {x.divider && <MenuDivider key={x.type + 'Divider-' + id} />}
    </Box>
  );
};
