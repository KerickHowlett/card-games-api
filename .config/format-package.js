const format = require('format-package');
const package = require('../package.json');

const newOrder = [
    'name',
    'author',
    'contributors',
    'version',
    'private',
    'description',
    'keywords',
    'license',
    'homepage',
    'repository',
    'bugs',
    'man',
    'engines',
    'os',
    'cpu',
    'browser',
    'main',
    'module',
    'scripts',
    'husky',
    'lint-staged',
    'workspaces',
    'config',
    'publishConfig',
    'directories',
    'files',
    'bin',
    'dependencies',
    'peerDependencies',
    'devDependencies',
    'optionalDependencies',
    'bundledDependencies',
    '...rest'
];

const options = { order: newOrder };

format(package, options).then((formattedPackage) =>
    Object.keys(JSON.parse(formattedPkg))
);
