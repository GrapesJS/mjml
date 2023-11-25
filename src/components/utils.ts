import type { Editor } from 'grapesjs';
import { MJMLParsingOptions } from "mjml-core";
import { MjmlParser } from "./parser";

export const isComponentType = (type: string) => (el: Element) => (el.tagName || '').toLowerCase() === type;

export function mjmlConvert (parser: MjmlParser, mjml: string, fonts: Record<string, string>, opts: Partial<MJMLParsingOptions> = {}) {
  const options: MJMLParsingOptions = {
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