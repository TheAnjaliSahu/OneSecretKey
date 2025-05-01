import React from 'react';
import { Router,Routes, Route } from 'react-router-dom';
import Signin from './container/Signin';
import Signup from './container/Signup';
import Home from './container/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import ViewSecret from './container/ViewSecret';
import About from './container/About';
import Secret from './container/Secret';


const App = () => {
  return (
    // <Router>
    <>
        <Header />
          <Routes>
             <Route path="/" element={<Home />} />  
             {/* <Route path="/secret/:uuid" element={<ViewSecret />} />  */}
             <Route path="/secret/:id" element={<Secret />} /> 
             <Route path="/viewsecret" element={<ViewSecret />} />
             <Route path="/signin" element={<Signin />} />
             <Route path="/signup" element={<Signup />} />
           <Route path= "/about" element={<About />}/>
          </Routes>
        <Footer />
    </>    
    //  </Router>
  );
};

export default App;
