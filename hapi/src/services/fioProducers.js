const axios = require('axios');

// FIO API endpoint (replace with the correct endpoint if needed)
const FIO_API_URL = 'https://testnet.fioprotocol.io/v1/chain/get_table_rows';

const getProducers = async () => {
  let producers = [];
  let totalVoteWeight;
  let hasMore = true;
  let nextKey;

  try {
    while (hasMore) {
      const response = await axios.post(FIO_API_URL, {
        code: 'fio.system',        // Contract name
        table: 'producers',        // Table name
        scope: 'fio',              // Scope
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
      totalVoteWeight = parseFloat(_totalVoteWeight);
      producers.push(...rows);
    }
  } catch (error) {
    console.error('PRODUCER SYNC ERROR', error.message);
    return;
  }

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
    return {
      id: producer.id,
      owner: producer.owner,
      fio_address: producer.fio_address,
      total_votes: producer.total_votes,
      total_votes_percent: producer.total_votes / totalVoteWeight,
      total_votes_eos: producer.total_votes,
      rank: index + 1,
      producer_public_key: producer.producer_public_key,
      url: producer.url,
      unpaid_blocks: producer.unpaid_blocks,
      last_claim_time: producer.last_claim_time,
      location: producer.location,
      is_active: !!producer.is_active
    };
  });

  console.log(producers);
  return producers;
}

// Call the function to test it
getProducers();
