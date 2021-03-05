FROM node:14.16.0-alpine3.12

ARG WORKSPACE=/apps/connector

# create app directory
RUN mkdir -p ${WORKSPACE}

# install node_modules
WORKDIR ${WORKSPACE}
COPY ./package.json .
RUN npm install

# install application
COPY . .

# Execute
CMD ["npm", "start"]