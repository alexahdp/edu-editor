// import isUrl from 'is-url';
import { Transforms } from 'slate';
import { CustomEditor } from '../slateTypes';

const exten = ['jpeg', 'jpg', 'png', 'webp'];

declare module '../slateTypes' {
  interface CustomEditor {
    insertImage: (imageUrl: string) => void;
  }
}

// const isImageUrl = (url: string): boolean => {
//   if (!url) return false;
//   if (!isUrl(url)) return false;
//   const ext = new URL(url).pathname.split('.').pop();
//   if (!ext) return false;
//   return exten.includes(ext);
// };

export const withImages = (editor: CustomEditor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    // @ts-ignore
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertImage = (url: string): void => {
    const image = { type: 'image' as const, url, children: [{ text: '' }] };
    Transforms.insertNodes(editor, image);
  };

  // TODO: is it used??
  // editor.insertData = (data) => {
  //   const text = data.getData('text/plain');
  //   const { files } = data;

  //   if (files && files.length > 0) {
  //     // @ts-ignore
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       const [mime] = file.type.split('/');

  //       if (mime === 'image') {
  //         reader.addEventListener('load', () => {
  //           const url = reader.result;
  //           if (typeof url === 'string') {
  //             insertImage(editor, url);
  //           } else {
  //             throw new Error('url is not a string');
  //           }
  //         });

  //         reader.readAsDataURL(file);
  //       }
  //     }
  //   } else if (isImageUrl(text)) {
  //     insertImage(editor, text);
  //   } else {
  //     insertData(data);
  //   }
  // };

  return editor;
};
