import { ethers } from "ethers";
import contractArtifact from "../assets/contract/ANFTV2.json";
import listingArtifact from "../assets/contract/ListingV2.json";

declare let window:any;

export const getTokenContractRead = (provider: ethers.providers.Web3Provider):ethers.Contract => {
  try {
    const contractAddress = contractArtifact.address;
    const contractABI = contractArtifact.abi;
    return new ethers.Contract(contractAddress, contractABI, provider);
  } catch (error:any) {
    return error;
  }
};

export const getTokenContractWrite = (signer: ethers.providers.JsonRpcSigner):ethers.Contract => {
  try {
    const contractAddress = contractArtifact.address;
    const contractABI = contractArtifact.abi;
    return new ethers.Contract(contractAddress, contractABI, signer);
  } catch (error:any) {
    return error;
  }
};

export const getListingContractRead = (listingAddress: string, provider: ethers.providers.Web3Provider):ethers.Contract => {
  try {
    const listingABI = listingArtifact.abi;
    return new ethers.Contract(listingAddress, listingABI, provider);
  } catch (error:any) {
    return error;
  }
};

export const getListingContractWrite = (listingAddress: string, signer: ethers.providers.JsonRpcSigner):ethers.Contract => {
  try {
    const listingABI = listingArtifact.abi;
    return new ethers.Contract(listingAddress, listingABI, signer);
  } catch (error:any) {
    return error;
  }
};

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

export const getProvider = ():ethers.providers.Web3Provider => {
  try {
    return new ethers.providers.Web3Provider(window.ethereum);
  } catch (error:any) {
    return error;
  }
};
