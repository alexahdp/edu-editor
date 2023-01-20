export {};

declare global {
  interface HTMLElement {
    matchesSelector: (s: string) => boolean;
  }
}
