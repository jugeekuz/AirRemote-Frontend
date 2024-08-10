import React from "react";
import { ArrowLeft, Settings } from "lucide-react";
import UserLogo from '../assets/icons/avatar.svg?react';
const TopToolbar = () => {
	return (
		<div className="flex justify-between items-center h-16 w-full p-4">
			<ArrowLeft/>
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
