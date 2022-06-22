# FROM node:16-alpine
FROM node:16

# create a user in the container, -u to set user's ID, -D to disable password
# *alpine uses adduser instead of useradd
# RUN adduser -u 8851 -D newuser
RUN adduser -u 8851 newuser
#sets the user to the newly created user
USER newuser

# Create api directory
WORKDIR /api

# RUN chown -R newuser ./node_modules

## Install app dependencies to the current working directory
# A wildcard is used to ensure both package.json AND package-lock.json are copied where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source to the WORKDIR "/api"
COPY . .

ENV PORT=8080

#for documentation purposes
EXPOSE $PORT

CMD ["node", "server.js"]
