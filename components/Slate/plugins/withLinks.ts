import { BaseSelection, Editor, Element as SlateElement, Range, Transforms } from 'slate';
import { CustomEditor, LinkElement } from '../slateTypes';

declare module '../slateTypes' {
  interface CustomEditor {
    wrapLink: (url: string) => void;
    unwrapLink: (editor: CustomEditor) => void;
    removeLink: (opts?: Record<string, unknown>) => void;
  }
}

const isLinkActive = (editor: Editor): boolean => {
  const [link] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
  return !!link;
};

const createLinkNode = (url: string, text: string): LinkElement => ({
  type: 'link' as const,
  url,
  children: [{ text }],
});

export const withLinks = (editor: CustomEditor): CustomEditor => {
  const { isInline } = editor;
  const LINK_TYPE = 'link';

  /**
   * Set link type not to be an inline element
   */
  editor.isInline = (element) => {
    return element.type === LINK_TYPE ? true : isInline(element);
  };

  /**
   * If the editor loses focus upon pressing the `LinkButton`, you need to call
   * editor.rememberCurrentSelection() before the editor loses the focus
   */
  editor.insertLink = (url) => {
    if (editor.isNodeTypeActive(LINK_TYPE)) {
      // TODO: WTF???
      editor.unwrapNode(LINK_TYPE);
    }
    // editor selection on link button click
    const wrapSelection = editor.selection || editor.rememberedSelection;
    // @ts-ignore
    editor.selection = wrapSelection ? wrapSelection : editor.selection;
    const node: LinkElement = {
      type: LINK_TYPE,
      url,
      children: editor.isCollapsed() ? [{ text: url }] : [],
    };
    editor.wrapNode(node, wrapSelection as BaseSelection);
  };

  editor.wrapLink = (url: string): void => {
    if (isLinkActive(editor)) {
      editor.unwrapLink(editor);
    }

    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);

    const link = createLinkNode(url, 'New Link');

    if (isCollapsed) {
      Transforms.insertNodes(editor, link);
    } else {
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: 'end' });
    }
  };

  editor.unwrapLink = (editor: Editor): void => {
    Transforms.unwrapNodes(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    });
  };

  editor.removeLink = (opts?: Record<string, unknown>): void => {
    Transforms.unwrapNodes(editor, {
      ...opts,
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    });
  };

  return editor;
};
