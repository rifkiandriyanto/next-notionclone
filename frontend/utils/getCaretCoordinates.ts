interface CaretCoordinates {
  x: number | undefined;
  y: number | undefined;
}

const getCaretCoordinates = (fromStart = true): CaretCoordinates => {
  let x: number | undefined, y: number | undefined;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const selection = window.getSelection();
    if (selection?.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange();
      range.collapse(fromStart ? true : false);
      const rect = range.getClientRects()[0];
      if (rect) {
        x = rect.left;
        y = rect.top;
      }
    }
  }
  return { x, y };
};

export default getCaretCoordinates;
