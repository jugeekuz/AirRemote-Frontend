import React from "react";
import Active from '../assets/icons/active.svg?react';
import Inactive from '../assets/icons/inactive.svg?react';

import rgbStripImg from '../assets/imgs/rgb-strip.png'
import acImg from '../assets/imgs/airconditioner-black-side.png';
import tvImg from '../assets/imgs/tv-gray.png'
import heaterImg from '../assets/imgs/heater-black.png'
import speakerImg from '../assets/imgs/speakers-black.png'
import dehumidiferImg from '../assets/imgs/dehumidifier-black.png'
import genericImg from '../assets/imgs/generic-device-blue.png'

const InfoBar = (props) => {

	const RgbImg = () => (
		<div className="relative flex flex-row items-start overflow-hidden w-full h-full">
			<div 
				className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 -mb-2"
				style={{ backgroundImage: `url(${rgbStripImg})`,
						backgroundSize: 'auto 100%',
						backgroundPosition: 'bottom left'}}
			></div>
		</div>
	)

	const AcImg = () => (
		<div className="relative flex flex-row items-start overflow-hidden w-full h-full">
			<div 
				className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 "
				style={{ backgroundImage: `url(${acImg})`,
						backgroundSize: 'auto 100%',
						backgroundPosition: 'bottom left'}}
			></div>
		</div>
	)

	const TvImg = () => (
		<div className="relative flex flex-row items-start overflow-hidden w-full h-full">
			<div 
				className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 -mb-1 ml-1"
				style={{ backgroundImage: `url(${tvImg})`,
						backgroundSize: 'auto 100%',
						backgroundPosition: 'bottom left'}}
			></div>
		</div>
	)

	const HeaterImg = () => (
		<div className="relative flex flex-row items-start overflow-hidden w-full h-full">
			<div 
				className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 ml-1"
				style={{ backgroundImage: `url(${heaterImg})`,
						backgroundSize: 'auto 100%',
						backgroundPosition: 'bottom left'}}
			></div>
		</div>
	)
	const SpeakersImg = () => (
		<div className="relative flex flex-row items-start overflow-hidden w-full h-full">
			<div 
				className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 ml-1"
				style={{ backgroundImage: `url(${speakerImg})`,
						backgroundSize: 'auto 100%',
						backgroundPosition: 'bottom left'}}
			></div>
		</div>
	)

	const DehumidifierImg = () => (
		<div className="relative flex flex-row items-start overflow-hidden w-full h-full">
			<div 
				className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 ml-1"
				style={{ backgroundImage: `url(${dehumidiferImg})`,
						backgroundSize: 'auto 100%',
						backgroundPosition: 'bottom left'}}
			></div>
		</div>
	)

	const GenericImg = () => (
		<div className="relative flex flex-row items-start overflow-hidden w-full h-full">
			<div 
				className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 ml-1"
				style={{ backgroundImage: `url(${genericImg})`,
						backgroundSize: 'auto 100%',
						backgroundPosition: 'bottom left'}}
			></div>
		</div>
	)

	const renderImg = {
		"Generic Device": <GenericImg/>,
		"Air Conditioner": <AcImg/>,
		"Dehumidifier": <DehumidifierImg/>,
		"RGB Lights": <RgbImg/>,
		"Audio System": <SpeakersImg/>,
		"Heater": <HeaterImg/>,
		"Smart TV": <TvImg/>
	}
	return (
		<div className=" p-1">
            <div className={`flex justify-center align-center flex-col w-full bg-gray-950 rounded-md p-4 shadow-2xl 
							h-[11rem]
							xl:h-60
							`}>

				{/* Top Container */}
				<div className={`flex justify-between items-center flex-row h-[55%]
								sm:px-4
								md:px-8
								lg:px-12
								`}>

					{/* <img className={`w-32 sm:w-40 md:w-44 lg:w-56`} src={acImg} alt="Air Conditioner" /> */}
					{renderImg[props.category]}
					
					<div className="flex flex-col text-nowrap">
						<span className={`font-sans font-semibold text-white 
										text-xl
										lg:text-2xl
										`}>
							{props.remoteName}
						</span>
						<span className="font-sans font-normal text-gray-500 
										text-sm
										lg:text-md">
							{props.category}
						</span>
					</div>
				</div>

				{/* Divider */}
				<div className="w-full h-0 bg-black shadow-2xl shadow-white border border-gray-800 my-1"/>

				{/* Bottom Container */}
				<div className={`flex items-center justify-between flex-row h-[45%]
								sm:px-4
								md:px-8
								lg:px-12
								`}>
					<div className="flex flex-col ml-1">
						<span className="font-sans font-semibold text-white
										text-lg
										lg:text-2xl" >
							{props.deviceName}
						</span>
						<span className="font-sans font-normal text-gray-500 
										text-sm
										lg:text-md">
							{props.macAddress}
						</span>
					</div>
					{/* */}
					<div className="flex items-center mr-1">
						<span className="font-sans font-semibold text-white 
										text-lg
										lg:text-2xl">
							{props.isConnected ? "Connected" : "Disconnected"}
						</span>
						<div className="w-3 ml-1">{props.isConnected ? <Active/> : <Inactive/>}</div>
					</div>
				</div>
			</div>
          </div>
	);
};

export default InfoBar;
