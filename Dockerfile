FROM node:14.5.0

WORKDIR /app

# install cypress dependencies
RUN apt-get update -y
RUN apt-get install -y libgtk2.0-0 libgtk-3-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json .
RUN yarn install --silent

# add app
COPY . .

# expose the port 
EXPOSE 3000

# define when the container is ready
HEALTHCHECK --interval=1m --timeout=30s --start-period=30s --retries=20  \
  CMD curl --fail http://localhost:3000 || exit 1

# Force redirect of console output to prevent console clearing upon start
CMD FORCE_COLOR=true yarn start:ci | cat
# CMD ["yarn", "start"]