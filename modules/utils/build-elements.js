export function createGenericElement(el, arrayCls, attrsObj, content) {
  const element = document.createElement(el);
  arrayCls.length && arrayCls.forEach((cls) => element.classList.add(cls));
  if (Object.keys(attrsObj).length) {
    for (let [attr, value] of Object.entries(attrsObj)) {
      element.setAttribute(attr, value);
    }
  }
  if (content) {
    element.textContent = content;
  }

  return element;
}

export function createElementWithClass(el, arrayCls) {
  const element = document.createElement(el);
  arrayCls.forEach((cls) => element.classList.add(cls));
  return element;
}

export function createElementWithAttr(el, attributesObj) {
  const element = document.createElement(el);
  for (let [attr, value] of Object.entries(attributesObj)) {
    element.setAttribute(attr, value);
  }
  return element;
}

export function createElementWithContent(el, content) {
  const element = document.createElement(el);
  element.textContent = content;
  return element;
}
