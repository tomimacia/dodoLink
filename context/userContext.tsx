import { auth } from '@/firebase/clientApp';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { UserType } from '@/types/types';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

interface UserContextType {
  user: UserType | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [firebaseUser, loadingAuth] = useAuthState(auth);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    if (!firebaseUser) {
      setUser(null);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      return;
    }
    setLoading(true);
    try {
      const userData = (await getSingleDoc(
        'users',
        firebaseUser.uid
      )) as UserType;
      setUser(userData || null);
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [firebaseUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  return (
    <UserContext.Provider
      value={{ user, loading: loading || loadingAuth, refreshUser: fetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
