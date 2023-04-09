# @pbbbl/create-alias
<!-- Creates path aliases for your TS or JS project by auto-generating and/or auto-updating jsconfig or tsconfig files. -->
@pbbbl/create-alias is an npm package that creates path aliases for your TypeScript or JavaScript project by auto-generating and/or auto-updating jsconfig or tsconfig files.

## Installation
You can install @pbbbl/create-alias using npm or yarn.
> Note: This package is not meant to be used in production. It is meant to be used in development only.

### npm

```bash
npm install -D @pbbbl/create-alias
```
### yarn
```bash
yarn add -D @pbbbl/create-alias
```

## Usage
```js
import createAlias, { createAliasOptions } from '@pbbbl/create-alias';

const alias = {
  '@components': './src/components',
  '@utils': './src/utils',
};

const options = {
  root: '.',
  baseUrl: '.',
  jsconfig: 'jsconfig.json',
  tsconfig: ['tsconfig.json', 'packages/foo/tsconfig.json'],
};

createAlias(alias, options);
```

## API
`createAlias(alias: Alias, options?: CreateAliasOptions): Alias`

The main function to create path aliases.

### `alias` (required) 
An object which maps the alias to their corresponding paths.

#### Example
```ts
const alias = {
  '@components': './src/components',
  '@utils': './src/utils',
};
```

#### `Alias` Type
```ts
type Alias = Record<string, string>;
```

### `options` (optional)

An object to specify output files, behaviors.

| Option     | Required/Optional | Default/Recommended Value | Description                                                                                                        |
| ---------- | ----------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `root`     | Required          | `__dirname` (recommended) | The root directory for your project. Or the full path to the directory where your tsconfig/jsconconfig files live. |
| `baseUrl`  | Optional          | `"."` (default)           | The baseUrl for the compiler options in your config file.                                                          |
| `jsconfig` | Optional          | `undefined`               | The path or an array of paths to the jsconfig files to be created or updated.                                      |
| `tsconfig` | Optional          | `undefined`               | The path or an array of paths to the tsconfig files to be created or updated.                                      |

#### Example
```js
const options = {
  root: '.',
  baseUrl: '.',
  jsconfig: 'jsconfig.json',
  tsconfig: ['tsconfig.json', 'packages/foo/tsconfig.json'],
};
```

#### `CreateAliasOptions` Type
```ts
interface CreateAliasOptions {
  root: string;
  baseUrl?: string;
  jsconfig?: string | string[];
  tsconfig?: string | string[];
}
```

### Returns
The same alias object passed to the function.

## Contributing
Contributions are welcome! Please feel free to submit a [Pull Request](https://github.com/pbbbl/create-alias/pulls).

## License
This project is licensed under the ISC License. See the [LICENSE](https://raw.githubusercontent.com/pbbbl/create-alias/main/LICENSE) file for details.


