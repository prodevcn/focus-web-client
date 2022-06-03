import { useEffect, useState, useRef } from "react";
import Web3 from "web3";
import { useWallet } from "@binance-chain/bsc-use-wallet";

const httpProvider = new Web3.providers.HttpProvider(
  process.env.REACT_APP_RPC_URL,
  { timeout: 10000 }
);

/**
 * Provides a web3 instance using the provider provided by useWallet
 * with a fallback of an httpProver
 * Recreate web3 instance only if the ethereum provider change
 */
const useWeb3 = () => {
  const { ethereum } = useWallet();
  const refEth = useRef(ethereum);
  const [web3, setweb3] = useState(new Web3(ethereum || httpProvider));

  useEffect(() => {
    if (ethereum !== refEth.current) {
      setweb3(new Web3(ethereum || httpProvider));
      refEth.current = ethereum;
    }
  }, [ethereum]);

  return web3;
};

export default useWeb3;
