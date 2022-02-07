import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './pages/Home'
import Denoise from './pages/Denoise'
import Parameters from './pages/Parameters'
import Process from './pages/Process'

const Routes = () => (
  <Switch>
    <Route exact path='/' component={Home} />
    <Route exact path='/denoise' component={Denoise} />
    <Route exact path='/parameters' component={Parameters} />
    <Route exact path='/process' component={Process} />
  </Switch>
)

export default Routes
