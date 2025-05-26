import { Outlet } from 'react-router-dom';
import Header from '../header/header';

function MainLayout () {
  return (
    <div className='page page--gray page--main'>
      <Header />
      <Outlet />
    </div>
  );
}

export default MainLayout;
