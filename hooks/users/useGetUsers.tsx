import { getCollection } from '@/firebase/services/getCollection';
import { UserType } from '@/types/types';
import { useEffect, useState } from 'react';
import { useSessionStorage } from '../storageHooks/useSessionStorage';

const useGetUsers = () => {
  const [users, setUsers] = useSessionStorage<UserType[] | null>(
    'USERS_SESSION_STORAGE_DODO',
    null
  );
  const [loadingUserList, setLoadingUsers] = useState(false);
  const getUsers = async () => {
    setLoadingUsers(true);
    try {
      const productsFetched = await getCollection('users');
      setUsers(productsFetched as UserType[]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingUsers(false);
    }
  };
  useEffect(() => {
    if (users !== null) return;

    try {
      getUsers();
    } catch (err) {
      console.log('Error getting users', err);
    }
  }, [users, setUsers, getUsers]);
  return { loadingUserList, setUsers, getUsers, users };
};

export default useGetUsers;
