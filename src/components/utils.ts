// @ts-ignore
import mjml2html from 'mjml-browser';
import type { Editor } from 'grapesjs';

export const isComponentType = (type: string) => (el: Element) => (el.tagName || '').toLowerCase() === type;

export function mjmlConvert (mjml: string, fonts: Record<string, string>, opts: Record<string, any> = {}) {
  const options = {
    useMjmlConfigOptions: false,
    mjmlConfigPath: null,
    filePath: null,
    ...opts,
  };

  // Check that fonts parameter is not empty for add to options
  if (fonts && (Object.keys(fonts).length > 0 && fonts.constructor === Object)) {
    // @ts-ignore
    options.fonts = fonts;
  }

  return mjml2html(mjml, options);
}

export const componentsToQuery = (cmps: string | string[]): string => {
  const cmpsArr = Array.isArray(cmps) ? cmps : [cmps];
  return cmpsArr.map(cmp => `[data-gjs-type="${cmp}"]`).join(', ');
};

export const getName = (editor: Editor, name: string): string => {
  return editor.I18n.t(`grapesjs-mjml.components.names.${name}`);
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