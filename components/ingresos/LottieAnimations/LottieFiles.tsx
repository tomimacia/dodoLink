import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const LottieUrls = {
  Habilitado:
    'https://lottie.host/c60be0bc-39f4-4a54-a735-6b08a9c1f047/LtCNoS7YCe.lottie',
  Vencido:
    'https://lottie.host/a9e54542-5161-4238-a5b1-4572544c1523/jA1NgoqyLo.lottie',
  Inhabilitado:
    'https://lottie.host/8100db3e-7461-47a8-b95e-ebcc2e4a3a0e/7SaKrwzVqV.lottie',
  Inactivo:
    'https://lottie.host/8100db3e-7461-47a8-b95e-ebcc2e4a3a0e/7SaKrwzVqV.lottie',
};
export const LottieAnimation = ({ url }: { url: string }) => {
  return (
    <DotLottieReact
      style={{ width: '100px', height: '160px' }}
      src={url}
      autoplay
    />
  );
};
