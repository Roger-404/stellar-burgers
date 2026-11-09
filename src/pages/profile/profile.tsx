import { Preloader } from '@/components/ui';
import { selectUser, updateUser } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import type { TRegisterData } from '@/utils/burger-api';
import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

export const Profile = (): React.JSX.Element => {
  /** TODO: Взять переменную из стора */
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormValue((prevState) => ({
        ...prevState,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  if (!user) {
    return <Preloader />;
  }

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    const dataToUpdate: Partial<TRegisterData> = {};

    if (formValue.name !== user.name) {
      dataToUpdate.name = formValue.name;
    }

    if (formValue.email !== user.email) {
      dataToUpdate.email = formValue.email;
    }

    if (formValue.password) {
      dataToUpdate.password = formValue.password;
    }

    if (Object.keys(dataToUpdate).length === 0) return;

    void dispatch(updateUser(dataToUpdate))
      .unwrap()
      .then(() => {
        setFormValue((prev) => ({ ...prev, password: '' }));
      })
      .catch((error) => {
        console.log('Ошибка обновления:', error);
      });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
