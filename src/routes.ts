import React from 'react';

const Listings = React.lazy(() => import('./views/listings/Listings'));

const LogsOverview = React.lazy(() => import('./views/logsOverview/LogsOverview'));

const Listing = React.lazy(() => import('./views/listings/Listing'));

const Register = React.lazy(() => import('./views/listings/actions/Register'));

const ActivityLogs = React.lazy(() => import('./views/listings/info/ActivityLogs'));

const WorkersList = React.lazy(() => import('./views/listings/actions/WorkersList'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/listings', name: 'Listings', component: Listings, exact: true },
  { path: '/logs-overview', name: 'LogsOverview', component: LogsOverview, exact: true },
  {
    path: '/:id/detail',
    name: 'Listing',
    component: Listing
  },
  {
    path: '/:id/register',
    name: 'Register',
    component: Register,
    exact: true,
  },
  {
    path: '/:id/activity-logs',
    name: 'ActivityLogs',
    component: ActivityLogs,
    exact: true,
  },
  {
    path: '/:id/workers-list',
    name: 'WorkersList',
    component: WorkersList,
    exact: true,
  },
];

export default routes;
