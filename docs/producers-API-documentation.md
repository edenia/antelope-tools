# Block Producers Data

## Overview

The API allows getting important data on block producers on the different EOSIO + Antelope blockchain networks available on [Antelope Tools](https://antelope.tools/) such as EOS and jungle4 testnet. Among the data that can be obtained is the [BP JSON](https://github.com/eosrio/bp-info-standard) of each BP. This is useful because the logic to get all these objects is not needed to implement from scratch.  
Also, in the Antelope Tools backend, each API endpoint is requested through HTTP, and the obtained status is saved, which allows to obtain the status code of the request.

## How is the data obtained?

Through the eosjs API, the system queries the `producers` table of the eosio account, with this table, we get the URLs of the Top 100 producers to obtain their `bp.json`. When the BP JSON is not obtained the producer is not consider in the results.That information is updated every 4 hours.  
**Note:** if the BP JSON is not from the current network, the nodes are removed. 

You can check the [producer's table](https://eos.antelope.tools/accounts?account=eosio&table=producers) of eosio account of the EOS Network in the section of Contract Tables.

## API Endpoint

| Blockchain | Endpoint URL |
|:----|:----|
| EOS Network Mainnet | https://graphql-eos.antelope.tools/api/rest/ |
| Jungle4 Testnet  |  https://graphql-jungle.antelope.tools/api/rest/ |

### Methods

- **POST** `get-producers-info`

> #### Get producers info

This request receives an object named `bpParams` with two optional keys, owners and type. 

```json
{
  "bpParams": {
    "owners": "array",
    "type": "string"
  }
}
```

The request returns an object with the list of producers and the total in the database.

```json
{
  "getProducersInfo": {
    "producersInfo": {
      "producers": "array",
      "total": "number"
    }
  }
}
```

Where each BP has the following format:

```json
{
  "owner": "string",
  "rank": "number",
  "bp_json": "JSON object",
  "total_votes": "number",
  "endpoints": {
    "type": "string",
    "link": "string",
    "updated_at": "string",
    "response": "JSON object"
  }
}
```

**Example:** Request all the data.

```
curl -X 'POST' \
  'https://graphql-eos.antelope.tools/api/rest/get-producers-info' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "bpParams":{}
}'
```

---

- *Owners*

This parameter is used to request a list of specific block producers. The query takes into consideration the field `owner` of the table `producers`.

**Example:** Request the producer `costaricaeos`.

```
curl -X 'POST' \
  'https://graphql-eos.antelope.tools/api/rest/get-producers-info' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "bpParams":{
    "owners": ["costaricaeos"]
  }
}'
```

**Output**:

```json
{
    "getProducersInfo": {
        "producersInfo": {
            "total": 54,
            "producers": [
                {
                    "bp_json": {...},
                    "total_votes": "1085723619295114240.00000000000000000",
                    "owner": "costaricaeos",
                    "endpoints": [
                        {
                            "link": "eos.edenia.cloud:9876",
                            "response": {},
                            "updated_at": "2022-11-14T17:23:00.174097+00:00",
                            "type": "p2p"
                        },
                        {
                            "link": "https://eos.edenia.cloud",
                            "response": {
                                "status": 200,
                                "statusText": "OK"
                            },
                            "updated_at": "2022-11-14T17:29:38.517+00:00",
                            "type": "ssl"
                        }
                    ],
                    "rank": 69
                }
            ]
        }
    }
}
```

---

- *Type*

This parameter is used to get in the `endpoints` key only those with the type received. Also, note that the `type` can only be api, ssl, or p2p, according to the [BP JSON standard](https://github.com/eosrio/bp-info-standard).

**Example:** Request only the producers with `api` endpoints.

```
curl -X 'POST' \
  'https://graphql-eos.antelope.tools/api/rest/get-producers-info' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "bpParams":{
    "type": "api"
  }
}'
```

---

**Note:** The complete output is not shown, because it contains all producers with api endpoints
**Output:**

```json
{
    "getProducersInfo": {
        "producersInfo": {
            "total": 54,
            "producers": [
                {
                    "bp_json": {...},
                    "total_votes": "12967881324180213760.00000000000000000",
                    "owner": "eosflytomars",
                    "endpoints": [
                        {
                            "link": "http://api.bitmars.one",
                            "response": {
                                "status": 200,
                                "statusText": "OK"
                            },
                            "updated_at": "2022-11-14T17:35:39.718+00:00",
                            "type": "api"
                        }
                    ],
                    "rank": 2
                },
                {
                    "bp_json": {...},
                    "total_votes": "12859134590211870720.00000000000000000",
                    "owner": "binancestake",
                    "endpoints": [
                        {
                            "link": "http://api.binance-eos.com",
                            "response": {
                                "status": 400,
                                "statusText": "Bad request"
                            },
                            "updated_at": "2022-11-14T17:35:35.895+00:00",
                            "type": "api"
                        }
                    ],
                    "rank": 3
                }, ...
            ]
        }
    }
}
```

---

When both parameters are provided, the query returns the producers of the list of owners only if they have endpoints of the requested type.

**Example:** Request for the producer `costaricaeos`.

```
curl -X 'POST' \
  'https://graphql-eos.antelope.tools/api/rest/get-producers-info' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "bpParams":{
    "owners": ["costaricaeos"]
    "type": "p2p"
  }
}'
```

**Output:**

```json
{
    "getProducersInfo": {
        "producersInfo": {
            "total": 54,
            "producers": [
                {
                    "bp_json": {...},
                    "total_votes": "1085723619295114240.00000000000000000",
                    "owner": "costaricaeos",
                    "endpoints": [
                        {
                            "link": "eos.edenia.cloud:9876",
                            "response": {},
                            "updated_at": "2022-11-14T17:23:00.174097+00:00",
                            "type": "p2p"
                        }
                    ],
                    "rank": 69
                }
            ]
        }
    }
}
```

---

**Example:** Request for the producer `costaricaeos` only if it have `api` endpoints.

```
curl -X 'POST' \
  'https://graphql-eos.antelope.tools/api/rest/get-producers-info' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "bpParams":{
    "owners": ["costaricaeos"]
    "type": "api"
  }
}'
```

**Output:**

```json
{
    "getProducersInfo": {
        "producersInfo": {
            "total": 54,
            "producers": []
        }
    }
}
```
