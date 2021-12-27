import { ethers } from "ethers";
import TokenProxy from "../assets/deployments/bsc-testnet/Token_Proxy.json";
import TokenImplementation from "../assets/deployments/bsc-testnet/Token_Implementation.json";
import listingArtifact from "../assets/artifacts/Listing.json";
import { Listing, Token } from "../typechain";

declare let window:any;

export const getProvider = ():ethers.providers.Web3Provider => {
  try {
    return new ethers.providers.Web3Provider(window.ethereum);
  } catch (error:any) {
    return error;
  }
};

const _provider = getProvider();

export const TOKEN_INSTANCE = (signer?: ethers.providers.JsonRpcSigner ) : Token | null => {
  try {
    const contractAddress = TokenProxy.address;
    const contractABI = TokenImplementation.abi;
    return new ethers.Contract(contractAddress, contractABI, signer || _provider) as Token;
  } catch (error) {
    console.log(`Error getting token instance: ${error}`);
    return null;
  }
}

export const LISTING_INSTANCE = (listingAdrr: string, signer?: ethers.providers.JsonRpcSigner) :  Listing | null => {
  try {
    const contractABI = listingArtifact.abi;
    return new ethers.Contract(listingAdrr, contractABI, signer || _provider) as Listing;
  } catch (error) {
    console.log(`Error getting listing instance: ${error}`);
    return null;
  }
}


export const getListingAddress = (receipt: ethers.providers.TransactionReceipt) => {
  try {
    const abi = ["event ListingCreation(address _validator, address _owner, address _listingAddress)"];
    const iface = new ethers.utils.Interface(abi);
    const log = iface.parseLog(receipt.logs[0]);
    return log.args[2];
  } catch (error:any) {
    return error;
  }
};

export const getUpdateWorker = (receipt: ethers.providers.TransactionReceipt) => {
  try {
    const abi = ["event UpdateWorker(address _worker, bool _isAuthorized);"];
    const iface = new ethers.utils.Interface(abi);
    const log = iface.parseLog(receipt.logs[0]);
    return log;
  } catch (error:any) {
    return error;
  }
};

export const checkWorkerStatus = async (listing: Listing, address: string, status: boolean) => {
  const workerStatus = await listing.workers(address);
  return workerStatus === status
};
