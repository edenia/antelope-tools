FROM node:14.2.0

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn

# Bundle app source
COPY . .

EXPOSE 9090
CMD node src/index.js