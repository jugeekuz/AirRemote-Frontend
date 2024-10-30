import React, {useEffect, useState} from 'react';

import { BrowserRouter, Route, Routes, Link, Navigate, Outlet } from 'react-router-dom';
import { Sidebar, SidebarItem } from './components/Sidebar';
import {NavigationBar, NavigationBarItem} from './components/NavigationBar';
import { LayoutDashboard, Usb, CalendarCog } from 'lucide-react';
import Remote2 from './assets/icons/remote.svg?react';

import Remote from './assets/icons/remote-access.svg?react';
import Automations from './pages/Automations';
import Devices from './pages/Devices';
import Remotes from './pages/Remotes';
import RemoteButtons from './pages/RemoteButtons';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
function App() {
	const location = useLocation();
  const navigate = useNavigate();

  return (
      <div className="flex flex-col sm:flex-row w-screen h-100dvh sm:px-0 bg-white">
        <AuthProvider>
          <Routes>
            {/* Authenticated Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Navigation><Dashboard /></Navigation>} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/remotes" element={<Navigation><Remotes /></Navigation>} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/remotes/:remoteName" element={<Navigation><RemoteButtons/></Navigation>} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/devices" element={<Navigation><Devices /></Navigation>} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/automations" element={<Navigation><Automations /></Navigation>} />
            </Route>

            {/* Unauthenticated Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/sign-up" element={<SignUp />} />
            </Route>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

          </Routes>
        </AuthProvider>
      </div>
  )
}

const Navigation = ({children}) => (
  <>
    <Sidebar>          
      <SidebarItem icon={<LayoutDashboard size={20} strokeWidth={"1.7px"}/>} text="Dashboard" to="/"/>
      <SidebarItem icon={<Remote className="w-6 h-6 stroke-current stroke-[0.2]"/>} text="Remotes" to="/remotes" />
      <SidebarItem icon={<Usb size={20} strokeWidth={"1.7px"}/>} text="Devices" to="/devices"/>
      <SidebarItem icon={<CalendarCog size={20} strokeWidth={"1.7px"}/>} text="Automations" to="/automations"/>
    </Sidebar>
    {children}
    <NavigationBar>
    <NavigationBarItem icon={<LayoutDashboard size={20} strokeWidth={"1.7px"} />} text="Dashboard" to="/"/>
    <NavigationBarItem icon={<Remote2 className="w-[20px] h-[20px] stroke-current stroke-2 rotate-45" />} text="Remotes" to="/remotes"/>
    <NavigationBarItem icon={<Usb size={20} strokeWidth={"1.7px"}/>} text="Devices" to="/devices"/>
    <NavigationBarItem icon={<CalendarCog size={20} strokeWidth={"1.7px"}/>} text="Automations" to="/automations"/>
    </NavigationBar>
    <div className="flex mb-16 sm:mb-0"></div>
  </>
)

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet/> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <Outlet/> : <Navigate to="/" />;
};

export default App;