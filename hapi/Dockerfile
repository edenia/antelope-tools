FROM node:14.2.0

# Create app directory
WORKDIR /usr/app

# Install dev tools

# Install nodemon for dev
RUN yarn --ignore-optional --frozen-lockfile global add nodemon

# Install app dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn

# Bundle app source
COPY . .

EXPOSE 9090
CMD nodemon src/index.js