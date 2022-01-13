// https://eth-ropsten.alchemyapi.io/v2/zVzUGUogtRqHdtdyyout2tsPrq1DDL76

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/zVzUGUogtRqHdtdyyout2tsPrq1DDL76',
      accounts: [ 'af74abc9236da5e7ff727a7e4d1a089f1995c6e24a8931b9d84984ac5fc4a0d1' ]
    }
  }
}