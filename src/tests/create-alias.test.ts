import { createAlias, CreateAliasOptions, Alias } from '../index';
import * as path from 'path';
import * as fs from 'fs';

type TestOptions = {
  root: string;
  baseUrl: string;
  jsconfig?: string | string[];
  tsconfig?: string | string[];
};
const root = path.resolve(__dirname, './test-project');
const baseUrl = '.';

const alias1: Alias = {
  '@': 'src',
  '@components': './src/components',
  '@hooks': './src/hooks',
  '@utils': './src/utils',
};
const alias2: Alias = {
  '#': 'src',
  '#components': './src/components',
  '#hooks': './src/hooks',
  '#utils': './src/utils',
};

const expectedFile1 = {
  compilerOptions: {
    baseUrl,
    paths: {
      '@/*': ['src/*'],
      '@components/*': ['./src/components/*'],
      '@hooks/*': ['./src/hooks/*'],
      '@utils/*': ['./src/utils/*'],
    },
  },
};
const expectedFile2 = {
  compilerOptions: {
    baseUrl,
    paths: {
      '#/*': ['src/*'],
      '#components/*': ['./src/components/*'],
      '#hooks/*': ['./src/hooks/*'],
      '#utils/*': ['./src/utils/*'],
    },
  },
};
const tests: TestOptions[] = [
  {
    root,
    baseUrl,
  },
  {
    root,
    baseUrl,
    jsconfig: `./jsconfig1.json`,
    tsconfig: `./tsconfig1.json`,
  },
  {
    root,
    baseUrl,
    jsconfig: [`./jsconfig2.json`, `./jsconfig3.json`],
    tsconfig: [`./tsconfig2.json`, `./tsconfig3.json`],
  },
];
let cycle = 0;
const runTest = (
  options: TestOptions = tests[0],
  index: number = 0,
  alias: Alias = alias1,
  expectedFile: { [key: string]: any },
  shouldDeleteFile: boolean = false,
) => {
  const prefix = `Alias ${cycle++}`;
  const hasFiles = index > 0;
  const hasArrayFiles = index === 2;
  let files: string[] = [];
  if (hasFiles) {
    if (hasArrayFiles) {
      files = [...(options.jsconfig as string[]), ...(options.tsconfig as string[])];
    } else {
      files = [options.jsconfig as string, options.tsconfig as string];
    }
  }
  // test createAlias alias1
  const created = createAlias(alias, options);

  test(`${prefix} - created alias`, () => {
    expect(created).toEqual(alias);
  });
  if (hasFiles) {
    files.forEach((file) => {
      const filePath = path.resolve(options.root, file);
      const json = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(json);
      test(`${prefix} - ${file} - file data`, () => {
        expect(data).toEqual(expectedFile);
      });
      if (shouldDeleteFile) {
        fs.unlinkSync(filePath);
      }
    });
  }
};
tests.forEach((options, index) => {
  runTest(options, index, alias1, expectedFile1, true);
});

tests.forEach((options, index) => {
  runTest(options, index, alias2, expectedFile2, true);
});
