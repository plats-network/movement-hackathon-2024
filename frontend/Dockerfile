# Build stage
FROM node:21 AS builder
WORKDIR /app
ENV PORT 80
ENV NEXT_PUBLIC_CONTRACT_ADDRESS 9HXYNdRGdKDAe7nK5ahRRjyhw6bi3tzifiC7RsdGTW1r
ENV NEXT_PUBLIC_API https://api.fellowship.plats.network/api/v1



COPY . .

RUN yarn install
RUN yarn build

# Deploy stage
FROM node:21

ENV PORT 80
ENV NEXT_PUBLIC_CONTRACT_ADDRESS 9HXYNdRGdKDAe7nK5ahRRjyhw6bi3tzifiC7RsdGTW1r
ENV NEXT_PUBLIC_API https://api.fellowship.plats.network/api/v1
WORKDIR /app
COPY --from=builder /app ./
ENTRYPOINT ["yarn", "start"]