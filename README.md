# Monorepo Starter Guide

This monorepo is designed to streamline development with multiple apps and shared packages, using TypeScript for consistent type safety across the entire codebase. It leverages [Turborepo](https://turbo.build/) for efficient build and development processes. Additionally, it uses [Prisma](https://www.prisma.io/) for database management, [ShadCN](https://shadcn.dev/) for UI components, and [Auth.js](https://authjs.dev/) for authentication on both client and server.

## Apps and Packages

- **`api`**: A [HonoJS](https://hono.dev/docs/getting-started/cloudflare-workers) app for server-side functionality.
- **`web`**: A [Next.js](https://nextjs.org/) app for the frontend.
- **`@repo/ui`**: A shared React component library.
- **`@repo/eslint-config`**: Custom ESLint configurations including `eslint-config-next` and `eslint-config-prettier`.
- **`@repo/typescript-config`**: Shared `tsconfig.json` files used throughout the monorepo.
- **`@repo/db`**: Prisma configurations and schemas used for database management.

Each app and package is fully written in [TypeScript](https://www.typescriptlang.org/).

---

## Development Utilities

This Turborepo setup includes:

- **TypeScript** for static type checking.
- **ESLint** for code linting.
- **Prettier** for code formatting consistency.

## Setup Instructions

### Next.js Client Setup (`web`)

Copy `.env.local.sample` to `.env.local`:
```
cp .env.local.sample .env.local
```
and then execute

```
bunx auth secret
```
Once the auth secret is created add all the other neccesary field in the `.env.local` file.

If you want to setup other Oauth provider please refer the [AuthJS docs](https://authjs.dev/getting-started/installation).

### Hono server setup
Exectute 
````
cp wrangler.toml.sample wrangler.toml  
````
then execute 
````
touch .dev.vars  
``````

copy the `AUTH_SECRET` from the .env.local of the `apps/web` to `apps/api/wrangler.toml` and `apps/api/.dev.vars`

Once the auth secret is created add all the other neccesary field in the `.dev.vars` and `wrangler.toml` file.
### Install

```
cd monorepo
bun install
```

### Build

To build all apps and packages, run the following command:

```
cd monorepo
bun build
```

### Develop

To develop all apps and packages, run the following command:

```
cd monorepo
bun dev
```

### Add a new package in the repo

Create a new package in the `packages` directory
then create a ts project inside it using  
```
npm --init -y 

or

bun init
```
change the name field to 
```
name : '@repo/{packagename}'
```
also add the exports in package.json file of newly created package.

For more info how to create a package please refer the `packages/db` package of the project.

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

