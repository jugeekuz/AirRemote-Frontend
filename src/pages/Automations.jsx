import React, {useEffect, useState, useRef, useContext} from "react";
import config from "../configs/config";
import api from "../api/api";
import useError from "../hooks/useError";
import useFetchMemo from "../hooks/useFetchMemo";

import { EditModeProvider, EditModeContext } from "../contexts/EditModeContext";
import { DraggingProvider } from "../contexts/DraggingContext";

import ModalError from "../components/ModalError";
import TopToolbar from "../components/TopToolbar";
import Toolbar from "../components/Toolbar";
import NoticeBox from "../components/NoticeBox";
import ModalAddAutomation from "../components/ModalAddAutomation";
import { TileList } from "../components/TileList";
import { TileAutomation } from "../components/TileAutomation";
import EmptyTiles from "../components/EmptyTiles";
const Automations = () => {
	const apiUrl = config.apiUrl;
	const attributes = useError("");

	const isCleaned = useRef(false);
	const { data, loading, error, refetch } = useFetchMemo(`${apiUrl}/automations`);
	const [itemOrder, setItemOrder] = useState([]); // This represents which item is currently in the i-th position. If order[i] = 3 then the (originally) 4th item is in the (i+1)-th position
	const originalOrderIndex = useRef([]); // Same as below but original values.
	const newOrderIndex = useRef([]); // This represents in which position the item[i] should go. If item[i] = 3 then the i-th item should go to t

	useEffect(() => {
		if (!data || isCleaned.current) return;
		api({
			method: "POST",
			url: "/api/automations/clean",
			headers: {
			  'Content-Type': 'application/json',
			},
		})
		.then(() => {
		  isCleaned.current = true;
		})
		.catch(err => {
		  console.error("Error in cleaning automation:", err.message);
		});
	  
	}, [data]);
	
	useEffect(() => {
		if (!error) return;
		attributes.setError(error);
	},[error])
	
	useEffect(() => {
		if (!data) return;
		/*
		We're receiving for each item an orderIndex meaning that the item in position i should move to item.orderIndex
		We're looping through all items and initializing an array `newOrder` with each item from position i representing
		the item that had item.orderIndex == i.
		The reverse has to be done when saving the changes to the database
		*/
	
		const originalOrder = new Array(data.length);
		const newOrder = new Array(data.length);

		data.forEach((item, index) => {
			const new_order = parseInt(item.orderIndex);
			originalOrder[index] = parseInt(item.orderIndex);
			newOrder[new_order] = index;
		})

		originalOrderIndex.current = originalOrder;
		setItemOrder(newOrder);
	}, [data])

	// This is a workaround to rerender this component
	// If this component is only dependent on `data`, then because of shallow comparison it won't rerender
	const Grid = ({length, data, itemOrder}) => {
		const { editMode } = useContext(EditModeContext);
    
		useEffect(() => {
			if (editMode) return;
			if (newOrderIndex.current.length === 0) return;

			const orderChanged = !(newOrderIndex.current.every((element, index) => element === originalOrderIndex.current[index]));
			if (!orderChanged) return;
			console.log(newOrderIndex.current)
			const response = api({
				method: "POST",
				url: `${apiUrl}/automations/sort`,
				headers: {
				'Content-Type': 'application/json',
				},
				data: {"newOrder": newOrderIndex.current},
			});

			response
			.catch((error => attributes.setError(error.message)));
		}, [editMode])

		const onOrderChange = (newItemOrder) => {
			const orderChanged = !(itemOrder.every((element, index) => element === newItemOrder[index]));
			if (!orderChanged) return;
			const orderChanges = new Array(data.length);
			newItemOrder.forEach((item, index) => {
				orderChanges[item] = index;
			})
			
			newOrderIndex.current = orderChanges;
			
			setItemOrder(newItemOrder)
		}
		return <DraggingProvider>
			<TileList size={length} itemOrder={itemOrder} onOrderChange={onOrderChange}>
				{ 
				data.map((item, index) => <TileAutomation key={index} id={index} item={item} refetch={refetch}/>)
				}
			</TileList>
		</DraggingProvider> 
	}

	return (
		<>
		<div className="px-2 sm:px-0 w-full overflow-x-hidden overflow-y-scroll">
		<TopToolbar/>
		<EditModeProvider>
		

			{/* Secondary Toolbar */}
			<div className="flex justify-between items-center flex-row mt-6 mb-3 ml-2">
				<div className="flex justify-center items-center">
					<span className="font-sans font-medium text-xl mb-[1px]">
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
				Make sure devices are connected, otherwise the automation won't run.
			</NoticeBox>
			
			{data && data?.length > 0 ? 
				<Grid length={data.length} data={data} itemOrder={itemOrder}/>
			: <EmptyTiles text={"No automations available"}/>
			}
		</EditModeProvider>
	</div>
	<ModalError {...attributes}/>
	</>
	);
};



export default Automations;
