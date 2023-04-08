import fs from 'fs';
import path from 'path';

interface CreateBabelAliasesOptions {
    aliases: Record<string, string>;
    root?: string;
    baseUrl?: string;
    jsconfig?: string | string[];
    tsconfig?: string | string[];
}

function createBabelAliases({
    aliases,
    root = '.',
    baseUrl = '.',
    jsconfig,
    tsconfig,
}: CreateBabelAliasesOptions): Record<string, string[]> {
    const paths: Record<string, string[]> = {};
    Object.keys(aliases).forEach((alias) => {
        const aliasPath = aliases[alias];
        paths[`${alias}/*`] = [`${aliasPath}/*`];
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
        },
        include: ['src/**/*'],
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
    return paths;
}

function updateOrCreateConfigFile(configPath: string, content: any) {
    try {
        const existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        const mergedConfig = {
            ...existingConfig,
            ...content,
        };
        fs.writeFileSync(configPath, JSON.stringify(mergedConfig, null, 2));
    } catch (error) {
        if (error.code === 'ENOENT') {
            fs.writeFileSync(configPath, JSON.stringify(content, null, 2));
        } else {
            throw error;
        }
    }
}

export {
    createBabelAliases,
    createBabelAliases as default,
};