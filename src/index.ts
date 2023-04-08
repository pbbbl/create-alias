import * as fs from 'fs';
import * as path from 'path';


export type Alias = Record<string, string>;
export interface CreateAliasOptions {

    root?: string;
    baseUrl?: string;
    jsconfig?: string | string[];
    tsconfig?: string | string[];
}

function createAlias(
    alias: Alias,
    createAliasOptions: CreateAliasOptions = {
        root: '.',
        baseUrl: '.',
        jsconfig: undefined,
        tsconfig: undefined,
    }): Alias {
    const { root, baseUrl, jsconfig, tsconfig }: CreateAliasOptions = {
        root: '.',
        baseUrl: '.',
        jsconfig: undefined,
        tsconfig: undefined,
        ...createAliasOptions,
    }
    const paths: Record<string, string[]> = {};
    Object.keys(alias).forEach((key) => {
        const aliasPath = alias[key];
        paths[`${key}/*`] = [`${aliasPath}/*`];
    });
    const jsconfigContent = {
        compilerOptions: {
            baseUrl,
            paths,
        },
    };
    if (jsconfig) {
        if (Array.isArray(jsconfig)) {
            jsconfig.forEach((configPath) => {
                updateOrCreateConfigFile(path.resolve(root, configPath), jsconfigContent);
            });
        } else {
            updateOrCreateConfigFile(path.resolve(root, jsconfig), jsconfigContent);
        }
    }
    const tsconfigContent = {
        compilerOptions: {
            baseUrl,
            paths,
        }
    };
    if (tsconfig) {
        if (Array.isArray(tsconfig)) {
            tsconfig.forEach((configPath) => {
                updateOrCreateConfigFile(path.resolve(root, configPath), tsconfigContent);
            });
        } else {
            updateOrCreateConfigFile(path.resolve(root, tsconfig), tsconfigContent);
        }
    }
    return alias;
}

function updateOrCreateConfigFile(configPath: string, content: any) {
    try {
        const existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        const mergedConfig = {
            ...existingConfig,
            ...content,
        };
        fs.writeFileSync(configPath, JSON.stringify(mergedConfig, null, 2));
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            fs.writeFileSync(configPath, JSON.stringify(content, null, 2));
        } else {
            throw error;
        }
    }
}

export { createAlias, createAlias as default };
