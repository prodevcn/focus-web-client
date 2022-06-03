import React from 'react';
import { withRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Routes from './routes';
import Header from 'components/Header';
import MainLayout from './layout/SearchLayout';
import Dialogs from './components/Dialogs';

const App = (props) => (
  <SnackbarProvider maxSnack={3}>
    {/*<Drawer />*/}

    {/* <Header /> */}

    <MainLayout>
      <Routes {...props} />
    </MainLayout>

    <Dialogs />

  </SnackbarProvider>
);

export default withRouter(App);
