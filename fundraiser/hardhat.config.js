/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    defaultNetwork: 'sepolia',
    networks: {
      hardhat: {},
      sepolia: {
        url: 'https://rpc.ankr.com/eth_sepolia',
        accounts: [`0xab304f1d351724a8e10fe80ed410ad046928c5439ec3d446b42c578a77f42af0 `]
      }
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

// get sepolia faucets from google cloud web3
