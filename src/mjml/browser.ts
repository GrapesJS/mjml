/// <reference path="./declarations.d.ts" />

import compile, { registerComponent } from 'mjml-core';
import preset from 'mjml-preset-core';
import { registerDependencies as registerMjmlDependencies } from 'mjml-validator';
import type { MjmlDependencies, MjmlParser } from './index';

preset.components.forEach((component) => registerComponent(component));
registerMjmlDependencies(preset.dependencies);

export const mjml2html: MjmlParser = (input, options) => compile(input, {
  ...options,
  // Browser and headless compilation use in-memory components only.
  ignoreIncludes: true,
  useMjmlConfigOptions: false,
  mjmlConfigPath: undefined,
});

export const registerDependencies: (dependencies: MjmlDependencies) => void = registerMjmlDependencies;
