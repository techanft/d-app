export const BSC_TESTNET_CONFIG = {
  chainId: '0x61',
  rpcUrls: ['https://data-seed-prebsc-1-s3.binance.org:8545'],
  chainName: 'Binance Smart Chain TESTNET',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  blockExplorerUrls: ['https://testnet.bscscan.com/'],
};

export const RINKEBY_TESTNET_CONFIG = {
  chainId: '0x04',
  rpcUrls: ['https://rinkeby.infura.io/v3/'],
  chainName: 'Ethereum Rinkeby Testnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://rinkeby.etherscan.io'],
};

export const BSC_MAINNET_CONFIG = {
  chainId: '0x38',
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  chainName: 'Binance Smart Chain',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  blockExplorerUrls: ['https://bscscan.com'],
};

export const CRONOS_TESTNET_CONFIG = {
  chainId: '0x0152',
  rpcUrls: ['https://cronos-testnet-3.crypto.org:8545/'],
  chainName: 'CRONOS TESTNET',
  nativeCurrency: {
    name: 'Cronos',
    symbol: 'TCRO',
    decimals: 18,
  },
  blockExplorerUrls: ['https://testnet.cronoscan.com'],
};
