# Card Games API War Game Assessment Challenge

> In my never ending pursuit of cultivating my talents and strengthening my weaknesses, I decided to try creating a workspace for creating API Playing Card games.
> This first one is the ever classic war, and the instructions on how to play are at the bottom.
> I hope you enjoy!

**NOTE:** This is not yet suitable for production-level deployment.

-   [Card Games API War Game Assessment Challenge](#card-games-api-war-game-assessment-challenge)
    -   [Setup Requirements](#setup-requirements)
        -   [1. The Docker/Devcontainer Method](#1-the-dockerdevcontainer-method)
        -   [2. The More Involved, Manual Way](#2-the-more-involved-manual-way)
    -   [Starting The App](#starting-the-app)
        -   [Bonus Feature](#bonus-feature)
    -   [Quality Checks](#quality-checks)
        -   [ESLint Checks](#eslint-checks)
        -   [Format/Prettier Checks](#formatprettier-checks)
        -   [Unit/Integration Testing (Jest/Supertest)](#unitintegration-testing-jestsupertest)
            -   [E2E Testing Note](#e2e-testing-note)
                -   [Here's what I have my WSL configured for my WSL](#heres-what-i-have-my-wsl-configured-for-my-wsl)
    -   [Methodology & Nrwl Design Patterns](#methodology--nrwl-design-patterns)
        -   [Card Games API War Game App](#card-games-api-war-game-app)
        -   [Card Games API War Game Libraries](#card-games-api-war-game-libraries)
    -   [Follow-up](#follow-up)
    -   [Resources Documentation](#resources-documentation)

## Setup Requirements

This can be setup in at least one of two ways:

### 1. The Docker/Devcontainer Method

If you have Docker and VSCode setup, and install the recommended VSCode extensions listed under `./.vscode/extensions.json` (mainly `ms-vscode-remote.vscode-remote-extensionpack`), then you can recreate an exact copy of the development environment I used to work on this project.

The most pre-configuring you may have to do is open up `./.devcontainer/.env` and change the `DOCKER_DATA` variable to wherever your machine's Docker images are stored. But even then, that's mainly just if you want to be able to use your Docker Extension tools and control your other Docker images from inside the devcontainer.

Assuming you have Docker, the VSCode extensions, and everything else I mentioned already taken care of, then all you have to do is hit `Ctrl+Shift+P` (or `CMD+Shift+P` if you're on a Mac), type in the following, and finally press `Enter` to start the build process:

```bash
Remote-Container: Rebuild and Reopen in Container.
```

(VSCode should also give you a prompt at the bottom-right corner of your window, asking if you'd like to re-open this project in the devcontainer.)

### 2. The More Involved, Manual Way

You'll need Node v14.15.4 (or NVM) installed directly onto your system: <https://nodejs.org/en/>

Cypress is a part of this, which provides its own browser to run its test, so depending what Card Games API's security policies are with proxies and approved applications, then you might have to get creative and utilize a Cypress Docker image at: <https://hub.docker.com/r/cypress/base/>.

> NOTE: You may also need to set the `CYPRESS_CACHE_FOLDER` for your system to run E2E or just look up how to turn off the cache. <https://docs.cypress.io/guides/overview/why-cypress>

Enter the following commands to install all your dependencies and configure your project environment from this repo's root directory:

> NOTE: (You don't have to install yarn, but it's what I used, and it's what I recommend in order to best mitigate any possible issues brought on by environmental inconsistencies).

```bash
# Update your package managers to the latest versions.
npm install --global --quiet npm yarn

# Install recommended global packages.
npm install --global @nrwl/cli commitizen env-cmd rimraf

# Yarn configurations (these are already present in .yarnrc, but this is just in case something still doesn't work quite right with the package manager).
yarn config set ignore-engines true
yarn config set workspaces-experimental true

# Feel free to change the Yarn cache directory or to even skip this one, as it's mainly just there for the Docker DevContainer.
yarn config set cache-folder ~/.cache

# Install your dependencies.
yarn install

# Or if you prefer NPM
npm install
```

## Starting The App

The Git Repo should defy convention in this case and store the `.env` file needed for this project since nothing sensitive is stored within it.

In case it doesn't however, do the following:

1. Go to `libs/shared/environment/src/lib/environments`.
2. Copy file `.env.example` and rename it as `.env` within the same directory.

Once that's done, to start up the Express API, just enter one of the following commands into the terminal:

```bash
# Start Up The API
yarn start
# OR
npm run start
```

Once you've started the API server, assuming you have the `REST Client` extension, you can use the files listed in `./rest-client-commands`.

If you prefer to use Postman or some similar tool, you can use the following calls at the following URLs.

```bash
# Start New Game & Receive It's Game ID.
PUT http://localhost:5000/game HTTP/1.1
content-type: application/json

# Check Score.
GET http://localhost:5000/game/[inject Game ID here] HTTP/1.1
content-type: application/json

# Play Game.
POST http://localhost:5000/game/[inject Game ID here]/play HTTP/1.1
content-type: application/json
```

### Bonus Feature

For making you wait so long, I also included two URL query params that will allow the user to further customize the game.

It will allow a user, when creating a game, to use the query of `players` to set the total number of players anywhere between **2** and **6**, and the query of `decks` to be set between **1** and **5** (meaning that a game of _2 decks_ will have _104 cards_ in the game).

By default (without either URL query param), the games are set to use _2 players_ and _1 deck_.

Otherwise, you can start a new custom game with a url that looks like the following:

```bash
PUT http://localhost:5000/game?players=4&decks=2 HTTP/1.1
content-type: application/json
```

## Quality Checks

In case you're not familiar, Nrwl's monorepos are very multi-project based, meaning that, typically, you have to specifically target one library or app specifically to test it.

**However...** I wrote a small script that'll allow you to run all of these sanity checks with a single command each.

(Both the Lint and Prettier are auto-triggered by `Husky` pre-commit, along with `commitizen` for commit linting.)

> NOTE: You may notice some strange organization with the imports, but that's because I've been experimenting with import sorting on my template repo (which this project derives from), so they look a tad off.

### ESLint Checks

```bash
yarn lint:all
# OR
npm run lint:all

# To Automatically Fix
yarn lint:all:fix
# OR
npm run lint:all:fix
```

### Format/Prettier Checks

```bash
yarn format:check
# OR
npm run format:check

# To automatically fix formatting with Prettier
yarn format:write
# OR
npm run format
```

### Unit/Integration Testing (Jest/Supertest)

I used a variety of test assertion libraries for this, but they're primarily all from Jest and Supertest.

You'll also find that a majority of the libraries each have a child directory in the `src` root that is labeled as `testing`; these contain the utils, setups, teardowns, and/or mocks used for the various testing scripts used throughout the project.

```bash
yarn test:all
# OR
npm run test:all
```

#### E2E Testing Note

The E2E Smoke Testing is located in the app, itself, but it MAY run across a potential memory issue where Jest will kill the tests without giving an actual error. If this happens, and you are using a Dockerfile/devcontainer method, just increase the amount of allotted memory made available to Docker and/or WSL.

(The details on how to do the latter down below.)

##### Here's what I have my WSL configured for my WSL

```bash
[wsl2]
memory=8GB # Limits VM memory in WSL 2 to 8 GB
processors=12 # Makes the WSL 2 VM use two virtual processors
swap=0
```

## Methodology & Nrwl Design Patterns

You'll find that while most of the apps are clean of code, they've been refactored and distributed to myriad libraries throughout the project.

That's traditionally how Nrwl/Nx projects are structured. I won't get into the why here, but here's a link to their developer site to find out more: <https://nx.dev/>

You can find in the `/libs` directory, which will contain a majority of the code and logic, while the root Express app is in the `./apps` directory.

They've been organized based on their generalized functionality, such as middleware, utils, and `war` for the game's core logic.

The paths to these libraries use aliases, but you can find the "roadmap", if you will, in the `tsconfig.base.json` file.

Nevertheless, I'll provide a brief summary of what each of the generalized categorical libraries are (a lot of the directory names are categorically generic to allow flexibility in growing the app... if it were to grow, I mean):

### Card Games API War Game App

1. `./apps/war`: The ExpressJS app files that are the bootstrapped root for the War game application. It also houses the `main.js` entrypoint file, as well as the E2E smoke testing.

### Card Games API War Game Libraries

1. `./libs/shared`: This directory contains all the more universal support libraries that can be shared with myriad projects outside of just the War game application.
2. `./libs/shared/database`: This contains the interfaces for both `NeDB`, a document-based database like MongoDB, only it is locally stored like SQLite; and NodeCache for, as the name implies, caching.
3. `./libs/shared/environment`: Manages and boots up all the configurations pertaining the repo's various environmental variables.
4. `./libs/shared/logger`: A simple `pino` util to deal with the few bits of needed logging executed throughout the core parts of the app.
5. `./libs/shared/middleware`: Express middleware functions that mainly handles core system error handling like logging errors, catching them, and handling 404 routes; and it also includes a Rate Limiter for the API to better guard against DoS/brute-force attacks.
6. `./libs/shared/system`: The core system files that handles the machine-level functionalities, such as starting up the server or gracefully shutting down the database.
7. `./libs/shared/utils`: All the many, many tools I created as short hands for simple, primitive functions. At times, it was to avoid repeated, short algorithms, but most of the time it was to create clean, readable code, such as `isArrayOf()` for clearly defined if-statements. It also houses some custom universal typings for the TypeScript code used throughout the project.
8. `./war/battle-logs:` One feature I included for the API is tracking a game's history -- not just for the battles, themselves, but for the players as well.
9. `./war/battles`: This library manages the service and rules for the battle rounds as well as distributing the cards to the proper winner.
10. `./war/decks:` A library used for generating and executing the services of the decks, such as drawing cards and shuffling.
11. `./war/games:` This is the rooted library, or what Nrwl calls a `feature library` where all the other libraries are rooted here before going into the app, itself. It has adapters for interacting with the other libraries, including the proper database and caching calls through its database service file.
12. `./war/players:` Of course, you can't have a game without participating players, and this library not only contains the models for the instances and the services of all their functionalities, but it also houses the instance and services for the dealer whom cuts the deck instances and distribute the card instances to each of the player instances... instantly!

## Follow-up

I sincerely hope that my work on this project has exceeded your expectations and that it more than makes up for the delays.

If you have any questions about my work, why I decided to go a certain way, or need assistance in setting this up (but I doubt your team will need it), please feel free to contact me at [kahowlett1989@gmail.com](mailto:kahowlett1989@gmail.com).

## Resources Documentation

> This is a list to the official documentation of the major tools & libraries I used for the development of this project that weren't already included (except for @testing-library, which I mainly included, because I used its other libraries.

1. [Nrwl](https://nx.dev/)
2. [NeDB](https://www.npmjs.com/package/nedb)
3. [Node-Cache](https://www.npmjs.com/package/node-cache)
4. [Lodash](https://lodash.com/)
    - Kinda went crazy with this one, admittedly. Was trying to learn it, but don't like what it did with the bundle size.
5. [VSCode DevContainers](https://code.visualstudio.com/docs/remote/containers/)
6. [Personal Dev Container Repo](https://github.com/KerickHowlett/docker-builds)
