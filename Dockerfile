FROM node:14.5.0

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json .
RUN yarn install --silent

# add app
COPY . .

CMD ["yarn", "start"]