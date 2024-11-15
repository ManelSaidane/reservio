import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import Navbar from './components/NavBar';
import MainSection from './pages/MainSection';
import Login from './pages/Login';
import RegisterClient from './pages/RegisterClient';
import RegisterProvider from './pages/RegisterProvider';
import Footer from './components/Footer';
import ProviderRouter from './components/routes/ProviderRouter'; 
import AdminRouter from './components/routes/AdminRouter'; 
import ClientRouter from './components/routes/ClientRouter';
import ForceRedirect from './components/routes/ForceRedirect';
import AdminPage from './pages/Admin/AdminPage';
import { setUser } from './redux/Action/Auth';
import MonProfile from './pages/Admin/MonProfile';
import Statistics from './pages/Provider/Statistics';
import AccueilPage from './pages/Provider/AccueilPage';
import ServiceForm from './pages/Provider/ServiceForm';
import ProviderServices from './pages/Provider/ProviderServices';
import ProviderPayment from './pages/Provider/ProviderPayment';
import DemandesPage from './pages/Provider/DemandesPage';
import ServiceCard from './pages/Client/ServiceCard';
import Notifications from './pages/Client/Notifications';
import PendingReservations from './pages/Client/PendingReservations';
import CategoriesPagec from './pages/Admin/CategoriesPage';
import UserStatsChart from './pages/Admin/StatisticsPage';
import UserProfile from './pages/Client/userprofile';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordReset from './components/PasswordReset';
import FavoritesPage from './pages/Client/FavoritesPage';
import Success from './Success';
import Cancel from './Cancel';
import AdminServicesPage from './pages/Admin/AdminServicesPage';
import Promotion from './pages/Provider/Promotion';
import ProviderProfile from './pages/Provider/ProviderProfile';
const App = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    const storedJwt = window.localStorage.getItem('jwt');
    if (storedJwt) {
      try {
        const decoded = jwtDecode(storedJwt);
        dispatch(setUser(decoded));
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, [dispatch]);

  const user = {
    isConnected: auth.isConnected,
    role: auth.user?.role  ,
  };

  return (
    <Router>
      <div className="app">
        <Navbar user={user} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register/client" element={<RegisterClient />} />
          <Route path="/register/provider" element={<RegisterProvider />} />
          <Route path="/" element={<ForceRedirect user={user}><MainSection /></ForceRedirect>} />
          <Route path="/request-reset-password" element={<PasswordResetRequest/>} />
          <Route path="/reset-password/:token" element={<PasswordReset/>} />

          {/* <Route path="/profile" element={<MonProfile/>} /> */}
          <Route path="/profile/:userId" element={<MonProfile/>} />

          <Route path="/admin/*" element={<AdminRouter user={user}><AdminPage/></AdminRouter>} />        
          <Route path="/admin/acceuil" element={<AdminRouter user={user}><AdminPage/></AdminRouter>} />
          <Route path="/admin/categorie" element={<AdminRouter user={user}><CategoriesPagec/></AdminRouter>} />
          <Route path="/admin/statics" element={<AdminRouter user={user}><UserStatsChart/></AdminRouter>} />
          <Route path="/admin/services" element={<AdminRouter user={user}><AdminServicesPage/></AdminRouter>} />

          <Route path="/client/*" element={<ClientRouter user={user}><ServiceCard/></ClientRouter>} /> 
          {/* <Route path="/client/promotions" element={<ClientRouter user={user}><PromotionsPage/></ClientRouter>} /> */}
          <Route path="/client/profile" element={<ClientRouter user={user}><MonProfile/></ClientRouter>} />
          <Route path="/client/notification" element={<ClientRouter user={user}><Notifications/></ClientRouter>} />
          <Route path="/client/pending" element={<ClientRouter user={user}><PendingReservations/></ClientRouter>} />
          <Route path="/client/profile" element={<ClientRouter user={user}><UserProfile/></ClientRouter>} />
          <Route path="/client/fav" element={<ClientRouter user={user}><FavoritesPage/></ClientRouter>} />


          <Route path="/provider/*" element={<ProviderRouter user={user}><AccueilPage /></ProviderRouter>} />
          <Route path="/provider/profile" element={<ProviderRouter user={user}><ProviderProfile /></ProviderRouter>} />
          <Route path="/provider/promotion" element={<ProviderRouter user={user}><Promotion /></ProviderRouter>} />
          <Route path="/provider/statics" element={<ProviderRouter user={user}><Statistics /></ProviderRouter>} />
          <Route path="/provider/services" element={<ProviderRouter user={user}><ProviderServices /></ProviderRouter>} />
          <Route path="/provider/publication" element={<ProviderRouter user={user}><ServiceForm /></ProviderRouter>} />
          <Route path="/provider/demandes" element={<ProviderRouter user={user}><DemandesPage /></ProviderRouter>} />
          <Route path="/provider/payment" element={<ProviderRouter user={user}> <ProviderPayment/></ProviderRouter> }/>
          <Route path="/success" element={<Success/>} />
          <Route path="/cancel" element={<Cancel/>} />


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
       <Footer/>
      </div>
    </Router>
  );
};

export default App;
