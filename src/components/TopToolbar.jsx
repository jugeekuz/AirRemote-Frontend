import React from "react";
import { ArrowLeft, Settings } from "lucide-react";
import UserLogo from '../assets/icons/avatar.svg?react';

import { useNavigate } from 'react-router-dom';

const TopToolbar = () => {
	const navigate = useNavigate();

	return (
		<div className="flex justify-between items-center h-16 w-full p-3">
			<div onClick={()=>navigate(-1)} className="flex justify-center items-center w-8 h-8 rounded-md bg-gray-50 cursor-pointer"><ArrowLeft /></div>
			
			{/* <img src="https://img.logoipsum.com/297.svg" className="w-32"></img> */}
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
