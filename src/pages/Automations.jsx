import React, {useEffect} from "react";
import config from "../configs/config";

import useError from "../hooks/useError";
import useFetchMemo from "../hooks/useFetchMemo";

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
	const apiUrl = config.apiUrl;
	const attributes = useError("");

	const { data, loading, error, refetch } = useFetchMemo(`${apiUrl}/automations`);

	useEffect(() => {
		if (!error) return;
		attributes.setError(error);
	},[error])
	
	// This is a workaround to rerender this component
	// If this component is only dependent on `data`, then because of shallow comparison it won't rerenderW
	const Grid = ({length, data}) => (
		<DraggingProvider>
			<TileList size={length}>
				{ 
				data.map((item, index) => <TileAutomation key={index} id={index} item={item} refetch={refetch}/>)
				}
			</TileList>
		</DraggingProvider> 
	)

	return (
		<>
		<div className="w-full overflow-x-hidden overflow-y-scroll">
		<TopToolbar/>
		<EditModeProvider>
		

			{/* Secondary Toolbar */}
			<div className="flex justify-between items-center flex-row mt-6 mb-3 ml-2">
				<div className="flex justify-center items-center">
					<span className="font-sans font-medium text-xl">
						Your Automations
					</span>
					<div className="flex justify-center items-center ml-2 rounded-lg w-6 h-6 bg-green-600">
						<span className="font-sans text-center text-white text-xs" >
						 {data ? data.length : 0}
						</span>
					</div>
				</div>
				<div className="flex items-center justify-center pr-3">
					<Toolbar>
						<ModalAddAutomation onAddAutomation={refetch} />
					</Toolbar>
				</div>
			</div>
			<NoticeBox>
				If the device loses connection it will take up to 10 minutes to show up as disconnected.
			</NoticeBox>
			
			{data && data?.length > 0 ? 
				<Grid length={data.length} data={data}/>
			: null
			}
		</EditModeProvider>
	</div>
	<ModalError {...attributes}/>
	</>
	);
};



export default Automations;
