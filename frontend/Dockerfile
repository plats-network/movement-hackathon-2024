# Build stage
FROM node:21 AS builder
WORKDIR /app
ENV PORT 80

COPY . .

RUN yarn install
RUN yarn build

# Deploy stage
FROM node:21

ENV PORT 80
WORKDIR /app
COPY --from=builder /app ./
ENTRYPOINT ["yarn", "start"]