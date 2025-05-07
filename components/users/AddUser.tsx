import { auth } from '@/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/firebase/errors';
import { createUserNoLogin } from '@/firebase/services/createUserNoLogin';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import {
  Button,
  Flex,
  Heading,
  Input,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
const AddUser = ({ getUsers }: { getUsers: () => Promise<void> }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('Admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const onSubmit = async (e: any) => {
    e.preventDefault();
    const test = !nombre || !apellido || !email || !password || !rol;
    if (test) {
      toast({
        status: 'error',
        title: 'Error',
        isClosable: true,
        duration: 5000,
        description: 'Completa todos los campos',
      });
      return;
    }
    setLoading(true);
    try {
      const userDB = await createUserNoLogin({
        email,
        password,
        displayName: nombre,
      });
      const id = userDB?.uid;
      const newUser = {
        email,
        nombre,
        apellido,
        rol,
        inventario: [],
      };
      if (!id) return;
      await setSingleDoc('users', id, newUser);
      await sendPasswordResetEmail(auth, email);
      getUsers();
      toast({
        title: 'Usuario creado exitosamente',
        description: `Se envió un mail a ${email} para reestablecer la contraseña`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      setNombre('');
      setApellido('');
      setEmail('');
      setPassword('');
      setRol('Admin');
      setError('');
    } catch (error: any) {
      console.error('Error al crear el usuario:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  function generatePassword() {
    const length = 8;
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const generatedPassword = Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    setPassword(generatedPassword);
  }
  return (
    <Flex gap={4} flexDir='column' maxW='320px'>
      <Heading as='h3' size='lg'>
        Crear Usuario
      </Heading>
      <form onSubmit={onSubmit} style={{ padding: 5 }} action='submit'>
        <Flex flexDir='column' gap={3}>
          <Flex gap={1} p={1} flexDir='column'>
            <Text>Nombre:</Text>
            <Input
              required
              onChange={(e) => setNombre(e.target.value)}
              value={nombre}
              placeholder='Ingresá el nombre'
              borderColor='gray'
              type='text'
              size='sm'
              borderRadius='5px'
            />
          </Flex>
          <Flex gap={1} p={1} flexDir='column'>
            <Text>Apellido:</Text>
            <Input
              required
              onChange={(e) => setApellido(e.target.value)}
              value={apellido}
              placeholder='Ingresa el apellido'
              borderColor='gray'
              type='text'
              size='sm'
              borderRadius='5px'
            />
          </Flex>
          <Flex gap={1} p={1} flexDir='column'>
            <Text>Email:</Text>

            <Input
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder='Ingresa el email'
              borderColor='gray'
              type='email'
              size='sm'
              borderRadius='5px'
              autoComplete='new-email'
            />
          </Flex>
          <Flex gap={1} p={1} flexDir='column'>
            <Text>Rol:</Text>
            <Select
              onChange={(e) => setRol(e.target.value)}
              name='rol'
              required
              borderColor='gray'
              size='sm'
              borderRadius='5px'
              value={rol}
            >
              <option value='Superadmin'>Superadmin</option>
              <option value='Supervisor'>Supervisor</option>
              <option value='Admin'>Admin</option>
              <option value='Cuadrilla'>Cuadrilla</option>
            </Select>
          </Flex>
          <Flex gap={1} p={1} flexDir='column'>
            <Text>Contraseña:</Text>

            <Input
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder='Ingresar contraseña'
              borderColor='gray'
              size='sm'
              borderRadius='5px'
              autoComplete='new-password'
            />
            <Button
              bg='blue.700'
              color='white'
              _hover={{ opacity: 0.65 }}
              size='xs'
              w='fit-content'
              onClick={generatePassword}
            >
              Generar
            </Button>
          </Flex>
        </Flex>
        <Text fontSize='xs' color='red'>
          {FIREBASE_ERRORS[error as keyof typeof FIREBASE_ERRORS]}
        </Text>
        <Flex justify='center' my={5}>
          <Button
            type='submit'
            isLoading={loading}
            size='sm'
            bg='darkGray'
            color='white'
            _hover={{ opacity: 0.65 }}
          >
            Crear Usuario
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};

export default AddUser;
