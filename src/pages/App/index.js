import { BrowserRouter as Router, Route, Switch, Redirect, HashRouter } from 'react-router-dom'
import Auth from '../Auth';
import Dashboard from '../Dashboard';
import Social from '../Social';
import './App.scss';
import 'react-notifications/lib/notifications.css';
import { initFacebookSdk } from '../../shared/services/facebooksdk';
import { useEffect } from 'react';


const App = () => {
    
    useEffect(() => {
       initFacebookSdk();
    }, [])
    
    return (
        <HashRouter>
            <Switch>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/auth" component={Auth} />
                <Route path="/:username" component={Social} />
                <Redirect from="/" exact to="/dashboard" />
            </Switch>
        </HashRouter>
    );
}

export default App;
