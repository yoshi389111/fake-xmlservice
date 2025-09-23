# @yoshi389111/fake-xmlservice

This library provides a Node.js implementation of Google Apps Script's [XmlService](https://developers.google.com/apps-script/reference/xml-service/xml-service).  
It allows you to parse and serialize XML locally, making it easy to test and develop code that depends on XmlService outside the [Google Apps Script](https://developers.google.com/apps-script) environment.

## Installation

You can install this library via npm:

```bash
npm install --save-dev @yoshi389111/fake-xmlservice
```

## Usage

`@yoshi389111/fake-xmlservice` provides implementations of `XmlService` that can be used in unit tests.

You don't `import`/`require` it directly in your test files. Instead, configure your test runner to load it automatically before your tests run.

### Jest

In your `jest.config.ts` (or `jest.config.js`), add this library to `setupFilesAfterEnv`:

```ts
import type { Config } from 'jest';

const config: Config = {
  // ...
  setupFilesAfterEnv: [ '@yoshi389111/fake-xmlservice' ],
  // ...
};

export default config;
```

This ensures the implementations are available globally during your Jest tests.

### Vitest

In your `vitest.config.ts`, use the `setupFiles` option:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // ...
  test: {
    // ...
    setupFiles: ['@yoshi389111/fake-xmlservice'],
    // ...
  },
  // ...
});
```

Now the fake services will be registered before your tests run.

## Copyright

&copy; 2025 SATO Yoshiyuki. Licensed under the MIT License.
