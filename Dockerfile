FROM node:18.8-alpine as base

FROM base as builder

# Add build-time arguments
ARG NEXT_PUBLIC_SERVER_URL
ARG PAYLOAD_PUBLIC_SERVER_URL

WORKDIR /home/node/app
COPY package*.json ./
COPY yarn.lock ./

COPY . .
RUN yarn install
# Pass the build arguments as environment variables during build
RUN NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL} \
    PAYLOAD_PUBLIC_SERVER_URL=${PAYLOAD_PUBLIC_SERVER_URL} \
    yarn build

FROM base as runtime

ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload/payload.config.js  

WORKDIR /home/node/app
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --production
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build

EXPOSE 3000

CMD ["node", "dist/server.js"]