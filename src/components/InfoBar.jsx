import React from "react";
import Active from '../assets/icons/active.svg?react';
import Inactive from '../assets/icons/inactive.svg?react';
import acImg from '../assets/imgs/airconditioner.png';
const InfoBar = () => {
	return (
		<div className=" p-1">
            <div className={`flex justify-center align-center flex-col w-full bg-gray-950 rounded-md p-4 shadow-2xl 
							h-40
							xl:h-60
							`}>

				{/* Top Container */}
				<div className={`flex justify-between items-center flex-row h-1/2
								sm:px-4
								md:px-8
								lg:px-12
								`}>

					<img className={`w-32 sm:w-40 md:w-44 lg:w-56`} src={acImg} alt="Air Conditioner" />

					<div className="flex flex-col">
						<span className={`font-sans font-semibold text-white 
										text-xl
										lg:text-2xl
										`}>
							Fujitsu AC
						</span>
						<span className="font-sans font-normal text-gray-500 
										text-sm
										lg:text-md">
							Air Conditioner
						</span>
					</div>
				</div>

				{/* Divider */}
				<div className="w-full h-0 bg-black shadow-md shadow-white border border-gray-800 my-1"/>

				{/* Bottom Container */}
				<div className={`flex items-center justify-between flex-row h-1/2
								sm:px-4
								md:px-8
								lg:px-12
								`}>
					<div className="flex flex-col">
						<span className="font-sans font-semibold text-white
										text-lg
										lg:text-2xl" >
							Living Room
						</span>
						<span className="font-sans font-normal text-gray-500 
										text-sm
										lg:text-md">
							Firebeetle-32
						</span>
					</div>
					{/* */}
					<div className="flex items-center mr-1">
						<span className="font-sans font-semibold text-white 
										text-lg
										lg:text-2xl">
							Connected
						</span>
						<div className="w-3 ml-1"><Active/></div>
					</div>
				</div>
			</div>
          </div>
	);
};

export default InfoBar;
