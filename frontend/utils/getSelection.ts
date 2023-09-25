interface SelectionInfo {
  selectionStart: number | undefined;
  selectionEnd: number | undefined;
}

const getSelection = (element: HTMLElement): SelectionInfo => {
  let selectionStart: number | undefined, selectionEnd: number | undefined;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const range = window.getSelection()?.getRangeAt(0);
    if (range) {
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(element);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      selectionStart = preSelectionRange.toString().length;
      selectionEnd = selectionStart + range.toString().length;
    }
  }
  return { selectionStart, selectionEnd };
};

export default getSelection;
