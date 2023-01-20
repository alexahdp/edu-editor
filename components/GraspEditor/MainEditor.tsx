import { useEffect, useState } from 'react';
import { Descendant, Editor } from 'slate';
import { GraspEditable, GraspSlate, HoveringToolbar } from '../Slate';
import { SlateCommand } from '../Slate/components/Command/SlateCommand';
import { MenuHandler } from '../Slate/components/MenuHandler/MenuHandler';

interface MainEditorProps {
  editorKey: string;
  editor: Editor;
  value: Descendant[];
  setValue: (v: Descendant[]) => void;
  onEditorChange: (v: Descendant[]) => void;
  readOnly?: boolean;
}

export const MainEditor = ({
  editor,
  editorKey,
  onEditorChange,
  value,
  readOnly = false,
}: MainEditorProps) => {
  const [winReady, setWinReady] = useState(false);

  useEffect(() => {
    setWinReady(true);
  }, []);

  return (
    <>
      {winReady && (
        <GraspSlate key={editorKey} editor={editor} value={value} onChange={onEditorChange}>
          <HoveringToolbar />
          <MenuHandler />
          <SlateCommand />
          <GraspEditable readOnly={readOnly} />
        </GraspSlate>
      )}
    </>
  );
};
