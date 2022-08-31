import React from 'react'; 
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'


import Home from './pages/Home'
import Catalog from './pages/Catalog'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Products from './pages/Products'

function App() {
  return (
    <div className="App">
        <Router>   
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/catalog" component={Catalog}/>
            <Route exact path="/about" component={About}/>
            <Route exact path="/contact" component={Contact}/>
            <Route exact path="/admin" component={Admin}/>
            <Route exact path="/products/:brand" component={Products}/>
          </Switch> 
        </Router>
    </div>
  );
}


export default App;