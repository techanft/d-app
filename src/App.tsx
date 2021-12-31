import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './scss/style.scss';
import { getProvider } from './views/wallet/wallet.api';


const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const TheLayout = React.lazy(() => import('./containers/TheLayout'));

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProvider());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
