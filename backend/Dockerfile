# Image
FROM node:alpine

# Source Code
RUN mkdir -p /src/container

# Working directory
WORKDIR /src/container

# Copy into
COPY . /src/container/

 #Dependencies
 RUN npm i

 # Open Port
 EXPOSE 8081

 #Scripts
 CMD [ "npm", "start" ]

