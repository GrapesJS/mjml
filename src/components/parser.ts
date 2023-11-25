// @ts-ignore
import mjml2html from 'mjml-browser';
import mjml from "mjml-core";

/**
 * MJML Parser.
 * 
 * @see {@link https://github.com/mjmlio/mjml/tree/master/packages/mjml-core}
 */
export type MjmlParser = typeof mjml;

/**
 * MJML Parser instance.
 */
export default mjml2html as MjmlParser;
