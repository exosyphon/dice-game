# Dice Game
The best app to help you choose dinner without the thinking!

## Run
DOCKER_BUILDKIT=1 docker build -t dice-game .
docker run --rm --publish 3000:3000 dice-game

## TODO
1. Keep track of guesses and display them
1. Make success / failure better looking
1. Make guesses look better 

## Nice to Haves
1. Store state in browser?
1. Consider doing letters instead of numbers
1. Obfuscate solutions
1. Alternate game: solve all the solutions but not the same one twice (add timer?)

## All Combinations
['L', 'D', 'L', 'D', 'L'],
['R', 'U', 'U', 'R', 'U'],
['U', 'U', 'L', 'U', 'U'],
['L', 'U', 'U', 'L', 'U'],
['U', 'R', 'U', 'R', 'U'],
['R', 'U', 'R', 'U', 'R'],
['D', 'R', 'D', 'R', 'D'],
['R', 'D', 'R', 'D', 'R'],
['R', 'R', 'U', 'R', 'R'],
['L', 'D', 'L', 'L', 'D'],
['D', 'R', 'R', 'D', 'R'],
['R', 'D', 'D', 'R', 'D'],
['D', 'L', 'L', 'D', 'L'],
['U', 'L', 'U', 'L', 'U'],
['R', 'D', 'R', 'R', 'D'],
['L', 'U', 'L', 'L', 'U'],
['L', 'U', 'L', 'U', 'L'],
['L', 'L', 'D', 'L', 'L'],
['L', 'D', 'D', 'L', 'D'],
['D', 'D', 'L', 'D', 'D'],
['U', 'L', 'L', 'U', 'L'],
['D', 'L', 'D', 'L', 'D'],
['L', 'L', 'U', 'L', 'L'],
['U', 'L', 'U', 'U', 'L'],
['R', 'U', 'R', 'R', 'U'],
['D', 'R', 'D', 'D', 'R'],
['D', 'L', 'D', 'D', 'L'],
['U', 'R', 'R', 'U', 'R'],
['U', 'R', 'U', 'U', 'R'],
['R', 'R', 'D', 'R', 'R'],
['U', 'U', 'R', 'U', 'U'],
['D', 'D', 'R', 'D', 'D']

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Building Docker Image

```sh
docker build -t dice-game:development --target development .
```

```sh
docker build -t dice-game:production --target production .
```

## Running containers manually

### Development mode

```sh
docker run -it --rm --publish 3000:3000 --volume $(pwd):/app dice-game:development bash
```

### Production mode
```sh
docker run --rm --publish 3000:3000 dice-game:production
```

## Running with Docker Compose

### Development mode

```sh
docker compose up
```

### Production mode

```sh
docker compose --file docker-compose.yml up
```

