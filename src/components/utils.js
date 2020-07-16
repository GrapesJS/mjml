import mjml2html from 'mjml';

export const isComponentType = type => (el) => el.tagName === type.toUpperCase();

export function mjmlConvert (mjml) {
  return mjml2html(mjml, {
    useMjmlConfigOptions: false,
    mjmlConfigPath: null,
    filePath: null
  });
}
