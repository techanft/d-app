import { ethers } from "ethers";
import TokenProxy from "../assets/deployments/bsc-testnet/Token_Proxy.json";
import TokenImplementation from "../assets/deployments/bsc-testnet/Token_Implementation.json";
import listingArtifact from "../assets/artifacts/Listing.json";
import { Listing, Token } from "../typechain";

interface ITokenInstance {
  signer?: ethers.providers.JsonRpcSigner,
  provider?: ethers.providers.Web3Provider
}

export const TOKEN_INSTANCE = ({signer, provider}: ITokenInstance ) : Token | null => {
  try {
    const contractAddress = TokenProxy.address;
    if (!signer && !provider) throw String("requires either signer or provider to generate a instance"); 
    const contractABI = TokenImplementation.abi;
    return new ethers.Contract(contractAddress, contractABI, signer || provider) as Token;
  } catch (error) {
    console.log(`Error getting token instance: ${error}`);
    return null;
  }
}

interface IListingInstance extends ITokenInstance  {
  address: string
}

export const LISTING_INSTANCE = ({address, signer, provider} : IListingInstance) :  Listing | null => {
  try {
    const contractABI = listingArtifact.abi;
    if (!signer && !provider) throw String("requires either signer or provider to generate a instance"); 
    return new ethers.Contract(address, contractABI, signer || provider) as Listing;
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
