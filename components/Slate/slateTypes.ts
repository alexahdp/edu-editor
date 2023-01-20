import { ReactEditor } from 'slate-react';
import { BaseEditor, Element, Node, Selection, Path, Descendant } from 'slate';
import { HistoryEditor } from 'slate-history';
import { MenuCommandItem } from '.';

export type Nullable<T> = T | null;

export interface SlateGraspEditorBase extends ReactEditor {
  //with Base
  editorId: string;
  isSelectionExpanded: () => boolean;
  isSelectionCollapsed: () => boolean;
  isFocused: () => boolean;
  // unwrapNode: (node: Node, options?) => void;
  isNodeTypeActive: (type: string) => boolean;
  rememberedSelection: Selection;
  rememberCurrentSelection: () => void;
  isCollapsed: () => boolean;
  wrapNode: (node: Node, wrapSelection: Nullable<Selection>) => boolean;
  syncExternalNodes: (type: string, nodesToKeep: Node[], unwrap: boolean) => void;
  removeNotInList: (type: string, listOfIds: string[]) => void;
  unwrapNotInList: (type: string, listOfIds: string[]) => void;
  findNodesByType: (type: string) => Node[];
  serialize: (nodes: Node[]) => string;
  syncExternalNodesWithTemporaryId: (type: string, nodesToKeep: Node[], unwrap: boolean) => void;
  getSelectedText: () => string;
  deleteCurrentNodeText: (anchorOffset?: number, focusOffset?: number) => string;
  getCurrentNodeText: (anchorOffset?: number, focusOffset?: number) => string;
  getCurrentNode: () => Node;
  getCurrentNodePath(): Path;
  isCommandMenu: boolean;
  commands: MenuCommandItem[];
  selectedCommand: number;
  //With Mark
  // isMarkActive: (mark: string) => boolean;
  // toggleMark: (mark: string) => CustomEditor;
  //With links
  isInline: (element: Element) => boolean;
  insertLink: (url: string) => void;
  insertConcept: (id: string) => void;
  //   insertData: (data: any) => void;
  insertData: (data: DataTransfer) => void;
  //With Blocks
  // isBlockActive: (block: Node) => boolean;
  // toggleBlock: (format: string) => CustomEditor;
  LIST_TYPES: string[];
  //With Blocks
}

export type CustomEditorOrigin = BaseEditor & ReactEditor & HistoryEditor & SlateGraspEditorBase;

// @ts-ignore
export interface CustomEditor extends SlateGraspEditorBase, ReactEditor, HistoryEditor {}

export type BlockQuoteElement = { type: 'block-quote'; children: Descendant[] };

export type BulletedListElement = {
  type: 'bulleted-list';
  children: ListItemElement[];
};

export type NumberedListElement = {
  type: 'numbered-list';
  children: ListItemElement[];
};

export type CheckListItemElement = {
  type: 'check-list-item';
  checked: boolean;
  children: Descendant[];
};

export type EditableVoidElement = {
  type: 'editable-void';
  children: EmptyText[];
};

// export type HeadingElement = { type: 'heading'; children: CustomText[] }

// export type HeadingTwoElement = { type: 'heading-two'; children: CustomText[] }

export type HeadingTitleElement = {
  type: 'heading-0';
  children: CustomText[];
};

export type HeadingOneElement = {
  type: 'heading-1';
  children: CustomText[];
};
export type HeadingTwoElement = {
  type: 'heading-2';
  children: CustomText[];
};
export type HeadingThreeElement = {
  type: 'heading-3';
  children: CustomText[];
};

export type CodeBlockElement = {
  type: 'code-block';
  children: CustomText[];
};

export type ImageElement = {
  type: 'image';
  url: string;
  children: EmptyText[];
};

export type LinkElement = { type: 'link'; url: string; children: CustomText[] };

export type ListItemElement = { type: 'list-item'; children: Descendant[] };

export type MentionElement = {
  type: 'mention';
  character: string;
  children: CustomText[];
};

export type TableRow = unknown;
export type TableCell = unknown;

export type ParagraphElement = { type: 'paragraph'; children: Descendant[] };

export type TableElement = { type: 'table'; children: TableRow[] };

export type TableCellElement = { type: 'table-cell'; children: CustomText[] };

export type TableRowElement = { type: 'table-row'; children: TableCell[] };

export type TitleElement = { type: 'title'; children: Descendant[] };

export type VideoElement = { type: 'video'; url: string; children: EmptyText[] };

export type CustomElement =
  | BlockQuoteElement
  | BulletedListElement
  | NumberedListElement
  | CheckListItemElement
  | EditableVoidElement
  | HeadingTitleElement
  | HeadingOneElement
  | HeadingTwoElement
  | HeadingThreeElement
  | ImageElement
  | LinkElement
  | ListItemElement
  | MentionElement
  | ParagraphElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | TitleElement
  | VideoElement
  | CodeBlockElement;

export type CustomText = {
  type?: string;
  text: string;
  bold?: true;
  code?: true;
  italic?: true;
  strikethrough?: true;
  underlined?: true;
  underline?: true;
  href?: string;
};

export type EmptyText = {
  text: string;
  type?: string;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText | EmptyText;
  }
}
