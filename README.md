# ChiselTime

ChiselTime is an application intended to help with automating message updates to bridge the gap in Discord's timestamps
feature which does not allow for things like specifying "5pm Friday" and have it actually point to the specific date and
time each week. This is done by creating a message via the bot's slash commands, which is then updated at a configurable
interval.

## Attributions

* [NestJS + React (Next.js) in One MVC Repo for Rapid Prototyping](https://medium.com/geekculture/nestjs-react-next-js-in-one-mvc-repo-for-rapid-prototyping-faed42a194ca)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Common commands

```bash
# Create database migration file with the provided name
$ npx typeorm migration:create src/server/migrations/MigrationName

# Generate migrations from entities
$ npm run typeorm:generate src/server/migrations/MigrationName

# Run database migrations
$ npm run typeorm:run
```
