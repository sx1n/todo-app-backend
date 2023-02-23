FROM node:18-slim

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json yarn.* ./

USER node

RUN yarn install

COPY --chown=node:node . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
