import React, { useContext } from "react";

import {
	useSortable
} from "@dnd-kit/sortable";

import { Grip } from "lucide-react";
import { CSS } from '@dnd-kit/utilities';

import { EditModeContext } from '../contexts/EditModeContext';
import { DraggingContext }  from '../contexts/DraggingContext';

import RemoteButton from "./RemoteButton";
import RemoteDeleteButton from "./RemoteDeleteButton";

export const ButtonTile = (props) => {
	const { editMode } = useContext(EditModeContext);
	const { dragging } = useContext(DraggingContext);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({ id: `${props.id}` });

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		zIndex: isDragging ? "100": "auto",
		opacity: isDragging ? 0.3 : 1
	}

	const getRandomAnimationDelay = () => {
		const delay = Math.random() * 0.133; // Delay between 0 and 2 seconds
		return {animationDelay: `${delay}s`};
	  };

	const listenersOnState = editMode ? { ...listeners } : {};
	return (
		<>
		<div 
			ref={setNodeRef} 
			className={`relative bg-gray-100 rounded-lg border border-gray-300 h-32 p-1 select-none ${(editMode && !dragging) ? "animate-shake" : ""}`}
			style={{...style, ...getRandomAnimationDelay()}} 
		>
			<div className="flex flex-col w-full h-full">

				<div className="flex h-1/2 w-full items-center justify-between ">

					<div 
						className="flex flex-row justify-center items-center 
									cursor-pointer rounded-md w-8 h-8 
									border-1 border-gray-300 bg-gray-50 ml-2"
						{...attributes} 
						{...listenersOnState}>
						<Grip size={15} strokeWidth={"2.5px"} />
					</div> 

					<RemoteButton remoteName={props.remoteName} buttonName={props.item.buttonName}/>
					
					</div>

					<div className="flex h-1/2 w-full align-items justify-between">

					<div className="flex flex-col justify-center items-left text-left ml-2">
						<span className="font-sans font-normal text-xs text-gray-500">{props.state ? "State" : "Stateless"}</span>
						<span className="font-sans font-medium text-sm text-gray-800">
							{props.item.buttonName}
						</span>
					</div>

				</div>
			</div>
			
			{editMode? <RemoteDeleteButton buttonName={props.item.buttonName} refetch={props.refetch}/>: null}
			
		</div>
		
		</>
		);
};
