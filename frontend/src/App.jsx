import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import CreateSpotForm from './components/CreateSpotForm';
import LandingPage from './pages/landingPage';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/spots/new',
        element: <CreateSpotForm />
      },
      {
        path: '/spots/:spotId',
        element: <h1>individual spot</h1>
      },
      {
        path: '/spots/current',
        element: <h1>manage your spot</h1>
      },
      {
        path: '/spots/:spotId/edit',
        element: <h1>update your spots</h1>
      },
      {
        path: '/reviews/current',
        element: <h1>manage reviews OPTIONAL</h1>
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
