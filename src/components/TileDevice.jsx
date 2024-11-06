import React, { useContext, useEffect, useState } from "react";
import {
	useSortable
} from "@dnd-kit/sortable";

import { Grip } from "lucide-react";
import { CSS } from '@dnd-kit/utilities';
import { Tooltip } from "@nextui-org/react";
import { EditModeContext } from '../contexts/EditModeContext';
import { DraggingContext }  from '../contexts/DraggingContext';

import TileDelete from "./TileDelete";

import config from '../configs/config';
import esp32Img from '../assets/imgs/microcontroller3.png'
import Active from '../assets/icons/active.svg?react';
import Inactive from '../assets/icons/inactive.svg?react';

export const TileDevice = ({id, item, isConnected, refetch}) => {
	const apiUrl = config.apiUrl;
	const UNDEFINED_MAC_ADDRESS = "FF:FF:FF:FF:FF:FF"
	const { editMode } = useContext(EditModeContext);
	const { dragging } = useContext(DraggingContext);
	const [isOpenTooltip, setIsOpenTooltip] = useState(false)

	useEffect(() => {
		if (!isOpenTooltip) return;
		setTimeout(() => {
			setIsOpenTooltip(false);
		}, 2000)
	},[isOpenTooltip])

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({ id: `${id}` });

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		zIndex: isDragging ? "100": "auto",
		opacity: isDragging ? 0.3 : 1
	}

	const getRandomAnimationDelay = () => {
		const delay = Math.random() * 0.133;
		return {animationDelay: `${delay}s`};
	  };

	const listenersOnState = editMode ? { ...listeners } : {};
	
	const IotImg = () => <div 
							className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 -ml-3"
							style={{ backgroundImage: `url(${esp32Img})`,
									backgroundSize: 'auto 100%',
									backgroundPosition: 'bottom left'}}
						></div>

	const IotImg3 = ({className, img}) => {
		return (
			<div className="w-full h-full flex justify-center items-end overflow-hidden z-0">
				<img
				src={esp32Img}
				alt="Speaker"
				className={`h-full max-w-full object-contain object-bottom -ml-3`}
				/>
			</div>
		)
	}
	return (
		<>
		<div 
			ref={setNodeRef} 
			className={`relative bg-gray-100 rounded-lg border-gray-300 h-[10rem] select-none border-2 ${(editMode && !dragging) ? "animate-shake" : ""}`}
			style={{...style, ...getRandomAnimationDelay()}} 
		>
			{
				item?.macAddress === UNDEFINED_MAC_ADDRESS?
					<Tooltip color={"danger"} content={"Connect this device to finish setup."} isOpen={isOpenTooltip}>
						<div
							onMouseEnter={() => setIsOpenTooltip(true)}
							onMouseLeave={() => setIsOpenTooltip(false)}
							onMouseDown={() => setIsOpenTooltip(!isOpenTooltip)} 
							className="flex justify-center items-center absolute top-0 right-3 -translate-y-1/2 rounded-full bg-red-500 w-[25px] h-[25px]">
							<span className="text-white font-normal font-poppins">!</span>
						</div>
					</Tooltip>
				: null

			}
			<div className="flex flex-col w-full h-full overflow-hidden">
				<div className="relative flex flex-col h-1/3 w-full items-start justify-start p-2 z-10">
						
					<div 
						className={`absolute top-2 right-2 z-10 flex flex-row justify-center items-center 
						cursor-pointer rounded-md w-10 h-10 
						border-1 border-gray-300 bg-gray-50 ml-2
						shadow-sm shadow-gray-200 
						${editMode ? "" : "hidden"}
						`}
						{...attributes} 
						{...listenersOnState}>
							<Grip size={15} strokeWidth={"2.5px"} />
					</div>


					<div className="flex flex-col w-full items-start justify-center  ">
						<span className="text-sm font-semibold text-gray-800">{item.deviceName}</span>
						<div className="flex flex-row ">
							{isConnected ?
								<>
									<span className="text-xs font-normal text-gray-600">Connected</span>
									<Active className="w-[10px] ml-[2px] mb-[2px]"/>
								</>
								:
								<>
									<span className="text-xs font-normal text-gray-600">Disconnected</span>
									<Inactive className="w-[10px] ml-[2px] mb-[2px]"/>
								</>
							}
						</div>
						
					</div>
					
				</div>
				<div className="relative flex h-2/3 w-full items-end justify-end overflow-visible">

					<IotImg/>
				</div>
				
			</div>
			{editMode? <TileDelete url={`${apiUrl}/devices/${item.macAddress}`} refetch={refetch} position={"left"}/>: null}
			
		</div>
		
		</>
		);
};

export default TileDevice;