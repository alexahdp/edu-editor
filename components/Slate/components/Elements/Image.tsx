import { Box, Button, Stack } from '@chakra-ui/react';
import { ImageElement } from 'components/Slate/slateTypes';
import { ReactNode, useCallback, useRef } from 'react';
import { HTMLAttributes } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { Transforms } from 'slate';
import { ReactEditor, useFocused, useSelected, useSlateStatic } from 'slate-react';

export const Image = ({
  attributes,
  children,
  element,
}: {
  attributes: HTMLAttributes<{}>;
  children: ReactNode;
  element: ImageElement;
}) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);
  const imageRef = useRef(null);

  const handleRemove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('remove image');
      Transforms.removeNodes(editor, { at: path });
    },
    [path, editor],
  );

  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      {children}
      <div
        contentEditable={false}
        style={{
          position: 'relative',
        }}
      >
        <img
          src={element.url}
          alt=""
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '20em',
            boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : 'none',
          }}
        />
        <Box>
          <Stack
            style={{
              display: selected && focused ? 'inline' : 'none',
              top: '0.5em',
              left: '0.5em',
            }}
            direction="row"
            borderRadius="lg"
            spacing=".1"
            ref={imageRef}
            position="absolute"
            padding="1"
            top={'0.5em'}
            left={'0.5em'}
            backgroundColor={'white'}
          >
            <Button
              onClick={handleRemove}
              style={{
                position: 'absolute',
                top: '0.5em',
                left: '0.5em',
                backgroundColor: 'white',
              }}
            >
              <MdDeleteOutline />
            </Button>
          </Stack>
        </Box>
      </div>
    </div>
  );
};
