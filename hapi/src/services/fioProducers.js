const axios = require('axios');

// FIO API endpoint (replace with the correct endpoint if needed)
const FIO_API_URL = 'https://testnet.fioprotocol.io/v1/chain/get_table_rows';

// Define the expected structure based on the provided struct
const expectedStructure = [
  'id',
  'owner',
  'fio_address',
  'addresshash',
  'total_votes',
  'producer_public_key',
  'is_active',
  'url',
  'unpaid_blocks',
  'last_claim_time',
  'last_bpclaim',
  'location'
];

const getProducers = async () => {
  let producers = [];
  let totalVoteWeight = 1;  // Initialize to 1 to avoid division by zero
  let hasMore = true;
  let nextKey;

  try {
    while (hasMore) {
      const response = await axios.post(FIO_API_URL, {
        code: 'eosio',        // Contract name
        table: 'producers',   // Table name
        scope: 'eosio',       // Scope
        limit: 100,
        json: true,
        lower_bound: nextKey
      });

      if (response.status !== 200) {
        throw new Error(`Request failed with status code ${response.status}`);
      }

      const {
        rows,
        more,
        total_producer_vote_weight: _totalVoteWeight
      } = response.data;

      if (!rows) {
        throw new Error('Response data does not contain rows');
      }

      hasMore = !!more;
      nextKey = more;
      totalVoteWeight = parseFloat(_totalVoteWeight) || totalVoteWeight;
      producers.push(...rows);
    }
  } catch (error) {
    console.error('PRODUCER SYNC ERROR', error.message);
    return;
  }

  // Compare the structure of the first producer to the expected structure
  if (producers.length > 0) {
    const actualKeys = Object.keys(producers[0]);
    console.log('Expected Structure:', expectedStructure);
    console.log('Actual Structure:', actualKeys);

    const missingKeys = expectedStructure.filter(key => !actualKeys.includes(key));
    const extraKeys = actualKeys.filter(key => !expectedStructure.includes(key));

    console.log('Missing Keys:', missingKeys);
    console.log('Extra Keys:', extraKeys);
  }

  // Processing the producers data to calculate total_votes_percent and other details
  producers = producers
    .filter(producer => !!producer.is_active)
    .sort((a, b) => {
      if (parseFloat(a.total_votes) > parseFloat(b.total_votes)) {
        return -1;
      }

      if (parseFloat(a.total_votes) < parseFloat(b.total_votes)) {
        return 1;
      }

      return 0;
    });

  producers = producers.map((producer, index) => {
    const totalVotesPercent = producer.total_votes / totalVoteWeight;

    return {
      id: producer.id,
      owner: producer.owner,
      fio_address: producer.fio_address,
      addresshash: producer.addresshash,
      total_votes: producer.total_votes,
      total_votes_percent: isNaN(totalVotesPercent) ? 0 : totalVotesPercent,
      total_votes_eos: producer.total_votes,
      rank: index + 1,
      producer_public_key: producer.producer_public_key,
      url: producer.url,
      unpaid_blocks: producer.unpaid_blocks,
      last_claim_time: producer.last_claim_time,
      last_bpclaim: producer.last_bpclaim,
      location: producer.location,
      is_active: !!producer.is_active
    };
  });

  // Logging the processed producers data
  producers.forEach((producer, index) => {
    console.log(`Processed Producer ${index + 1}:`, producer);
  });

  return producers;
}

// Call the function to test it
getProducers();
