import mjml2html from 'mjml-browser';

export const isComponentType = type => (el) => el.tagName === type.toUpperCase();

export function mjmlConvert (mjml, fonts) {
  let options = {
    useMjmlConfigOptions: false,
    mjmlConfigPath: null,
    filePath: null
  };

  // Check that fonts parameter is not empty for add to options
  if (fonts && (Object.keys(fonts).length > 0 && fonts.constructor === Object)) {
    options.fonts = fonts;
  }

  return mjml2html(mjml, options);
}

export const componentsToQuery = (cmps) => {
  const cmpsArr = Array.isArray(cmps) ? cmps : [cmps];
  return cmpsArr.map(cmp => `[data-gjs-type="${cmp}"]`).join(', ');
};

export const getName = (editor, name) => {
  return editor.I18n.t(`grapesjs-mjml.components.names.${name}`);
};

export function debounce(clb, wait) {
  let timeout;
  return function() {
    const context = this;
    let args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      clearTimeout(timeout);
      clb.apply(context, args);
    }, wait);
  };
};