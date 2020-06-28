import React from 'react';
import { Switch, Redirect, Route } from 'react-router';
import Registration from '../components/views/Auth/Registration/Registration';
import AccountLayout from '../components/layouts/AccountLayout/AccountLayout';
import AuthLayout from '../components/layouts/AuthLayout/AuthLayout';
import ModalViewLayout from '../components/layouts/ModalViewLayout/ModalViewLayout';
const Authorization = React.lazy(() => import('../components/views/Auth/Authorization/Authorization'));
const Landing = React.lazy(() => import('../components/views/Landing/Landing'));
const Home = React.lazy(() => import('../components/views/Home/Home'));
const Profile = React.lazy(() => import('../components/views/Profile/Profile'));
const SayThx = React.lazy(() => import('../components/views/SayThx/SayThx'));


const RenderAppComponent = (props:any) => (
    <AccountLayout>
        {props}        
    </AccountLayout>
)

const RenderAuthComponent = (props:any) => (
    <AuthLayout>
        {props}
    </AuthLayout>
);

export const RenderModalComponent = (props:any) => (
    <ModalViewLayout>
        {props}
    </ModalViewLayout>
)

const Router = () => {
    return(
        <Switch>
            <Redirect exact from="/" to="/main" />
            <Route path="/main" component={Landing} />
            <Route path="/authorization" render={props => RenderAuthComponent(<Authorization />)} />
            <Route path="/registration/:restID" render={props => RenderAuthComponent(<Registration />)} />
            <Route path="/registration" render={props => RenderAuthComponent(<Registration />)} />
            <Route path="/home" render={props => RenderAppComponent(<Home />)} />
            <Route path="/profile" render={props => RenderAppComponent(<Profile />)} />
            <Route path="/saythx/:waiterId/:photoUrl/:name/:rest" component={SayThx} />
            {/* <Route path="/saythx" component={SayThx} /> */}
        </Switch>
    );
};

export default Router;
