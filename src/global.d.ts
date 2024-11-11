declare global {
  interface HTMLElement {
    setVisible(visible: boolean): void;
    isVisible(): boolean;
  }
}
export {};
