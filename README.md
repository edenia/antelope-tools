
<div align="center">
	<a href="https://antelope.tools">
		<img src="webapp/public/antelope-tools.png" width="400">
	</a>

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) 
![GitHub](https://img.shields.io/github/license/edenia/antelope-tools) 
![GitHub repo size](https://img.shields.io/github/repo-size/edenia/antelope-tools) 
[![Twitter Follow](https://img.shields.io/twitter/follow/edeniaWeb3.svg?style=social&logo=twitter)](https://twitter.com/edeniaWeb3)
![GitHub forks](https://img.shields.io/github/forks/edenia/antelope-tools?style=social)

</div>

# Antelope Tools
Network and Infrastructure Dashboard for EOSIO networks.

## About the Antelope Tools:

### What is the Antelope Tools?

Antelope Tools is an open-source tool that helps you visualize relevant data about Block Producer nodes and rewards distribution in the EOS network. The EOS network, launched in 2018, is a widely adopted public blockchain network that deploys a delegated proof of stake consensus mechanism. It operates autonomously and leverages a voting system to elect the twenty-one Block Producers that run the network. As a reward, these Block Producers receive EOS tokens.

### What Is the Intention of Antelope Tools?

Antelope Tools is a community-driven open-source tool built by a group of tech enthusiasts that believe in transparency to operate blockchain networks. We intend to provide a useful and straightforward app that will help visualize the Block Producers’ relevant information and rewards distribution in the EOS network to promote transparency and reliability.

### Why It’s Important?

As mentioned previously, the EOS network run with twenty-one elected Block Producers that receive EOS tokens in return. Token holders vote for the Block Producers they believe are the best candidates for this public blockchain. So, we believe that monitoring what’s happening on the network is essential to improve and measure node transparency. Antelope Tools’s main objective is to help you visualize decentralized and reliable information about each node and its activity.

### Where Does the Data Come From?

Antelope Tools enables clear and graphic visualization of relevant information of Block Producers. We source data directly from the EOS public blockchain and information provided in their bp.json files. A bp.json file is essentially an info/configuration file that each Block Producer provides to verify their identity. Here is an example of a bp.json file: https://eoscostarica.io/bp.json.

For more information about Antelope Tools, contact us on our Telegram group: https://t.me/eoscr.

## Quick Guide:

### Features!

This project use all the latest tools and practices in the industry

- **[hasura](https://hasura.io)**
  Hasura GraphQL Engine is an opensource service that connects to your databases & microservices and auto-generates a production-ready GraphQL backend

- **[hapi](https://hapi.dev/)**
  A back end service for custom busines logic integrated with hasura using [actions](https://hasura.io/docs/1.0/graphql/manual/actions/index.html#actions)

- **[react](https://reactjs.org/)**
  An open-source JavaScript library for building user interfaces.

- **[docker-compose](https://docs.docker.com/compose/)**
  Compose is a tool for defining and running multi-container Docker applications

- **[demux](https://guide.eoscostarica.io/docs/eos-learn/demux-pattern)**
  Demux is an architectural pattern for backend infrastructure for build applications on EOSIO blockchain to sourcing blockchain events to deterministically update queryable databases.

### File Structure

Within the download you'll find the following directories and files:

```bash
antelope-tools/
├── hapi
│ ├── src
│ | ├── config
│ | ├── routes
│ | ├── utils
│ | └── services
│ ├── .dockerignore
│ ├── .eslintrc
│ ├── .prettierrc
│ ├── Dockerfile
│ ├── yarn-lock.json
│ └── package.json
├── hasura
│ ├── metadata
│ ├── migrations
│ └── config.ymal
├── webapp
│ ├── src
│ | ├── api
│ | ├── components
│ | ├── config
│ | ├── containers
│ | ├── language
│ | ├── models
│ | ├── routes
│ | ├── theme
│ | └── utils
│ ├── .eslintrc
│ ├── .prettierrc
│ ├── Dockerfile
│ ├── yarn-lock.json
│ └── package.json
├── .env.jungle
├── .env.lacchain
├── .env.local
├── .env.libre
├── .env.libretestnet
├── .env.mainnet
├── .env.proton
├── .env.protontestnet
├── .env.telos
├── .env.telostestnet
├── .env.ultratestnet
├── .env.waxtestnet
├── .gitignore
├── docker-compose.yaml
├── .LICENSE
├── LICENSE
└── README.md
```

There are some important folders like

- `hapi/src/api` should have all reusable code for example a code to generate tax invoice
- `hapi/src/routes` this folder should only have the endpoint mapping and params validations and use functions from api folder to handle the business logic

### Installation

Basic knowledge about Docker, Docker Compose and NodeJS is required.

### Getting Started

Some things you need before getting started:

- [docker](https://www.docker.com/)
- [git](https://git-scm.com/)
- [node.js](https://nodejs.org/es/)
- [yarn](https://yarnpkg.com/)
- [Hasura CLI](https://hasura.io/docs/1.0/graphql/manual/hasura-cli/install-hasura-cli.html#install-hasura-cli)

#### Considerations for Windows

If you are using Windows you need to install [WSL](https://docs.microsoft.com/en-us/windows/wsl/install) in version 2 and install a Linux distribution on Windows to run the project. In the Linux distribution is where you need to install git, node, yarn and Hasura CLI.

Additionally, you need WSL to use Docker Desktop as an intermediate between Windows and the Linux distribution. Otherwise, if you have a computer with low hardware specifications, it's recommended to use Linux instead of Windows with WSL.

### First time

1. Clone this repo using `git clone --depth=1 https://github.com/edenia/antelope-tools <YOUR_PROJECT_NAME>`.
1. Move to the appropriate directory: `cd <YOUR_PROJECT_NAME>`.
1. As Antelope Tools can have different configurations copy the environment variables according to your needs in the `.env` file or use `make run <NETWORK>` to use a configuration for a specific network.


```
# global
STAGE=dev
APP_NAME=antelope-tools

# wallet
WALLET_DATA=./wallet_data

# postgres
POSTGRES_USER=eoscr
POSTGRES_PASSWORD=password
POSTGRES_DB=localdb
POSTGRES_DATA=./db_data

# hasura
HASURA_GRAPHQL_ENABLE_CONSOLE=true
HASURA_GRAPHQL_DATABASE_URL=postgres://eoscr:password@postgres:5432/localdb
HASURA_GRAPHQL_ADMIN_SECRET=myadminsecretkey
HASURA_GRAPHQL_UNAUTHORIZED_ROLE=guest

# hapi
HAPI_EOS_API_ENDPOINT=https://jungle.edenia.cloud
HAPI_EOS_API_CHAIN_ID=73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d
HAPI_EOS_BASE_ACCOUNT=baseaccount
HAPI_EOS_BASE_ACCOUNT_PASSWORD=PW...
HAPI_EOS_WALLET_URL=http://wallet:8888
HAPI_EOS_BP_JSON_ON_CHAIN=false
HAPI_EOS_BP_JSON_ON_CHAIN_CONTRACT=
HAPI_EOS_BP_JSON_ON_CHAIN_TABLE=
HAPI_EOS_BP_JSON_ON_CHAIN_SCOPE=
HAPI_HASURA_URL=http://hasura:8080/v1/graphql
HAPI_HASURA_ADMIN_SECRET=myadminsecretkey
HAPI_SERVER_PORT=9090
HAPI_SERVER_ADDRESS=hapi
HAPI_SYNC_PRODUCERS_INTERVAL=86400
HAPI_SYNC_PRODUCER_INFO_INTERVAL=1

#webapp
PORT=3000
REACT_APP_TITLE="EOS Jungle4 Testnet Network Dashboard"
REACT_APP_DEFAULT_PRODUCER_LOGO=https://bloks.io/img/eosio.png
REACT_APP_FOOTER_LINKS=[]
REACT_APP_EOS_RATE_LINK=https://jungle.eosrate.io:8080
REACT_APP_USE_REWARDS=true
REACT_APP_USE_VOTES=true
REACT_APP_USE_CPU_BENCHMARK=true
REACT_APP_HASURA_URL=http://localhost:8080/v1/graphql
REACT_APP_EOS_API_HOST=jungle.edenia.cloud
REACT_APP_EOS_API_PORT=443
REACT_APP_EOS_API_PROTOCOL=https
REACT_APP_EOS_CHAIN_ID=73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d
REACT_APP_EOS_USE_BP_JSON_ON_CHAIN=false
REACT_APP_EOS_BP_JSON_ON_CHAIN_CONTRACT=producerjson
REACT_APP_EOS_BP_JSON_ON_CHAIN_TABLE=producerjson
REACT_APP_EOS_BP_JSON_ON_CHAIN_SCOPE=producerjson
REACT_APP_STATE_HISTORY_ENABLED=false
```

### Quick start

At this point you can run `make start` or `make run <NETWORK>`, you can check the services runing on:

- hapi at http://localhost:9090/healthz
- hasura at http://localhost:9695
- webapp at http://localhost:3000

## Release Management Process

- [Create a new release](docs/create-a-release.md)


## Contributing

Please Read EOS Costa Rica's [Open Source Contributing Guidelines](https://developers.eoscostarica.io/docs/open-source-guidelines).

Please report bugs big and small by [opening an issue](https://github.com/edenia/antelope-tools/issues/new/choose)

Contributions of any kind are welcome!

## About Edenia

<span align="center">

<a href="https://edenia.com"><img width="400" alt="image" src="webapp/public/edenia-logo.png"></img></a>

[![Twitter](https://img.shields.io/twitter/follow/EdeniaWeb3?style=for-the-badge)](https://twitter.com/EdeniaWeb3)
[![Discord](https://img.shields.io/discord/946500573677625344?color=black&label=discord&logo=discord&logoColor=white&style=for-the-badge)](https://discord.gg/YeGcF6QwhP)

</span>
Edenia runs independent blockchain infrastructure and develops web3 solutions. Our team of technology-agnostic builders has been operating since 1987, leveraging the newest technologies to make the internet safer, more efficient, and more transparent.

<!-- ![Metrics](/profile/metrics.svg) -->

