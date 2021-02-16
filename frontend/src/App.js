import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import LoginScreen from './screens/LoginScreen';
import CartScreen from './screens/CartScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/login' component={LoginScreen}></Route>
          <Route path='/shipping' component={ShippingScreen}></Route>
          <Route path='/placeorder' component={PlaceOrderScreen}></Route>
          <Route path='/payment' component={PaymentScreen}></Route>
          <Route path='/register' component={RegisterScreen}></Route>
          <Route path='/profile' component={ProfileScreen}></Route>
          <Route path='/admin/userlist' component={UserListScreen}></Route>
          <Route path='/admin/user/:id/edit' component={UserEditScreen}></Route>
          <Route path='/order/:id' component={OrderScreen}></Route>
          <Route path='/product/:id' component={ProductScreen}></Route>
          <Route path='/cart/:id?' component={CartScreen}></Route>
          <Route path='/' exact component={HomeScreen}></Route>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
