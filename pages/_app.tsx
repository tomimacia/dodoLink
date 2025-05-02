import LoadingScreen from '@/components/LoadingScreen';
import Layout from '@/components/layout/MainLayout';
import { OnCursoProvider } from '@/context/useOnCursoContext';
import { UserProvider } from '@/context/userContext';
import { useRouterEvent } from '@/hooks/useRouterEvent';
import { customTheme } from '@/styles/theme';
import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  const { loading } = useRouterEvent();
  return (
    <UserProvider>
      <ChakraProvider theme={customTheme}>
        <OnCursoProvider>
          {loading && <LoadingScreen />}
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </OnCursoProvider>
      </ChakraProvider>
    </UserProvider>
  );
}
