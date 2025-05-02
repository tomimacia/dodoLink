import { useUser } from '@/context/userContext';
import { MainLayoutType } from '@/types/types';
import { Flex, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import Head from 'next/head';
import ScrollToTop from 'react-scroll-to-top';
import Footer from '../Footer';
import Navbar from '../Navigation/NavBar';
import SideNavMobile from '../Navigation/SideNavMobile';
import MainChildren from './MainChildren';
const Layout = ({ children }: MainLayoutType) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useUser();

  const isOnline = user !== null;

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content='dodoLink, conectividad en evolución'
        />
        <title>dodoLink Admin</title>
        <meta name='author' content='Tomas Macia' />
        <meta name='instagram:site' content='@dodoLink' />
        <meta name='instagram:creator' content='@tomimacia' />
        <meta property='og:site_name' content='dodoLink Admin' />
        <meta
          property='og:description'
          content='dodoLink, conectividad en evolución'
        />
        <meta property='og:image' content='/Hlogo.png' />
        <meta property='og:url' content='https://admin.dodolink.com.ar/' />
        <meta
          name='description'
          content='dodoLink, conectividad en evolución'
        />

        <meta property='og:url' content='https://admin.dodolink.com.ar/' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='dodoLink Admin' />
        <meta
          property='og:description'
          content='dodoLink, conectividad en evolución'
        />
        <meta
          property='og:image'
          content='https://admin.dodolink.com.ar/Hlogo.png'
        />

        <meta name='twitter:card' content='summary_large_image' />
        <meta property='twitter:domain' content='admin.dodolink.com.ar' />
        <meta property='twitter:url' content='https://admin.dodolink.com.ar/' />
        <meta name='twitter:title' content='dodoLink Admin' />
        <meta
          name='twitter:description'
          content='dodoLink, conectividad en evolución'
        />
        <meta
          name='twitter:image'
          content='https://admin.dodolink.com.ar/Hlogo.png'
        />

        {/* <meta
      name='google-site-verification'
      content='jkvmvPiTSvoqywlN7TQIwB7pYM0r4YRHSLnQcfRVYwQ'
    /> */}
        <meta name='og:title' content='dodoLink Admin' />
        <meta name='twitter:image:alt' content='dodoLink Admin' />
        <meta name='twitter:title' content='dodoLink Admin' />
        <meta property='og:type' content='website' />
        <link
          href='https://admin.dodolink.com.ar/favicon.ico'
          rel='apple-touch-icon'
        />
        <link rel='icon' href='/HeaderLogo.png' />
      </Head>
      <Flex
        flexDir='column'
        minH='100vh'
        bg={useColorModeValue('white', 'gray.700')}
        h='100%'
        as='main'
        style={{ contain: 'paint' }}
      >
        <Navbar setOpen={onOpen} />
        <SideNavMobile open={isOpen} onClose={onClose} />
        <ScrollToTop title='Ir arriba' style={{ padding: '6px' }} smooth />
        {isOnline && <MainChildren>{children}</MainChildren>}
        <Footer />
      </Flex>
    </>
  );
};

export default Layout;
