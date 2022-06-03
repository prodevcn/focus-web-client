/* eslint-disable import/extensions */
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import * as bsc from "@binance-chain/bsc-use-wallet";

import "react-perfect-scrollbar/dist/css/styles.css";
import "./style.scss";

import store, { history } from "./store";
import App from "./App";

import * as serviceWorker from "./serviceWorker";

import { ConnectionRejectedError, UseWalletProvider } from "use-wallet";

ReactDOM.render(
  <bsc.UseWalletProvider
    chainId={Number(process.env.REACT_APP_NETWORK_ID)}
    connectors={{
      walletconnect: { rpcUrl: process.env.REACT_APP_RPC_URL },
      bsc,
      // bsc: {
      //   web3ReactConnector() {
      //     return new BscConnector({
      //       supportedChainIds: [Number(process.env.REACT_APP_NETWORK_ID)],
      //     });
      //   },
      //   handleActivationError(err) {
      //     if (err instanceof UserRejectedRequestError) {
      //       return new ConnectionRejectedError();
      //     }
      //   },
      // },
    }}
  >
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </bsc.UseWalletProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
