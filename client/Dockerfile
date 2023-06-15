# Image
FROM node:alpine

# Source Code
RUN mkdir -p /src/container

# Working Directory
WORKDIR /src/container

# Copy Into
COPY . /src/container/

# Dependencies
RUN npm i

# Open Port
EXPOSE 3001

#Scripts
CMD [ "npm", "start" ]