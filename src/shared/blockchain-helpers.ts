import { ethers, providers } from 'ethers';
import TokenProxy from '../assets/deployments/bsc-testnet/Token_Proxy.json';
import TokenImplementation from '../assets/deployments/bsc-testnet/Token_Implementation.json';
import listingArtifact from '../assets/artifacts/Listing.json';
import { Listing, Token } from '../typechain';
import { BLOCKCHAIN_NETWORK, _window } from '../config/constants';

interface ITokenInstance {
  signer?: ethers.providers.JsonRpcSigner;
  provider?: ethers.providers.Web3Provider;
}

export const TOKEN_INSTANCE = ({ signer, provider }: ITokenInstance): Token | null => {
  try {
    const contractAddress = TokenProxy.address;
    if (!signer && !provider) throw String('requires either signer or provider to generate a instance');
    const contractABI = TokenImplementation.abi;
    return new ethers.Contract(contractAddress, contractABI, signer || provider) as Token;
  } catch (error) {
    console.log(`Error getting token instance: ${error}`);
    return null;
  }
};

interface IListingInstance extends ITokenInstance {
  address: string;
}

export const LISTING_INSTANCE = ({ address, signer, provider }: IListingInstance): Listing | null => {
  try {
    const contractABI = listingArtifact.abi;
    if (!signer && !provider) throw String('requires either signer or provider to generate a instance');
    return new ethers.Contract(address, contractABI, signer || provider) as Listing;
  } catch (error) {
    console.log(`Error getting listing instance: ${error}`);
    return null;
  }
};

// Logic for checking provider network should be performed here
// Return an error to save as {providerErrorMessage} inside the store
export const INVALID_NETWORK_ERR = 'Invalid network detected. Please switch to BSC network to use the application';
export const providerNetworkChecking = (provider: ethers.providers.Web3Provider): string | null => {
  const { _network } = provider;
  if (!_network) return String('Wallet integration error, please wait for 5 seconds then reload the application');
  if (ethers.utils.hexlify(_network.chainId) !== BLOCKCHAIN_NETWORK.chainId) {
    promptUserToSwitchChain();
    return INVALID_NETWORK_ERR;
  }
  return null;
};

const promptUserToSwitchChain = () => {
  _window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [BLOCKCHAIN_NETWORK],
  });
};

export const checkWorkerStatus = async (listing: Listing, address: string, status: boolean) => {
  const workerStatus = await listing.workers(address);
  return workerStatus === status;
};
