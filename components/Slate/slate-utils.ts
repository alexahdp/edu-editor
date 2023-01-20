const isHtmlElement = (elem: unknown): elem is HTMLElement => {
  return elem instanceof HTMLElement;
};

export const getEditorId = (element: EventTarget | null): string | null => {
  let editor: HTMLElement | null = null;
  if (!element) return null;

  if (isHtmlElement(element)) {
    if (element?.closest) {
      editor = element.closest('[data-editor-name]');
      if (editor) return editor.getAttribute('data-editor-name');
    } else {
      let currentElement: HTMLElement | null | undefined = element.parentElement;
      while (
        (currentElement = currentElement?.parentElement) &&
        !(currentElement.matches || currentElement.matchesSelector).call(
          currentElement,
          '[data-editor-name]',
        )
      );

      if (element) return element.getAttribute('data-editor-name');
    }
  }

  return null;
};
