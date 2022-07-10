FROM node:16.16.0  as build-stage

ARG port
ARG react_app_title
ARG react_app_default_producer_logo
ARG react_app_footer_links
ARG react_app_eos_rate_link
ARG react_app_use_rewards
ARG react_app_use_votes
ARG react_app_use_cpu_benchmark
ARG react_app_hasura_url
ARG react_app_eos_api_network_name
ARG react_app_eos_api_network_label
ARG react_app_eos_api_network_logo
ARG react_app_eos_include_transaction
ARG react_app_eos_api_host
ARG react_app_eos_api_port
ARG react_app_eos_api_protocol
ARG react_app_eos_chain_id
ARG react_app_eos_use_bp_json_on_chain
ARG react_app_eos_bp_json_on_chain_contract
ARG react_app_eos_bp_json_on_chain_table
ARG react_app_eos_bp_json_on_chain_scope
ARG react_app_token_symbol
ARG react_app_disabled_menu_items
ARG react_app_network_url
ARG react_app_block_explorer_url
ARG react_app_tag
ARG react_app_state_history_enabled
ARG react_app_google_analitic_page_id
ARG react_app_public_re_captcha_key

ENV WORK_DIR /usr/src/app
ENV PATH $WORK_DIR/node_modules/.bin:$PATH
ENV NODE_ENV production
ENV NODE_PATH ./src
ENV PORT $port
ENV REACT_APP_TITLE $react_app_title
ENV REACT_APP_DEFAULT_PRODUCER_LOGO $react_app_default_producer_logo
ENV REACT_APP_FOOTER_LINKS $react_app_footer_links
ENV REACT_APP_EOS_RATE_LINK $react_app_eos_rate_link
ENV REACT_APP_USE_REWARDS $react_app_use_rewards
ENV REACT_APP_USE_VOTES $react_app_use_votes
ENV REACT_APP_USE_CPU_BENCHMARK $react_app_use_cpu_benchmark
ENV REACT_APP_HASURA_URL $react_app_hasura_url
ENV REACT_APP_EOS_API_NETWORK_NAME $react_app_eos_api_network_name
ENV REACT_APP_EOS_API_NETWORK_LABEL $react_app_eos_api_network_label
ENV REACT_APP_EOS_API_NETWORK_LOGO $react_app_eos_api_network_logo
ENV REACT_APP_EOS_INCLUDE_TRANSACTION $react_app_eos_include_transaction
ENV REACT_APP_EOS_API_HOST $react_app_eos_api_host
ENV REACT_APP_EOS_API_PORT $react_app_eos_api_port
ENV REACT_APP_EOS_API_PROTOCOL $react_app_eos_api_protocol
ENV REACT_APP_EOS_CHAIN_ID $react_app_eos_chain_id
ENV REACT_APP_EOS_USE_BP_JSON_ON_CHAIN $react_app_eos_use_bp_json_on_chain
ENV REACT_APP_EOS_BP_JSON_ON_CHAIN_CONTRACT $react_app_eos_bp_json_on_chain_contract
ENV REACT_APP_EOS_BP_JSON_ON_CHAIN_TABLE $react_app_eos_bp_json_on_chain_table
ENV REACT_APP_EOS_BP_JSON_ON_CHAIN_SCOPE $react_app_eos_bp_json_on_chain_scope
ENV REACT_APP_TOKEN_SYMBOL $react_app_token_symbol
ENV REACT_APP_DISABLED_MENU_ITEMS $react_app_disabled_menu_items
ENV REACT_APP_NETWORK_URL $react_app_network_url
ENV REACT_APP_BLOCK_EXPLORER_URL $react_app_block_explorer_url
ENV REACT_APP_TAG $react_app_tag
ENV REACT_APP_STATE_HISTORY_ENABLED $react_app_state_history_enabled
ENV REACT_APP_GOOGLE_ANALITIC_PAGE_ID $react_app_google_analitic_page_id
ENV REACT_APP_PUBLIC_RE_CAPTCHA_KEY $react_app_public_re_captcha_key

RUN mkdir -p $WORK_DIR
WORKDIR $WORK_DIR

COPY package.json $WORK_DIR/package.json
COPY yarn.lock $WORK_DIR/yarn.lock

RUN yarn install --frozen-lockfile --production=false

COPY ./ $WORK_DIR

RUN yarn build

FROM nginx:1.17.10-alpine as run-stage

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
COPY --from=build-stage /usr/src/app/compression.conf /etc/nginx/conf.d/compression.conf
COPY --from=build-stage /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
