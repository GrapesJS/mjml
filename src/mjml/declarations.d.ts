// MJML v4's companion packages do not ship TypeScript declarations.
declare module 'mjml-preset-core' {
  const preset: import('./index').MjmlPreset;
  export default preset;
}

declare module 'mjml-validator' {
  export function registerDependencies(dependencies: import('./index').MjmlDependencies): void;
}
