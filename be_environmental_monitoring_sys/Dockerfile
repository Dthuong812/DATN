FROM node:18-alpine AS development

# Set timezone for Vietnam
ENV TZ=Asia/Ho_Chi_Minh
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

# Use apk instead of apt-get since this is Alpine Linux
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

# Install dependencies required for npm and yarn
RUN apk add --no-cache python3 make g++ bash py3-pip py3-setuptools
COPY package.json ./
COPY yarn.lock ./

RUN yarn install --ignore-scripts

COPY . .

RUN yarn run build

FROM node:18-alpine AS production

# Set timezone for Vietnam
ENV TZ=Asia/Ho_Chi_Minh
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

RUN apk add --no-cache openssl

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Install dependencies required for npm and yarn
RUN apk add --no-cache python3 make g++ bash py3-pip py3-setuptools
COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production --ignore-scripts

RUN yarn add @nestjs/swagger swagger-ui-express swagger-jsdoc

COPY --from=development /usr/src/app/dist ./dist

CMD [ "yarn","run", "start:prod", "dist/main" ]