# Step that pulls in everything needed to build the app and builds it
FROM node:20-alpine as dev-build
WORKDIR /home/node/app
RUN npm install -g pnpm
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY package.json ./
RUN pnpm install --frozen-lockfile --offline
COPY src/ ./src/
COPY tsconfig.json ./
COPY /public ./public/
COPY /views ./views/
RUN pnpm run build


# Step that only pulls in (production) deps required to run the app
FROM node:20-alpine as prod-build
WORKDIR /home/node/app
RUN npm install -g pnpm
COPY --from=dev-build /home/node/app/pnpm-lock.yaml ./
COPY --from=dev-build /home/node/app/node_modules ./node_modules/
COPY --from=dev-build /home/node/app/package.json ./
RUN pnpm install --prod --frozen-lockfile
COPY --from=dev-build /home/node/app/dist ./dist/
COPY --from=dev-build /home/node/app/public ./public/
COPY --from=dev-build /home/node/app/views ./views/

# The actual runtime itself
FROM node:20-alpine as prod-runtime
WORKDIR /home/node/app
COPY --from=prod-build /home/node/app ./
USER node
CMD [ "npm", "run", "start:prod" ]
