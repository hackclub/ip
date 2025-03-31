FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS prerelease
COPY . .

ENV NODE_ENV=production

FROM base AS release
COPY --from=prerelease /usr/src/app/index.ts .
COPY --from=prerelease /usr/src/app/index.html .

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]

