import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));

const ListingDetailsView = React.lazy(() => import('./views/listingManagement/shared/ListingDetailsView'));

const RegisterReward = React.lazy(() => import('./views/listingManagement/shared/RegisterReward'));

const ActivityLogs = React.lazy(() => import('./views/listingManagement/shared/ActivityLogs'));

const WorkerManagement = React.lazy(() => import('./views/listingManagement/owner/WorkerManagement'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/listings', name: 'Dashboard', component: Dashboard, exact: true },
  {
    path: '/listings/:id/detail',
    name: 'ListingDetailsView',
    component: ListingDetailsView
  },
  {
    path: '/register_reward',
    name: 'RegisterReward',
    component: RegisterReward,
    exact: true,
  },
  {
    path: '/activity_logs',
    name: 'ActivityLogs',
    component: ActivityLogs,
    exact: true,
  },
  {
    path: '/worker_management',
    name: 'WorkerManagement',
    component: WorkerManagement,
    exact: true,
  },
];

export default routes;
