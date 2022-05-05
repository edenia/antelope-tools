const getTransactionData = ({ creator, key, name }) => {
  if (!name) {
    return {
      creator,
      owner: {
        threshold: 1,
        keys: [
          {
            key,
            weight: 1
          }
        ],
        accounts: [],
        waits: []
      },
      active: {
        threshold: 1,
        keys: [
          {
            key,
            weight: 1
          }
        ],
        accounts: [],
        waits: []
      },
      max_payment: '500.00000000 UOS'
    }
  }

  return {
    creator,
    owner: {
      threshold: 1,
      keys: [
        {
          key,
          weight: 1
        }
      ],
      accounts: [],
      waits: []
    },
    active: {
      threshold: 1,
      keys: [
        {
          key,
          weight: 1
        }
      ],
      accounts: [],
      waits: []
    },
    name
  }
}

module.exports = {
  getTransactionData
}
