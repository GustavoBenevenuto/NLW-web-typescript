import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePonit';

const Routes = () => {
    return(
        <BrowserRouter>
            {/* exact faz a verificação de igualdade, ou seja,
            só vai para Home, se for exatamente o caminho do path */}
            <Route component={Home} path="/" exact/>
            <Route component={CreatePoint} path='/create-point'/>
        </BrowserRouter>
    );
};
export default Routes;