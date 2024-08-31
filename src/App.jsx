import React from 'react';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Sidebar, SidebarItem } from './components/Sidebar';
import { LayoutDashboard, SatelliteDish, Microchip, CalendarFold } from 'lucide-react';

import Automations from './pages/Automations';
import Devices from './pages/Devices';
import Remotes from './pages/Remotes';
import RemoteButtons from './pages/RemoteButtons';
import Dashboard from './pages/Dashboard';

function App() {
  
  return (
      <div className="flex w-screen h-100dvh bg-white">
        <Sidebar>          
          <SidebarItem icon={<LayoutDashboard size={20}/>} text="Dashboard" to="/"/>
          <SidebarItem icon={<SatelliteDish size={20}/>} text="Remotes" to="/remotes" />
          <SidebarItem icon={<Microchip size={20}/>} text="Devices" to="/devices"/>
          <SidebarItem icon={<CalendarFold size={20}/>} text="Automations" to="/automations"/>
        </Sidebar>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/remotes" element={<Remotes />} />
          <Route path="/remotes/:remoteName" element={<RemoteButtons/>} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/automations" element={<Automations />} />
        </Routes>
      </div>
  )
}

export default App;