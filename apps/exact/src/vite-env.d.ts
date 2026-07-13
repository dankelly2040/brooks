/// <reference types="vite/client" />

// The source-linked @exact packages include Bun-executable scripts that read
// `import.meta.main`; this app's explicit `types` list excludes bun-types,
// so declare the property here for typechecking.
interface ImportMeta {
  readonly main?: boolean;
}
