import React, { useContext, useState, useMemo, useEffect, useRef } from "react";
import { Pencil, CircleFadingPlus, ArrowLeft } from "lucide-react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Select, 
	SelectItem,
	Progress,
	Divider,
	Input,	
	modal,
	button
} from "@nextui-org/react";

import { useParams } from "react-router-dom"
import { EditModeContext } from '../contexts/EditModeContext';
import ErrorModal from "./ErrorModal";
import useError from "../hooks/useError";
import {wsHandler} from '../services/websocket'
import config from "../configs/config";
export const Toolbar = ({onAddButton}) => {
	const { toggleEditMode } = useContext(EditModeContext);

	return (
		<>
		<div className="flex items-center justify-between rounded-3xl h-9 w-23 bg-gray-100 border-1 border-gray-300 shadow-xs shadow-gray-200 px-2">

			<div  className="flex w-7 h-7 items-center justify-center rounded-full bg-gray-100">
				<AddButtonModal onAddButton={onAddButton}/>
			</div>

			<div className="h-5 w-px bg-gray-300 mx-2"></div>

			<Pencil onClick={toggleEditMode} size={19} strokeWidth={"2px"} color="black" className="cursor-pointer mx-[3px]"/>
		</div>
		</>
	);
};


export const AddButtonModal = ({onAddButton}) => {
	const readTimeout = 15000;
	const wsUrl = config.wssUrl;

	const [modalState, setModalState] = useState(1);
	const [buttonName, setButtonName] = useState("");	

	const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
	
	const attributes = useError("");
	const {error, setError} = attributes;
	const { remoteName } = useParams();
	const timeoutRef = useRef(null);
	
	const isInvalid = useMemo(() => {
		if (buttonName === "") return false; 

		const regex = /^[a-zA-Z0-9- ]+$/;

		return regex.test(buttonName) ? false : true;
	}, [buttonName]);

	const successResponseFormat = (data)  => {
		const response = JSON.parse(data);
		return (response.action === "ack");
	};

	const setStatus = (status) => {
		if (status==="loading") return ;
		if (status==="error") {
			setError("Unexpected error occured while reading button. Didn't manage to successfuly read a button.");
			return;
		} 
		if (status==="success") {
			timeoutRef.current && clearTimeout(timeoutRef.current);
			setButtonName("");
			setModalState(1);
			onClose();
			onAddButton();
			return;
		}
	}

	useEffect(() => {
		onClose();
		setModalState(1);
	},[error])

	// Reset back to step 1 after timeout when reaching final step
	useEffect(() => {
		if (modalState !== 5) return;

		const ws_payload = { 
			"action": "cmd",
			"cmd": "read",
			"remoteName": remoteName,
			"buttonName": buttonName
		}

		wsHandler(wsUrl, ws_payload, readTimeout, successResponseFormat, setStatus, setError);
		timeoutRef.current = setTimeout(()=>{
			setButtonName("");
			setModalState(1);
			onClose();
			return;
		}, readTimeout);
	},[modalState])

	// Restart the steps of the modal if the user closes it
	useEffect(()=>{
		if (modalState > 4 || isOpen) return;
		
		setButtonName("");
		setModalState(1);
	},[isOpen])

	// Steps of add new button 	modal
	const renderModalStep = () => {
		switch(modalState) {
			case 1:
				return <div className="w-full -mt-1">
						<p className="mb-4"> Does your remote have a screen?</p>
						<Select 
							label="Select an option" 
							className="max-w-xs" 
							onChange={(e) => setModalState(parseInt(e.target.value))}
						>
							<SelectItem key="2">
								Yes
							</SelectItem>
							<SelectItem key="3">
								No
							</SelectItem>
						</Select>
						</div>
			case 2:
				return (<div className="-mt-1 -mb-1">
							<div className="mb-1">Remotes that have screens on them showing the state of the device (e.g., Air Conditioners) send the entire device's state on each button press.</div> 
							<div className="flex items-center justify-center w-full"><Divider className="w-3/4"></Divider></div>
							<div className="mt-2 ">It is advised that you:
							<ul className="list-disc ml-6 mt-1 mb-2">
								<li>Set the desired state on the remote</li>
								<li>Press the power off button</li>
								<li>Save the power on button</li>
							</ul>
							</div>
							<div className="flex items-center justify-center w-full"><Divider className="w-3/4"></Divider></div>
							<div className="mt-2">The entire state will be saved and on button press the device will power on in that exact state.</div>
						</div>
						)
			case 3:
				return (<div className="-mt-1 -mb-1">
							<Input
								type="buttonName"
								label="Button Name"
								variant="bordered"
								isInvalid={isInvalid}
								color={(buttonName === "") ? "default" : (isInvalid ? "danger" : "success")}
								errorMessage="Please enter a valid button name"
								onValueChange={setButtonName}
								className="max-w-xs"
							/>
						</div>)
			case 4:
				return (<div className="-mt-1 -mb-1">
							<div className="mb-3">When the device starts blinking, point your remote to the IR receiver and press the button.</div> 
							<div className="my-3">The device should blink faster if the read was successful.</div>
							<div className="mt-3">Press next when you're ready.</div>
						</div>)
			case 5:
				return <>
						<div className="mb-4"><p>Point your remote at the device and press the button.</p></div>
						<Progress
							size="sm"
							isIndeterminate
							aria-label="Loading..."
							className="max-w-md"
						/></>;
		}
	}

	const incrStep = () => {
		if (!(modalState === 3 && (isInvalid || buttonName === ""))) {
			setModalState(modalState+1)
		};
	}

	

	return (
		<>
		<CircleFadingPlus onClick={onOpen} size={19} strokeWidth={"2px"} color="black" className="cursor-pointer"/>
		
		{/* Add Button Modal */}
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"top-center"}>
		<ModalContent>
		{(onClose) => (
			<>
			<ModalHeader>
				{(modalState !== 5) ? "Add Button": ""}
			</ModalHeader>
			<ModalBody className="">
				{renderModalStep()}
			</ModalBody>
			<ModalFooter>
				{(modalState !== 1) && (modalState !== 5) 
				? <>
					<Button color="danger" variant="light" onPress={onClose}>
					Close
					</Button>
					<Button color="primary" onPress={incrStep}>
					Next
					</Button>
				  </>
				: null
				}
			</ModalFooter>
			</>
			
		)}
		</ModalContent>
		</Modal>
		<ErrorModal {...attributes}/>
		</>
	);

}