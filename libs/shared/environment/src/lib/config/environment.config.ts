import { resolve } from 'path';

import type { DotenvConfigOptions } from 'dotenv';
import { eq, isEmpty as isNull } from 'lodash';

const getCorrectEnvFile = () => {
    const environment: string = process.env.NX_ENV || '';
    const baseName = '.env';
    const compiledName = `${baseName}.${environment}`;

    return isNull(environment) ? baseName : compiledName;
};

const getDistIndex = (directory: string): boolean =>
    eq(directory.toString().toLowerCase().trim(), 'dist');

const environmentFolder = 'environments';
const SERVE_DIRECTORY = `../war`;
const DEFAULT_DIRECTORY = `..`;

const getRootDirectory = (): string => {
    const absolutePath: string = resolve(__dirname);
    const distDirectory: number = absolutePath
        .split('/')
        .findIndex(getDistIndex);
    const isServe: boolean = distDirectory >= 0;

    if (isServe) return `${SERVE_DIRECTORY}/${environmentFolder}`;

    return `${DEFAULT_DIRECTORY}/${environmentFolder}`;
};

const relativePath = `${getRootDirectory()}/${getCorrectEnvFile()}`;

const pathToEnvFile: string = resolve(__dirname, relativePath);

// !NOTE: Debug will flag the mandatory bottom blank line as a parsing error.
const EnvConfigOptions: DotenvConfigOptions = {
    // debug: true,
    encoding: 'utf8',
    path: pathToEnvFile
};

export default EnvConfigOptions;
