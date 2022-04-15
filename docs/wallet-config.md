# Dashboard wallet creation and configuration

The EOSIO dashboard collects information from different networks but also
allows users to execute specific administrative actions on certain networks,
by EOSIO accounts and their respective keys. All this requires to use a 
wallet that acts as an intermediary to sign transactions and interact with
permissioned actions in the networks.

Here we explain how to create and configure such a wallet for the EOSIO
dashboard. Inside the wallet pod, please execute the following commands:

```bash
# Create a default wallet
cleos --wallet-url http://localhost:8888 wallet create --to-console
# Create a wallet called eosmechanics
cleos --wallet-url http://localhost:8888 wallet create -n eosmechanics --to-console
```

The previews commands will create a default wallet and another wallet called
eosmechanics. The returned passwords (a string starting with PW...) should be
used to fulfill the following environment variables:

```bash
HAPI_EOS_BASE_ACCOUNT=eosmechanics
HAPI_EOS_BASE_ACCOUNT_PASSWORD=PW...
HAPI_EOS_MECHANICS_ACCOUNT=eosmechanics
HAPI_EOS_MECHANICS_PASSWORD=PW...
```

Let's make sure that the wallet was created correctly:

```bash
cleos -u https://jungle.edenia.cloud --wallet-url http://localhost:8888 wallet list
```

If the wallet is present but locked, then execute the following command:

```bash
cleos -u https://jungle.edenia.cloud --wallet-url http://localhost:8888 wallet unlock -n eosmechanics
```

Finally, we will import an EOSIO key for reading information about statistics of the block
producers called eosmechanics (Ask the admins about the key):

```bash
cleos -u https://jungle.edenia.cloud --wallet-url http://localhost:8888 wallet import -n eosmechanics
```
