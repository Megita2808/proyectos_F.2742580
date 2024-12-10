import type { AppProps } from 'next/app';

if (typeof window !== 'undefined' && (window as any).ethereum) {
    console.log('hola')
    const originalConsoleLog = console.log;
    console.log = function (...args) {
      if (
        args.length > 0 &&
        typeof args[0] === 'string' &&
        args[0].includes('lockdown-install.js') &&
        args[0].includes('null')
      ) {
        return;
      }
      originalConsoleLog.apply(console, args);
    };
  }
  
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
