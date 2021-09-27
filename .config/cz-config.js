module.exports = {
    types: [
        {
            value: 'build',
            name: 'build: Establishing infrastructure, altering major dependencies, CI/CD, or Docker.'
        },
        {
            value: 'chore',
            name: "chore: Other changes that don't modify src or test files."
        },
        {
            value: 'cleanup',
            name: 'cleanup: A code change that neither fixes a bug nor adds a feature.'
        },
        { value: 'docs', name: 'docs: Documentation only changes.' },
        { value: 'feat', name: 'feat: A new feature.' },
        { value: 'fix', name: 'fix: A bug fix.' },
        { value: 'performance', name: 'performance: Improved performance.' },
        { value: 'refactor', name: 'refactor: An optimal restructure.' }
    ],
    scopes: [
        { name: 'app', description: 'Anything related to the Angular SPA.' },
        {
            name: 'assets',
            description: 'Adding or removing assets (i.e., images or PDFs).'
        },
        { name: 'ci', description: 'CI/CD pipelines related.' },
        {
            name: 'devcontainer',
            description: 'Anything related to the devcontainer.'
        },
        {
            name: 'docker',
            description: 'Anything related to a Dockerfile or environment.'
        },
        {
            name: 'library',
            description: 'Anything related to a particular library.'
        },
        {
            name: 'linter',
            description: 'Anything Linter specific (ESLint or Stylelint).'
        },
        { name: 'misc', description: 'Literally, anything.' },
        {
            name: 'repo',
            description: 'Anything related to managing the repo itself.'
        },
        {
            name: 'styles',
            description: 'Anything related to styles (i.e., CSS files).'
        },
        {
            name: 'tests',
            description: 'Anything testing specific (i.e., jest or cypress).'
        }
    ],
    messages: {
        body: 'Enter the full body of the change details here (optional). Use "|" to break new line:\n',
        breaking: 'Anything gonna break? (optional):\n',
        confirmCommit: 'Are you sure you?',
        customScope: 'What is the scope of this change?',
        scope: '\nWhat is the scope of this change? (optional):',
        subject:
            'Write a SHORT, IMPERATIVE (lowercase) description of the change:\n',
        type: 'How would you categorize your change?:'
    },
    allowCustomScopes: false,
    allowBreakingChanges: ['feat', 'fix'],
    subjectLimit: 100
};
