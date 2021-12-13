import React from "react";
import { useDispatch } from "react-redux";
import { HashRouter, Route, Switch } from "react-router-dom";
import "./scss/style.scss";
import { getProvider } from "./shared/helpers";
import { getSigner } from "./views/walletInfo/wallet.api";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const TheLayout = React.lazy(() => import("./containers/TheLayout"));
declare let window: any;

const App = () => {
  const dispatch = useDispatch();

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", async function (accounts: any) {
      const provider = getProvider();
      dispatch(getSigner(provider));
    });
  }

  return (
    <HashRouter>
      <React.Suspense fallback={loading}>
        <Switch>
          <Route path="/" component={TheLayout} />
        </Switch>
      </React.Suspense>
    </HashRouter>
  );
};

export default App;
