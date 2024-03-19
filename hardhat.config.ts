/**
 * @type import('hardhat/config').HardhatUserConfig
 */

import "hardhat-typechain";
import "@nomiclabs/hardhat-ethers";
import "hardhat-contract-sizer";
import "@nomicfoundation/hardhat-verify";

require("hardhat-storage-layout");
require('solidity-coverage');

module.exports = {
    solidity: {
      compilers: [{
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000
          },
          outputSelection: {
        "*": {
            "*": ["storageLayout"],
        },
      },
        }
      }],
      overrides: {
      },
      
    },

    networks: {
       local: {
         url: 'http://127.0.0.1:8545',
         chainId: 31337
       },
       sepolia: {
        url: 'https://rpc.ankr.com/eth_sepolia/aacae83934a4a93c491a94d4d47304c54ff32fea4f8e92b795038e3eb0e2e116',
        chainId: 11155111,
        accounts: ["0xe321e2745599c06ba9147722de7ff33ebb1bea9b653153c64870fff25eb5b864"]
      },
       ropsten: {
         url: 'https://ropsten.infura.io/v3/cf3bc905d88d4f248c6be347adc8a1d8',
         chainId: 3,
         accounts: ["0x7c5e2cfbba7b00ba95e5ed7cd80566021da709442e147ad3e08f23f5044a3d5a"]
       },
       rinkeby: {
         url: 'https://rinkeby.infura.io/v3/cf3bc905d88d4f248c6be347adc8a1d8',
         chainId: 4,
         accounts: ["0x7c5e2cfbba7b00ba95e5ed7cd80566021da709442e147ad3e08f23f5044a3d5a"]
       },
       kovan: {
        url: 'https://kovan.infura.io/v3/cf3bc905d88d4f248c6be347adc8a1d8',
        chainId: 42,
        accounts: ["0x7c5e2cfbba7b00ba95e5ed7cd80566021da709442e147ad3e08f23f5044a3d5a"]
      },
      goerli: {
        url: 'https://goerli.infura.io/v3/cf3bc905d88d4f248c6be347adc8a1d8',
        chainId: 5,
        accounts: ["0x7c5e2cfbba7b00ba95e5ed7cd80566021da709442e147ad3e08f23f5044a3d5a"]      
      },
      mainnet: {
        url: 'https://mainnet.infura.io/v3/360ea5fda45b4a22883de8522ebd639e',
        chainId: 1
      },


      fuji: {
        url: "https://api.avax-test.network/ext/bc/C/rpc",
        chainId: 43113,
      },

    },

    etherscan: {
        apiKey: {
          sepolia: "9WKRJGEQ94JRDJ2R5FNW13ZGMDUUAYTZQF"
        }
    }
};
