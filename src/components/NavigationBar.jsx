import React from 'react'
import { useLocation, Link } from 'react-router-dom';

import { LayoutDashboard, House, Cpu, Usb, CalendarCog, Wifi } from 'lucide-react';

import Remote from '../assets/icons/remote.svg?react';
import Control from '../assets/icons/controller.svg?react';
import Cloud from '../assets/icons/cloud-network.svg?react';


export const NavigationBar = (props) => {

    return (
        <div className="fixed sm:hidden bottom-0 flex bg-white border-1 h-16 w-full shadow-md z-10" style={{ boxShadow: '0 -1px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <ul className="flex justify-around items-center py-2 w-full">
                {props.children}
            </ul>
        </div>
    )
}

export const NavigationBarItem = (props) => {
	const location = useLocation();
	const isActive = (location.pathname.includes(props.to) && props.to !== "/") || 
		(location.pathname === "/" && props.to === "/");

	return (
            <li>
                <Link to={props.to} className={`flex flex-col items-center ${isActive ? "text-green-500" : "text-gray-500" } hover:text-green-500`}>
                    {props.icon}
                    <span className="text-xs font-normal ">{props.text}</span>
                </Link>
            </li>
	)
}


