import App from 'next/app';
import Navigation from '@/components/navigation';
import '../styles/globals.css';

export default function MyApp({Component, pageProps}) {
  return (
    <div className='layoutStyle'>
      <Navigation />
      <Component {...pageProps} />
    </div>
  );
}
