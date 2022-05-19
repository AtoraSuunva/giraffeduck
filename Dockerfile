FROM node:18 as build-step
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18 as production-step
WORKDIR /home/node/app
COPY --from=build-step /home/node/app/package*.json ./
COPY --from=build-step /home/node/app/dist ./
RUN npm install --only=production

FROM gcr.io/distroless/nodejs:18
# Usually, we can just use USER node, but node isn’t defined in the distroless image.
USER 1000
WORKDIR /home/node/app
COPY --from=production-step /home/node/app ./
CMD ["dist/main.js"]
