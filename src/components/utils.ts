import type { Editor } from 'grapesjs';
import type { MjmlOptions } from '../mjml';
import { MjmlParser } from "./parser";

export const isComponentType = (type: string) => (el: Element) => (el.tagName || '').toLowerCase() === type;

export function mjmlConvert (parser: MjmlParser, mjml: string, fonts: Record<string, string>, opts: MjmlOptions = {}) {
  const options: MjmlOptions = {
    useMjmlConfigOptions: false,
    mjmlConfigPath: undefined,
    filePath: undefined,
    ...opts,
  };

  // Check that fonts parameter is not empty for add to options
  if (fonts && (Object.keys(fonts).length > 0 && fonts.constructor === Object)) {
    // @ts-ignore
    options.fonts = fonts;
  }

  return parser(mjml, options);
}

export const componentsToQuery = (cmps: string | string[]): string => {
  const cmpsArr = Array.isArray(cmps) ? cmps : [cmps];
  return cmpsArr.map(cmp => `[data-gjs-type="${cmp}"]`).join(', ');
};

export const getName = (editor: Editor, name: string): string => {
  return editor.I18n.t(`grapesjs-mjml.components.names.${name}`);
};

const syncAttributes = (currentEl: Element, nextEl: Element) => {
  Array.from(currentEl.attributes).forEach(({ name }) => {
    if (!nextEl.hasAttribute(name)) {
      currentEl.removeAttribute(name);
    }
  });

  Array.from(nextEl.attributes).forEach(({ name, value }) => {
    if (currentEl.getAttribute(name) !== value) {
      currentEl.setAttribute(name, value);
    }
  });
};

const reconcileNode = (currentNode: Node, nextNode: Node) => {
  // Different node type/name → replace the node. Known limitation: when an
  // mj-image link wrapper is added or removed (td > img <-> td > a > img), the
  // element at this index changes (img <-> a), so the real <img> is replaced
  // rather than moved. The image therefore reloads on that href add/remove
  // *transition* (steady-state href value edits, a -> a, keep the node). See the
  // 'replaces the rendered img when a link wrapper is added or removed' test.
  if (currentNode.nodeType !== nextNode.nodeType || currentNode.nodeName !== nextNode.nodeName) {
    currentNode.parentNode!.replaceChild(nextNode.cloneNode(true), currentNode);
    return;
  }

  if (currentNode.nodeType === Node.TEXT_NODE) {
    if (currentNode.textContent !== nextNode.textContent) {
      currentNode.textContent = nextNode.textContent;
    }
    return;
  }

  if (currentNode.nodeType === Node.ELEMENT_NODE) {
    syncAttributes(currentNode as Element, nextNode as Element);
  }

  reconcileChildren(currentNode, nextNode);
};

// Minimal, index-based DOM reconciliation. It assumes the two trees are
// positionally stable (same children, in the same order, across renders), which
// holds for mj-image's fixed output (td > a? > img). Do NOT reuse this for
// reorderable or keyed lists: index matching would mutate the wrong nodes in
// place instead of detecting moves.
export const reconcileChildren = (currentParent: Node, nextParent: Node) => {
  const currentChildren = Array.from(currentParent.childNodes);
  const nextChildren = Array.from(nextParent.childNodes);
  const length = Math.max(currentChildren.length, nextChildren.length);

  for (let index = 0; index < length; index++) {
    const currentNode = currentChildren[index];
    const nextNode = nextChildren[index];

    if (!currentNode) {
      currentParent.appendChild(nextNode.cloneNode(true));
    } else if (!nextNode) {
      currentParent.removeChild(currentNode);
    } else {
      reconcileNode(currentNode, nextNode);
    }
  }
};

export function debounce<T extends (...params: any) => any>(clb: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return function(this: any, ...args: IArguments[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      clearTimeout(timeout);
      clb.apply(this, args);
    }, wait);
  } as T;
};
