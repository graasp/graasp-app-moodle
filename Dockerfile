FROM node:14.5.0

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json .
RUN yarn install --silent

# add app
COPY . .

HEALTHCHECK --interval=1m --timeout=10s --start-period=30s --retries=20  \
  CMD curl --fail http://localhost:3000 || exit 1

# Force redirect of console output to prevent console clearing upon start
CMD FORCE_COLOR=true yarn start:ci | cat
# CMD ["yarn", "start"]