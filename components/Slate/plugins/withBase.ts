import { GraspEditor } from '../GraspEditor';
import { Ancestor, BaseSelection, Path, Range } from 'slate';
import { Transforms } from 'slate';
import { Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { CustomEditor } from '../slateTypes';

declare module '../slateTypes' {
  interface CustomEditor {
    type: string;

    // ????
    // selection: Selection | BaseRange;
    selection: BaseSelection;

    // ????
    rememberedSelection: Selection | BaseSelection | {};
    // isLocation: (value: any) => value is Location;

    isSelectionExpanded: () => boolean;
    isSelectionCollapsed: () => boolean;
    unwrapNode: (type: string) => void;
    isNodeTypeActive: (type?: string) => boolean;
    rememberCurrentSelection: () => void;
    isCollapsed: () => boolean;
    wrapNode: (node: Node, wrapSelection: BaseSelection | null) => void;
    findNodesByType: (type: string) => Node[];
    serialize: (nodes: Node[]) => string;
    getSelectedText: () => string;
    getCurrentNodeText: (anchorOffset: number, focusOffset?: number) => string;
    getCurrentNode: () => Node;
    getCurrentNodePath: () => Path;
    deleteCurrentNodeText: (anchorOffset: number, focusOffset?: number) => void;
  }
}

/**
 *
 * Base plugin for Material Slate.
 *
 * All other plugins assume this plugin exists and has been included.
 *
 * @param {Editor} editor
 */
export const withBase = (editor: CustomEditor) => {
  /**
   * Is the current editor selection a range, that is the focus and the anchor are different?
   *
   * @returns {boolean} true if the current selection is a range.
   */
  editor.isSelectionExpanded = (): boolean => {
    return editor.selection ? Range.isExpanded(editor.selection) : false;
  };

  /**
   * Returns true if current selection is collapsed, that is there is no selection at all
   * (the focus and the anchor are the same).
   *
   * @returns {boolean} true if the selection is collapsed
   */
  editor.isSelectionCollapsed = (): boolean => {
    return !editor.isSelectionExpanded();
  };

  /**
   * Is the editor focused?
   * @returns {boolean} true if the editor has focus. */
  editor.isFocused = () => {
    return ReactEditor.isFocused(editor);
  };

  /**
   * Unwraps any node of `type` within the current selection.
   */
  editor.unwrapNode = (type: string) => {
    Transforms.unwrapNodes(editor, { match: (n: Node) => n.type === type });
  };

  /**
   *
   * @param {string} type type of node to be checked. Example: `comment`, `numbered-list`
   * @returns {bool} true if within current selection there is a node of type `type`
   */
  editor.isNodeTypeActive = (type?: string): boolean => {
    const [node] = GraspEditor.nodes(editor, { match: (n: Node) => n.type === type });
    return !!node;
  };

  /**
   * Variable for holding a selection may be forgotten.
   */
  editor.rememberedSelection = {};
  editor.selectedCommand = 0;

  /**
   * Gets current selection and stores it in rememberedSelection.
   * This may be useful when you need to open a dialog box and the editor loses the focus
   */
  editor.rememberCurrentSelection = () => {
    editor.rememberedSelection = editor.selection;
  };

  /**
   * Is the current selection collapsed?
   */
  editor.isCollapsed = (): boolean => {
    const { selection } = editor;
    // @ts-ignore
    return Boolean(selection) && Range.isCollapsed(selection);
  };

  /**
   * Wraps a selection with an argument. If `wrapSelection` is not passed
   * uses current selection
   *
   * Upon wrapping moves the cursor to the end.
   *
   * @param {Node} node the node to be added
   * @param {Selection} wrapSelection selection of the text that will be wrapped with the node.
   *
   */
  editor.wrapNode = (node: Node, wrapSelection: BaseSelection | null = null) => {
    //if wrapSelection is passed => we use it. Use editor selection in other case
    editor.selection = wrapSelection ? wrapSelection : editor.selection;

    // if the node is already wrapped with current node we unwrap it first.
    if (node.type && editor.isNodeTypeActive(node.type)) {
      editor.unwrapNode(node.type);
    }

    // if there is no text selected => insert the node.
    if (editor.isCollapsed()) {
      Transforms.insertNodes(editor, node);
    } else {
      //text is selected => add the node
      // @ts-ignore
      Transforms.wrapNodes(editor, node, { split: true });
      Transforms.collapse(editor, { edge: 'end' });
    }
    // Add {isLast} property to the last fragment of the comment.
    // const path = [...GraspEditor.last(editor, editor.selection)[1]]
    // The last Node is a text whose parent is a comment.
    // path.pop() // Removes last item of the path, to point the parent
    // Transforms.setNodes(editor, { isLast: true } as unknown, { at: path }) //add isLast
  };

  /**
   * Unwraps or removes the nodes that are not in the list.
   *
   * It will search for all the nodes of `type` in the editor and will keep only
   * the ones in the nodesToKeep.
   *
   * It assumes each item of nodesToKeep has an attribute `id`. This attribute will be the discriminator.
   */

  /**
   * Removes the nodes that are not in the list of Ids
   *
   * Nodes of type `type` shall have the attribute/property `id`
   *
   * Example:
   * ```
   * {
   *    type: `comment`
   *    id: 30
   *    data: { ... }
   *  }
   * ```
   */

  /**
   * Gets from current editor content the list of items of a particular type
   */
  editor.findNodesByType = (type) => {
    const list = GraspEditor.nodes(editor, {
      match: (n) => n.type === type,
      at: [],
    });

    // List in editor with path and node
    const listWithNodesAndPath = Array.from(list);

    // List with node (element)
    const listWithNodes = listWithNodesAndPath.map((item) => item[0]);

    return listWithNodes;
  };

  /**
   * Returns the serialized value (plain text)
   */
  editor.serialize = (nodes: Node[]) => {
    return nodes.map((n) => Node.string(n)).join('\n');
  };

  /**
   * Is to get the selected plain text from the editor.selection
   *
   * @returns {string} selected text
   */
  editor.getSelectedText = (): string => {
    if (editor.rememberedSelection) {
      // @ts-ignore
      return GraspEditor.string(editor, editor.rememberedSelection);
    } else {
      return '';
    }
  };

  editor.isCommandMenu = false;

  editor.getCurrentNodeText = (anchorOffset = 0, focusOffset?): string => {
    const { selection } = editor;

    if (selection)
      return GraspEditor.string(editor, {
        anchor: { ...selection?.anchor, offset: anchorOffset },
        focus: focusOffset
          ? { ...selection?.anchor, offset: focusOffset }
          : { ...selection?.anchor },
      });

    return '';
  };

  editor.getCurrentNode = (): Ancestor => {
    // @ts-ignore
    const [node] = GraspEditor.parent(editor, editor.selection);
    return node;
  };

  editor.getCurrentNodePath = (): Path => {
    // @ts-ignore
    const [, path] = GraspEditor.parent(editor, editor.selection);
    return path;
  };

  editor.deleteCurrentNodeText = (anchorOffset = 0, focusOffset?: number): void => {
    const { selection } = editor;
    if (!selection) return;

    Transforms.delete(editor, {
      at: {
        anchor: { ...selection.anchor, offset: anchorOffset },
        focus: focusOffset ? { ...selection.anchor, offset: focusOffset } : { ...selection.anchor },
      },
    });
  };

  return editor;
};
