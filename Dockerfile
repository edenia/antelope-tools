FROM node:12.16.2-alpine  as build-stage

ARG react_app_api_entrypoint

ENV WORK_DIR /usr/src/app
ENV PATH $WORK_DIR/node_modules/.bin:$PATH
ENV NODE_ENV production
ENV NODE_PATH ./src
ENV REACT_APP_API_ENTRYPOINT $react_app_api_entrypoint

RUN mkdir -p $WORK_DIR
WORKDIR $WORK_DIR

COPY package.json $WORK_DIR/package.json
COPY yarn.lock $WORK_DIR/yarn.lock

RUN yarn install --frozen-lockfile --production=true

COPY ./ $WORK_DIR

RUN yarn build

FROM nginx:1.17.10-alpine as run-stage

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
COPY --from=build-stage /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

