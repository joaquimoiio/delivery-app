import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Home from '../pages/Home/Home.js';
import Category from '../pages/Category/Category.jsx';
import Store from '../pages/Store/Store.jsx';
import Fornecedor from '../pages/Fornecedor/Fornecedor.js';
import Payment from '../pages/Payment/Payment.jsx'

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categoria/:categoryId" element={<Category />} />
          <Route path="/loja/:storeId" element={<Store />} />
          <Route path="/fornecedor" element={<Fornecedor />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/pagamento" element={<Payment />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
