import { GraspEditor } from '../GraspEditor';
import { CustomEditor } from '../slateTypes';

declare module '../slateTypes' {
  interface CustomEditor {
    isMarkActive: (mark: string) => boolean;
    toggleMark: (mark: string) => boolean;
  }
}

/**
 * Helper functions for managing inline marks
 */
export const withMarks = (editor: CustomEditor) => {
  /**
   * Checks if the mark is active
   *
   * @param {String} mark Mark to validate For example: 'bold', 'italic'
   */
  editor.isMarkActive = (mark: string): boolean => {
    const marks = GraspEditor.marks(editor);
    // @ts-ignore
    return marks ? marks[mark] === true : false;
  };

  /**
   * Toggles on/off the mark. If the mark exists it is removed and vice versa.
   *
   * @param {String} mark Mark to validate For example: 'bold', 'italic'
   */
  editor.toggleMark = (mark: string) => {
    editor.isMarkActive(mark)
      ? GraspEditor.removeMark(editor, mark)
      : GraspEditor.addMark(editor, mark, true);

    return editor;
  };

  return editor;
};
