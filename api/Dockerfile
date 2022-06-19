FROM node:16-alpine

# do we need the groupadd? what would be the purpose of creating a new usergroup(?). -g flag to assign to created group
RUN groupadd -r newuser && useradd -r -g newuser newuser

#sets the user to the newly created user
USER newuser

# ENV: envfile

# Create api directory
WORKDIR /api

## Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
# Bundle app source to the WORKDIR "/api"
COPY . .

EXPOSE $PORT

CMD ["node", "server.js"]
