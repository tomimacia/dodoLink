import AddUser from '@/components/users/AddUser';
import useGetUsers from '@/hooks/users/useGetUsers';
import React from 'react';

const Alta = () => {
  const { getUsers } = useGetUsers();
  return <AddUser getUsers={getUsers} />;
};

export default Alta;
