// pages/_app.js
import { AuthProvider } from "../auth/authContext/page";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
