import { createEditor } from 'slate';

// slate plugins
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
// Import material editor plugins
import { withBase } from './plugins/withBase';
import { withMarks } from './plugins/withMarks';
import { withBlocks } from './plugins/withBlocks';
import { withHtml } from './plugins/withHtml';
import { CustomEditor } from './slateTypes';
import { withLinks } from './plugins/withLinks';

/**
 * Creates a RichText editor.
 *
 * Includes the following plugins
 *  - withBlocks
 *  - withMarks
 *  - withBase
 *  - withHistory
 *  - withReact
 *
 * @param {string} editorId Optional unique identifier in case you have more than one editor.
 *   Defaults to default.
 * @public
 */
export const CreateGraspEditor = (editorId = 'default') => {
  // const editorRef = useRef<CustomEditor>()

  const editor = withBlocks(
    withLinks(
      withMarks(withBase(withHtml(withHistory(withReact(createEditor() as CustomEditor))))),
    ),
  );

  editor.editorId = editorId;
  return editor;
};
