import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	useSortable
} from "@dnd-kit/sortable";

import { Grip } from "lucide-react";
import { CSS } from '@dnd-kit/utilities';
import { Switch } from "@nextui-org/react";

import { EditModeContext } from '../contexts/EditModeContext';
import { DraggingContext }  from '../contexts/DraggingContext';

import TileDelete from "./TileDelete";

import config from '../configs/config';

import { ChevronRight } from "lucide-react";
export const TileAutomation = ({id}) => {
	const apiUrl = config.apiUrl;
	const { editMode } = useContext(EditModeContext);
	const { dragging } = useContext(DraggingContext);
	const navigate = useNavigate();
	const location = useLocation();

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
		const delay = Math.random() * 0.1; 
		return {animationDelay: `${delay}s`};
	  };

	const listenersOnState = editMode ? { ...listeners } : {};

	return (
		<>
		<div 
			ref={setNodeRef} 
			className={`relative bg-gray-100 rounded-lg border-gray-200 h-24 select-none border-2 ${(editMode && !dragging) ? "animate-shakeSm" : ""}`}
			style={{...style, ...getRandomAnimationDelay()}} 
		>
			<div className="flex flex-row w-full h-full justify-between overflow-hidden ">
				<div className="flex h-full  items-center mr-1">
                    <div className="flex flex-row justify-center items-center 
									cursor-pointer rounded-md w-9 h-12 
									border-1 border-gray-300 bg-gray-50 ml-2"
						{...attributes} 
						{...listenersOnState}>
						<Grip size={15} strokeWidth={"2.5px"} />
					</div> 
                </div>

				<div className="flex flex-col h-full min-w-1/2 justify-center items-start">
                    <div className="flex w-full">
                        <span className="text-sm font-semibold text-gray-800 text-left">Close AirConditioner morning</span>
                    </div>
                    
                    <div className="flex w-full">
                        <span className="text-xs font- font-normal text-gray-500">12-20 Aug - 06:00 AM</span>
                    </div>
                </div>

				<div className="flex flex-row h-full  justify-end ml-1">
                    <Switch defaultSelected size="sm" aria-label="Automatic updates" color="success"/>
                </div>
				
				
			</div>
			{editMode? <TileDelete url={`${apiUrl}/devices/45435`} refetch={() => {return;}} position={"left"}/>: null}
			
		</div>
		
		</>
		);
};


