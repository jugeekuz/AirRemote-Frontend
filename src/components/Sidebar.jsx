import React, { useState, useContext, createContext } from "react";
import { useLocation, Link } from 'react-router-dom';
import { ChevronFirst, ChevronLast, MoreVertical, MoonStar } from "lucide-react";
import Logo from '../assets/icons/airremote-logo.svg?react';
const SidebarContext = createContext();
export const Sidebar = (props) => {
	const [expanded, setExpanded] = useState(false);

	return (
		// w-16 mr-3 z-10
		<div className="hidden sm:block tems-center min-w-16 mr-2 z-[11] h-screen">
			<aside className={`fixed h-screen ${expanded ? "w-64" : "w-16"} transition-width`}>
				<nav className="h-full w-full flex flex-col bg-gradient-to-l from-white to-gray-50 border-r shadow-sm">
					<div className="border-b p-4 flex justify-between items-center">
						<Logo className={`transition-all duration-300  ${expanded ? "w-[10rem] h-12": "w-0 opacity-0 h-0"}`}/>
						<button
							onClick={() => setExpanded(!expanded)} 
							className="p-1.5 rounded-lg hover:bg-gray-100 transition-all"
						>
							{expanded ? <ChevronFirst /> : <ChevronLast />}
						</button>
					</div>

					<SidebarContext.Provider value={{ expanded }}>
						<ul className="flex-1 justify-center px-3">{props.children}</ul>
					</SidebarContext.Provider>
				</nav>
			</aside>
		</div>
	)
}

export const SidebarItem = (props) => {
	const { expanded } = useContext(SidebarContext);
	const location = useLocation();
	const isActive = (location.pathname.includes(props.to) && props.to !== "/") || 
		(location.pathname === "/" && props.to === "/");

	return (
		<Link to={props.to}>
			<li className={`
				relative z-10 flex justify-center items-center py-2 px-2 my-1 ml-[2px] w-full h-10 
				font-medium rounded-lg cursor-pointer
				transition-all duration-300 ${isActive 
					? "bg-gradient-to-tr from-green-200 to-green-100 text-green-800"
					: "hover:bg-green-50 text-gray-800"
				} group
			`}>
				{props.icon}
				<span className={`overflow-hidden transition-all duration-300 ${expanded ? "w-52 ml-3" : "w-0 opacity-0"} font-roboto font-medium text-gray-700`}>{props.text}</span>
				{props.alert && <div className={`absolute right-2 w-2 h-2 rounded bg-green-400 ${expanded ? "" : "top-2"}`}></div>}
				
			</li>
		</Link>
	)
}