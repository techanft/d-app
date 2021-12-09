import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const RealEstateDetailsView = React.lazy(() => import('./views/realEstateManagement/shared/RealEstateDetailsView'))

const RegisterReward = React.lazy(() => import('./views/realEstateManagement/shared/RegisterReward'))

const ActivityLogs = React.lazy(() => import('./views/realEstateManagement/shared/ActivityLogs'))

const ExploitedManagement = React.lazy(() => import('./views/realEstateManagement/owner/ExploitedManagement'))

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  {
    path: "/cms/:id/realestate_details_view",
    name: "RealEstateDetailsView",
    component: RealEstateDetailsView,
    exact: true,
  },
  {
    path: "/cms/register_reward",
    name: "RegisterReward",
    component: RegisterReward,
    exact: true,
  },
  {
    path: "/cms/activity_logs",
    name: "ActivityLogs",
    component: ActivityLogs,
    exact: true,
  },
  {
    path: "/cms/exploited_management",
    name: "ExploitedManagement",
    component: ExploitedManagement,
    exact: true,
  },
]

export default routes
