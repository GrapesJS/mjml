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
