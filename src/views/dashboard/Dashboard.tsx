import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Listings from '../listings/Listings';

interface IDashboard extends RouteComponentProps {}

const Dashboard = (props: IDashboard) => {
  return <Listings routingProps={props} />;
};

export default Dashboard;
