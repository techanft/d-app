import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { RootState } from '../../shared/reducers';
import { storeToken } from './auth.reducer';

type TRemAuthParam = {
  token: string;
  id: string
};

const RemAccountAuth = () => {
  const dispatch = useDispatch();
  const  history  = useHistory();
  const { token, id } = useParams<TRemAuthParam>();
  const { user } = useSelector((state: RootState) => state.authentication);
  
  useEffect(() => {
    if (token) {
      localStorage.setItem('authentication_token', token);
      dispatch(storeToken(token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (user) {
      history.push(`/${id}/detail`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return <></>;
};

export default RemAccountAuth;
