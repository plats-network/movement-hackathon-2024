# Build stage
FROM node:21 AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# Deploy stage
FROM node:21
WORKDIR /app
COPY --from=builder /app ./
ENTRYPOINT ["yarn", "start"]