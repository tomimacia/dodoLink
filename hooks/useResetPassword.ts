import { auth } from '@/firebase/clientApp';
import { useToast } from '@chakra-ui/react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';

export const useResetPassword = (
  onClose: () => void,
  initialEmail: string = ''
) => {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!email) {
      return toast({
        title: 'Error',
        description: 'Ingresá tu email',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Enviado',
        description: `Te enviamos un mail a ${email} para reestablecer tu contraseña`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setEmail('');
      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return { handleSubmit, loading, email, setEmail };
};
