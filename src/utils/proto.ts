HTMLElement.prototype.setVisible = function (visible: boolean): void {
  if (visible) this.classList.remove('hidden');
  else this.classList.add('hidden');
};

HTMLElement.prototype.isVisible = function (): boolean {
  return this.classList.contains('hidden');
};
