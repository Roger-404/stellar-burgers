import { selectUserName } from '@/services/slices/userSlice';
import { useSelector } from '@/services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader = (): React.JSX.Element => {
  /* TODO: Получите имя пользователя из хранилища */
  const userName = useSelector(selectUserName);

  return <AppHeaderUI userName={userName} />;
};
