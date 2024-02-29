export function scrollToItemInput(elItemInput: HTMLInputElement) {
  elItemInput.scrollIntoView();
}
export function focusItemInput(elItemInput: HTMLInputElement) {
  elItemInput.focus();
}
export function selectAllInItemInput(elItemInput: HTMLInputElement) {
  elItemInput.select();
}
export function activateItemInput(elItemInput: HTMLInputElement) {
  scrollToItemInput(elItemInput);
  focusItemInput(elItemInput);
}
