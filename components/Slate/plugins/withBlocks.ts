import { GraspEditor } from '../GraspEditor';
import { Element, Transforms } from 'slate';
import { CustomEditor } from '../slateTypes';

declare module '../slateTypes' {
  interface CustomEditor {
    isBlockActive: (block: string) => boolean;
    toggleBlock: (format: string) => CustomEditor;
  }
}

/**
 * Simple block handling
 */
export const withBlocks = (editor: CustomEditor) => {
  editor.LIST_TYPES = ['numbered-list', 'bulleted-list'];

  /**
   * checks if a block is active
   */
  editor.isBlockActive = (block: string) => {
    const [match] = GraspEditor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === block,
    });
    return !!match;
  };

  /**
   * Toggles the block in the current selection
   */
  editor.toggleBlock = (format: string) => {
    console.log('format', format);
    const isActive = editor.isBlockActive(format);
    const isList = editor.LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) => Element.isElement(n) && editor.LIST_TYPES.includes(n.type),
      split: true,
    });

    //TODO cannot this be generalized??
    Transforms.setNodes(editor, {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    });

    if (!isActive && isList) {
      const selected = { type: format, children: [] } as Element;
      Transforms.wrapNodes(editor, selected);
    }
    return editor;
  };

  return editor;
};
