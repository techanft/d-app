import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { _window } from './config/constants';
import './scss/style.scss';
import { RootState } from './shared/reducers';

import { getProvider, getSigner } from './views/wallet/wallet.api';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const TheLayout = React.lazy(() => import('./containers/TheLayout'));

const App = () => {
  const dispatch = useDispatch();
  const { provider } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    dispatch(getProvider());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  _window.ethereum.on('accountsChanged', async () => {
    if (provider) {
      dispatch(getSigner(provider));
    }
  });

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
