import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { Web3Provider } from '@providers';
import { LoadingPage } from '@organisms';
import { AuthWrapper } from '@templates';
import { ConfirmDialog } from '@templates/Modal';
import 'react-toastify/dist/ReactToastify.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { store } from '@store';

const App = (props: AppProps) => {
  return (
    <Provider store={store}>
      <Web3Provider>
        <ConfirmDialog />
        <LoadingPage />
        <ToastContainer />
        <AuthWrapper {...props} />
      </Web3Provider>
    </Provider>
  );
};

export default App;
