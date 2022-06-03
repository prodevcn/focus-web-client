import { useEffect, useState } from "react";
import useWeb3 from "./useWeb3";

const useContract = (abi, address, contractOptions = null) => {
  const web3 = useWeb3();
  const [contract, setContract] = useState(
    new web3.eth.Contract(abi, address, contractOptions)
  );

  useEffect(() => {
    if (web3) {
      setContract(new web3.eth.Contract(abi, address, contractOptions));
    }
  }, [abi, address, contractOptions, web3]);

  return contract;
};

export const useNFT1155Contract = (abi, address) => {
  return useContract(abi, address);
};

export const useMarketplaceContract = (abi, address) => {
  return useContract(abi, address);
};

export const useAuctionContract = (abi, address) => {
  return useContract(abi, address);
};
