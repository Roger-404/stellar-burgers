import { clearError, clearResetPasswordSuccess, resetPasswordUser, selectIsSuccessResetPassword, selectUserError } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { ResetPasswordUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ResetPassword = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSuccessReset = useSelector(selectIsSuccessResetPassword);
  const error = useSelector(selectUserError);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(resetPasswordUser({ password, token }));
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccessReset) {
      localStorage.removeItem('resetPassword');
      void navigate('/login', { replace: true });
      dispatch(clearResetPasswordSuccess());
    }
  }, [isSuccessReset, navigate, dispatch]);

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
