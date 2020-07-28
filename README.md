# EOSIO Dashboard

Network and Infrastructure Monitoring Dashboard for EOSIO networks.

## About EOSIO Dashboard: 

### What Is EOSIO Dashboard?

EOSIO Dashboard is an open-source tool that helps you visualize relevant data about Block Producer nodes and rewards distribution in the EOS network. The EOS network, launched in 2018, is a widely adopted public blockchain network that deploys a delegated proof of stake consensus mechanism. It operates autonomously and leverages a voting system to elect the twenty-one Block Producers that run the network. As a reward, these Block Producers receive EOS tokens. 

### What Is the Intention of EOSIO Dashboard?

EOSIO Dashboard is a community-driven open-source tool built by a group of tech enthusiasts that believe in transparency to operate blockchain networks. We intend to provide a useful and straightforward app that will help visualize the Block Producers’ relevant information and rewards distribution in the EOS network to promote transparency and reliability.  

### Why It’s Important?

As mentioned previously, the EOS network run with twenty-one elected Block Producers that receive EOS tokens in return. Token holders vote for the Block Producers they believe are the best candidates for this public blockchain. So, we believe that monitoring what’s happening on the network is essential to improve and measure node transparency. EOSIO Dashboard’s main objective is to help you visualize decentralized and reliable information about each node and its activity.

### Where Does the Data Come From?

EOSIO Dashboard enables clear and graphic visualization of relevant information of Block Producers. We source data directly from the EOS public blockchain and information provided in their bp.json files. A bp.json file is essentially an info/configuration file that each Block Producer provides to verify their identity. Here is an example of a bp.json file: https://eoscostarica.io/bp.json.

For more information about EOSIO Dashboard, contact us on our Telegram group: https://t.me/eoscr.


## Quick Guide:

### Version

1.0

### Before You Start

There are some things you need before continuing:

- [git]
- [node.js]
- [yarn]

### First Time

Copy the `.env.example`. Then update the environment variables according to your needs.

```
cp .env.example .env
```

### Running

```sh
$ yarn
$ yarn start
```

Navigate to http://localhost:3000

### TODO

- Improve this readme

  [git]: <https://git-scm.com/>
  [node.js]: <https://nodejs.org/es/>
  [yarn]: <https://yarnpkg.com/>
