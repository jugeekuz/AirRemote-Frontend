import React, {useState} from "react";
import { ArrowLeft, Settings } from "lucide-react";
import UserLogo from '../assets/icons/avatar.svg?react';

import { useNavigate, useLocation } from 'react-router-dom';


import logoImg from '../assets/imgs/logo.png'

const TopToolbar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const isNested = location.pathname.split('/').filter(Boolean).length > 1;
	console.log(location.pathname)
	return (
		<div className="flex justify-between items-center h-16 w-full p-3">
			{ isNested?
				<div onClick={()=>navigate(-1)} className="flex justify-center items-center w-8 h-8 rounded-md bg-gray-50 cursor-pointer"><ArrowLeft /></div> 
				:
				<img
				src={logoImg}
				alt="Logo"
				className="w-9 h-9 "
				/>
			}
			
			<div className="flex items-center">
				<div className="flex w-8 h-8 items-center justify-center mx-2 rounded-full ">
					<Settings size={20}/>
				</div>
				<UserLogo className="w-6"/>
			</div>
		</div>
	)	
};

export default TopToolbar;
