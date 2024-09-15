import React, { useContext } from "react";
import { Pencil, CircleFadingPlus } from "lucide-react";

import { EditModeContext } from '../contexts/EditModeContext';
const Toolbar = ({children}) => {

	const { toggleEditMode } = useContext(EditModeContext);

	return (
		<>
		<div className="flex items-center justify-between rounded-3xl h-9 w-23 bg-gray-100 border-1 border-gray-300 shadow-xs shadow-gray-200 px-2">

			<div  className="flex w-7 h-7 items-center justify-center rounded-full bg-gray-100">
				{/* <ModalAddButton onAddButton={onAddButton}/> */}
				{children}
				
			</div>

			<div className="h-5 w-px bg-gray-300 mx-2"></div>

			<Pencil onClick={toggleEditMode} size={19} strokeWidth={"2px"} color="black" className="cursor-pointer mx-[3px]"/>
		</div>
		</>
	);
};
export default Toolbar;