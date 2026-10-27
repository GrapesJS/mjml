import type { Component, MJMLJsonObject, MJMLParsingOptions, MJMLParseResults } from 'mjml-core';

export type MjmlDependencies = Record<string, string[]>;

export type MjmlComponent = typeof Component & {
  componentName?: string;
  endingTag?: boolean;
  dependencies?: MjmlDependencies;
};

export interface MjmlPreset {
  components: MjmlComponent[];
  dependencies: MjmlDependencies;
}

export interface MjmlOptions extends MJMLParsingOptions {
  presets?: MjmlPreset[];
}

export type MjmlParser = (input: string | MJMLJsonObject, options?: MjmlOptions) => MJMLParseResults;

export { mjml2html, registerDependencies } from './browser';
export { BodyComponent, HeadComponent, registerComponent } from 'mjml-core';
