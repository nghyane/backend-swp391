FROM oven/bun:1.2.11 as builder

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1.2.11-slim

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["bun", "--smol", "dist/server.js"]
