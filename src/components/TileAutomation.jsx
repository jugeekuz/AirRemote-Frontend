import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	useSortable
} from "@dnd-kit/sortable";

import { Grip, CircleAlert } from "lucide-react";
import { CSS } from '@dnd-kit/utilities';
import { Switch, Tooltip } from "@nextui-org/react";

import usePost from "../hooks/usePost"
import useError from '../hooks/useError';

import { EditModeContext } from '../contexts/EditModeContext';
import { DraggingContext }  from '../contexts/DraggingContext';

import TileDelete from "./TileDelete";

import config from '../configs/config';

export const TileAutomation = ({id, item, refetch}) => {
	const apiUrl = config.apiUrl;

	const [isEnabled, setIsEnabled] = useState(item?.automationState === "ENABLED")
	const [isOpenTooltip, setIsOpenTooltip] = useState(false)
	const { postItem, success, error, data } = usePost(`${apiUrl}/automations/${item?.automationId}/state`);
	const [date, setDate] = useState("--:--")

	const errorAttributes = useError("");

	const { editMode } = useContext(EditModeContext);
	const { dragging } = useContext(DraggingContext);

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
	
	const toggleAutomation = () => {
		const payload = {"state": isEnabled ? "DISABLED": "ENABLED"};
		postItem(payload);
		setIsEnabled(!isEnabled);

	}

	useEffect(() => {
		if (!error) return;
		errorAttributes.setError(error);
	},[error])
	
	useEffect(() => {
		if (!isOpenTooltip) return;
		setTimeout(() => {
			setIsOpenTooltip(false);
		}, 2000)
	},[isOpenTooltip])

	// Convert date from utc to local
	useEffect(() => {
		if (!item?.automationHour || !item?.automationMinutes || !item?.automationDays) return;
		const utcDate = new Date();
		utcDate.setUTCHours(item.automationHour);
    	utcDate.setUTCMinutes(item.automationMinutes);
		utcDate.setUTCDate(2);
		
		const localHour = utcDate.getHours();
    	const localMinutes = utcDate.getMinutes();

		// Time difference might shift the day back or forward
		const dayDifference = utcDate.getDate() - utcDate.getUTCDate() ;
		// Shift days one back to have Sunday be last day
		const weekOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
		let daysExploded = item.automationDays.split(/[, -]/);
		daysExploded = daysExploded
			.map(day => parseInt(day))
			.map(day => (day - 1 + dayDifference)%7 + 1)
			.map(day => day == 1 ? 7 : (day-1))
			.sort((a, b) => a - b)
		const days = daysExploded.map(day => weekOrder[day-1])
		
		// Make consecutive days appear with a dash in between ex Mon,Tue,Wed -> Mon-Wed
		let result = [];
    
		// Initialize a temporary array to group consecutive days
		let tempGroup = [days[0]];
		
		// Iterate through the days array and group consecutive days
		for (let i = 1; i < days.length; i++) {
			// Check if the current day is consecutive to the previous one
			if (weekOrder.indexOf(days[i]) === weekOrder.indexOf(days[i-1]) + 1) {
				tempGroup.push(days[i]);
			} else {
				// If not consecutive, finalize the current group and start a new one
				if (tempGroup.length > 1) {
					result.push(`${tempGroup[0]}-${tempGroup[tempGroup.length - 1]}`);
				} else {
					result.push(tempGroup[0]);
				}
				tempGroup = [days[i]];
			}
		}
		
		// Add the last group to the result
		if (tempGroup.length > 1) {
			result.push(`${tempGroup[0]}-${tempGroup[tempGroup.length - 1]}`);
		} else {
			result.push(tempGroup[0]);
		}
		
		const AM = localHour < 12

		// Join all groups with commas and return the result
		setDate(`${result.join(", ")} - ${(AM ? localHour : localHour-12).toString().padStart(2, '0')}:${localMinutes.toString().padStart(2, '0')} ${AM ? "AM" : "PM"}`);


	}, [item])
	return (
		<>
		<div 
			ref={setNodeRef} 
			className={`relative bg-gray-100 rounded-lg border-gray-200 h-24 select-none border-2 ${(editMode && !dragging) ? "animate-shakeSm" : ""}`}
			style={{...style, ...getRandomAnimationDelay()}} 
		>	
			{
				item?.runError === "True" ?
					<Tooltip color={"danger"} content={item.errorMessage} isOpen={isOpenTooltip}>
						<div
							onMouseEnter={() => setIsOpenTooltip(true)}
							onMouseLeave={() => setIsOpenTooltip(false)}
							onPress={() => setIsOpenTooltip(!isOpenTooltip)} 
							className="flex justify-center items-center absolute top-0 left-10 -translate-y-1/2 rounded-full bg-red-500 w-[25px] h-[25px]">
							<span className="text-white font-normal font-poppins">!</span>
						</div>
					</Tooltip>
				: null

			}
					
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

				<div className="flex flex-col h-full min-w-[30%] justify-center items-start ml-1">
                    <div className="flex w-full">
                        <span className="text-sm font-semibold text-gray-800 text-left">{item?.automationName}</span>
                    </div>
                    
                    <div className="flex w-full">
                        <span className="text-xs font- font-normal text-gray-500">{date}</span>
                    </div>
                </div>

				<div className="flex flex-row h-full  justify-end ml-1">
                    <Switch isSelected={isEnabled} onValueChange={toggleAutomation} size="sm" aria-label="Automatic updates" color="success"/>
                </div>
				
				
			</div>
			{editMode? <TileDelete url={`${apiUrl}/automations/${item?.automationId}`} refetch={() => refetch()} position={"left"}/>: null}
			
		</div>
		
		</>
		);
};

export default TileAutomation;