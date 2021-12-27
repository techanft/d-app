import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));

const Listing = React.lazy(() => import('./views/listings/Listing'));

const Register = React.lazy(() => import('./views/listings/actions/Register'));

const ActivityLogs = React.lazy(() => import('./views/listings/info/ActivityLogs'));

const WorkersList = React.lazy(() => import('./views/listings/actions/WorkersList'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/listings', name: 'Dashboard', component: Dashboard, exact: true },
  {
    path: '/listings/:id/detail',
    name: 'Listing',
    component: Listing
  },
  {
    path: '/listings/:id/register',
    name: 'Register',
    component: Register,
    exact: true,
  },
  {
    path: '/activity-logs',
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
