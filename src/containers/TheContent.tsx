import { CContainer, CFade } from '@coreui/react';
import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { _window } from '../config/constants';
// routes config
import routes from '../routes';
import { providerNetworkChecking } from '../shared/blockchain-helpers';
import { RootState } from '../shared/reducers';
import { getSigner } from '../views/wallet/wallet.api';
import { setProviderError } from '../views/wallet/wallet.reducer';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const TheContent = () => {
  const dispatch = useDispatch();
  const { provider } = useSelector((state: RootState) => state.wallet);

  useEffect(() => {
    if (!provider) return;
    const error = providerNetworkChecking(provider);
    dispatch(setProviderError(error));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);


  _window.ethereum.on('accountsChanged', () => {
    if (provider) {
      dispatch(getSigner(provider));
    }
  });
  _window.ethereum.on('chainChanged', (chainId: number) => {
    window.location.reload();
  });

  return (
    <main className="c-main py-0">
      <CContainer fluid className="px-0">
        <Suspense fallback={loading}>
          <Switch>
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    render={(props) => (
                      <CFade>
                        <route.component {...props} />
                      </CFade>
                    )}
                  />
                )
              );
            })}
            <Redirect from="/" to="/listings" />
          </Switch>
        </Suspense>
      </CContainer>
    </main>
  );
};

export default React.memo(TheContent);
