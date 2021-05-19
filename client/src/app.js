import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';

const App = () => (
    <Router>
        <Route path="/"/>
        <Route path="/chat"/>
    </Router>
);

export default App;