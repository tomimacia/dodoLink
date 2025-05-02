import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { encryptPassword } from '@/helpers/CryptoJS/encryptation';
import { useEffect, useState } from 'react';

const useGetAdminPassword = () => {
  const [password, setPassword] = useState<string | null>(null);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const getPassword = async () => {
    setLoadingPassword(true);
    try {
      const metadataFetched = (await getSingleDoc('users', 'metadata')) as any;
      setPassword(metadataFetched?.adminPassword);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingPassword(false);
    }
  };
  useEffect(() => {
    if (password !== null) return;

    try {
      getPassword();
    } catch (err) {
      console.log('Error getting password', err);
    }
  }, [password, setPassword, getPassword]);
  const updatePassword = async (newPassword: string) => {
    setLoadingPassword(true);
    try {
      await setSingleDoc('users', 'metadata', {
        adminPassword: newPassword,
      });
      setPassword(newPassword);
      const encrypted = encryptPassword(newPassword);
      window.localStorage.setItem('PWDCJS_ADMIN_LOCAL_STORAGE', encrypted);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingPassword(false);
    }
  };
  return {
    loadingPassword,
    password,
    setPassword,
    getPassword,
    updatePassword,
  };
};

export default useGetAdminPassword;
