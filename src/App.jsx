import React from 'react';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
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

function App() {
  
  return (
      <div className="flex flex-col sm:flex-row w-screen h-100dvh sm:px-0 bg-white">
        <Sidebar>          
          <SidebarItem icon={<LayoutDashboard size={20} strokeWidth={"1.7px"}/>} text="Dashboard" to="/"/>
          <SidebarItem icon={<Remote className="w-6 h-6 stroke-2"/>} text="Remotes" to="/remotes" />
          <SidebarItem icon={<Usb size={20} strokeWidth={"1.7px"}/>} text="Devices" to="/devices"/>
          <SidebarItem icon={<CalendarCog size={20} strokeWidth={"1.7px"}/>} text="Automations" to="/automations"/>
        </Sidebar>

        <div className="px-2 sm:px-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/remotes" element={<Remotes />} />
            <Route path="/remotes/:remoteName" element={<RemoteButtons/>} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/automations" element={<Automations />} />
          </Routes>
        <div className="mb-16 sm:mb-0"></div>
        </div>

        <NavigationBar>
          <NavigationBarItem icon={<LayoutDashboard size={20} strokeWidth={"1.7px"} />} text="Dashboard" to="/"/>
          <NavigationBarItem icon={<Remote2 className="w-[20px] h-[20px] stroke-current stroke-2 rotate-45" />} text="Remotes" to="/remotes"/>
          <NavigationBarItem icon={<Usb size={20} strokeWidth={"1.7px"}/>} text="Devices" to="/devices"/>
          <NavigationBarItem icon={<CalendarCog size={20} strokeWidth={"1.7px"}/>} text="Automations" to="/automations"/>

        </NavigationBar>
      </div>
  )
}
export default App;