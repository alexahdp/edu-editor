import { Box, chakra, Heading, OrderedList, Stack, Text, UnorderedList } from '@chakra-ui/react';
import React, { FC } from 'react';
import { ReactNode } from 'react';
import { Node } from 'slate';

const BlockquoteStyle: React.CSSProperties | undefined = {
  margin: '1.5em 10px',
  padding: '0.5em 10px',
};

interface SlateElementBoxProps {
  children: ReactNode;
  my?: string | number;
}
const SlateElementBox = ({ children, my = '3' }: SlateElementBoxProps) => {
  return <Box my={my}>{children}</Box>;
};

interface defaultRenderElementProps {
  element: Node;
  children: Node;
  attributes: Record<string, unknown>;
  handelOnConceptClick: (a: string[]) => void;
}
export const defaultRenderElement = ({
  element,
  children,
  attributes,
  handelOnConceptClick,
}: defaultRenderElementProps) => {
  switch (element.type) {
    case 'block-quote':
      return (
        <SlateElementBox>
          <chakra.blockquote
            style={BlockquoteStyle}
            borderLeftWidth={'10px'}
            borderLeftColor={'gray.200'}
            {...attributes}
          >
            {children}
          </chakra.blockquote>
        </SlateElementBox>
      );
    case 'list-item':
      return (
        <SlateElementBox my={1}>
          <li {...attributes}>{children}</li>
        </SlateElementBox>
      );
    // return <ListItem {...attributes}>{children}</ListItem>
    case 'numbered-list':
      return (
        <SlateElementBox>
          <OrderedList pl="3" {...attributes}>
            {children}
          </OrderedList>
        </SlateElementBox>
      );
    case 'bulleted-list':
      return (
        <SlateElementBox>
          <UnorderedList pl="3" {...attributes}>
            {children}
          </UnorderedList>
        </SlateElementBox>
      );
    case 'heading-0':
      return (
        <Stack isInline alignItems="center">
          <Heading as="h1" size="2xl" mb="6" mt="2.5" {...attributes}>
            {children}
          </Heading>
        </Stack>
      );
    case 'heading-1':
      return (
        <SlateElementBox>
          <Stack isInline alignItems="center">
            <Heading as="h1" size="lg" mb="2" mt="3.5" {...attributes}>
              {children}
            </Heading>
          </Stack>
        </SlateElementBox>
      );
    case 'heading-2':
      return (
        <SlateElementBox>
          <Heading as="h2" size="md" mb="1" mt="3.5" {...attributes}>
            {children}
          </Heading>
        </SlateElementBox>
      );
    case 'heading-3':
      return (
        <SlateElementBox>
          <Heading as="h3" mb="1" mt="3.5" size="sm" {...attributes}>
            {children}
          </Heading>
        </SlateElementBox>
      );
    case 'concept':
      return (
        <Text
          onClick={() => {
            handelOnConceptClick(element.ids);
          }}
          paddingX="3px"
          paddingY="1px"
          borderRadius="sm"
          cursor="pointer"
          data-concept-ids={element.ids ? [...element.ids] : element.ids}
          as="span"
          bg="blue.100"
          {...attributes}
        >
          {children}
        </Text>
      );
    default:
      return (
        <Text placeholder="Type '/' for commands" as="p" mb="2" {...attributes}>
          {children}
        </Text>
      );
  }
};
