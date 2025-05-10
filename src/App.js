
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSingup';
import Footer from './Components/Footer/Footer';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/monitor' element={<ShopCategory category="monitor" />} />
          <Route path='/cpu' element={<ShopCategory category="cpu" />} />
          <Route path='/computer' element={<ShopCategory category="computer" />} />
          <Route path='/main' element={<ShopCategory category="main" />} />
          <Route path='/accessories' element={<ShopCategory category="accessories" />} />
          <Route path='/case' element={<ShopCategory category="case" />} />
          <Route path='/power' element={<ShopCategory category="power" />} />
          <Route path='/hardrive' element={<ShopCategory category="hardrive" />} />


          <Route path="/product" element={<Product />}>
            <Route path=':productID' element={<Product />} />
          </Route>
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<LoginSignup />} />
        </Routes>
        <Footer />
      </BrowserRouter>

    </div>
  );
}

export default App;
