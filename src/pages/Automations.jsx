import React from "react";

import useError from "../hooks/useError";

import { EditModeProvider } from "../contexts/EditModeContext";
import { DraggingProvider } from "../contexts/DraggingContext";

import ModalError from "../components/ModalError";
import TopToolbar from "../components/TopToolbar";
import Toolbar from "../components/Toolbar";
import NoticeBox from "../components/NoticeBox";
import ModalAddAutomation from "../components/ModalAddAutomation";
import { TileList } from "../components/TileList";
import { TileAutomation } from "../components/TileAutomation";
const Automations = () => {
	const attributes = useError("");

	return (
		<>
		<div className="w-full overflow-x-hidden overflow-y-scroll">
		<TopToolbar/>
				{/* <div className=" p-1">
					<div className={`flex justify-center align-center flex-col w-full bg-gray-950 rounded-md p-4 shadow-2xl 
						h-40
						xl:h-60
						`}>
					</div>
				</div> */}
		<EditModeProvider>
		

			{/* Secondary Toolbar */}
			<div className="flex justify-between items-center flex-row mt-6 mb-3 ml-2">
				<div className="flex justify-center items-center">
					<span className="font-sans font-medium text-xl">
						Your Automations
					</span>
					<div className="flex justify-center items-center ml-2 rounded-lg w-6 h-6 bg-green-600">
						<span className="font-sans text-center text-white text-xs" >
						 
							8
						</span>
					</div>
				</div>
				<div className="flex items-center justify-center pr-3">
					<Toolbar>
						<ModalAddAutomation/>
					</Toolbar>
				</div>
			</div>
			<NoticeBox>
				If the device loses connection it will take up to 10 minutes to show up as disconnected.
			</NoticeBox>
			
			<DraggingProvider>
				<TileList size={8}>
					<TileAutomation id={0} key={0}/>
					<TileAutomation id={1} key={1}/>
					<TileAutomation id={2} key={2}/>
					<TileAutomation id={3} key={3}/>
					<TileAutomation id={4} key={4}/>
					<TileAutomation id={5} key={5}/>
					<TileAutomation id={6} key={6}/>
					<TileAutomation id={7} key={7}/>
				</TileList> 
			</DraggingProvider>
		</EditModeProvider>
	</div>
	<ModalError {...attributes}/>
	</>
	);
};

export default Automations;
