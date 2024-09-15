import React, { useState, useMemo, useEffect, useRef } from "react";
import { CircleFadingPlus } from "lucide-react";
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
	TimeInput,
	Divider
} from "@nextui-org/react";

import {DatePicker} from "@nextui-org/react";
import {now, getLocalTimeZone, Time} from "@internationalized/date";

import useError from "../hooks/useError";
import useAdd from "../hooks/useAdd";

import ModalError from "./ModalError";
import config from "../configs/config";

export const ModalAddAutomation = ({deviceData, onAddRemote}) => {
	const apiUrl = config.apiUrl;
	const [modalState, setModalState] = useState(1);
	const [automationName, setAutomationName] = useState("");	

	const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
	
	const attributes = useError("");
	const {error, setError} = attributes;
	
	const isInvalid = useMemo(() => {
		if (automationName === "") return false; 

		const regex = /^[a-zA-Z0-9- ]+$/;

		return regex.test(automationName) ? false : true;
	}, [automationName]);

	useEffect(() => {
		onClose();
		setModalState(1);
	},[error])

	// Restart the steps of the modal if the user closes it
	useEffect(()=>{
		if (modalState > 4 || isOpen) return;
		
		setAutomationName("");
		setModalState(1);
	},[isOpen])


	const stepsMapping = {
		1: <Step1 />,
		2: <Step2 />
	}
	const incrStep = () => {
		// if (modalState === 1 && remoteCategory === "") return;
		// if (modalState === 2 && deviceName === "") return;
		// if (modalState === 3 && (isInvalid || automationName === "")) return;
		setModalState(modalState+1);
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
				Add Automation
			</ModalHeader>
			<ModalBody className="">
				{stepsMapping[modalState]}
			</ModalBody>
			<ModalFooter>
				{(modalState < 3) ?
					<>
					<Button color="danger" variant="light" onPress={onClose}>
						Close
					</Button>
					<Button color="primary" onPress={incrStep}>
						Next
					</Button>
					</>
					: 
					<>
					<Button color="primary" onPress={incrStep}>
						Create
					</Button>
					</>
				}
			</ModalFooter>
			</>
			
		)}
		</ModalContent>
		</Modal>
		<ModalError {...attributes}/>
		</>
	);

}
const Step1 = () => (
	<div className="-mt-1 -mb-1">
		<div className="mb-1">Automations are a series of remote control commands, on potentially multiple devices, that can run repeatedly or once at specific points of time.</div> 
		<div className="flex items-center justify-center w-full"><Divider className="w-3/4"></Divider></div>
		<div className="mt-2 ">To create an automation you will:
		<ul className="list-disc ml-6 mt-1 mb-2">
			<li>Select the remote buttons in the series you wish to be executed</li>
			<li>Select if you want the automation to run once or repeatedly</li>
			<li>Select either the days of the week, or exact date and time </li>
		</ul>
		</div>
		{/* <div className="flex items-center justify-center w-full"><Divider className="w-3/4"></Divider></div>
		<div className="mt-2">The entire state will be saved and on button press the device will power on in that exact state.</div> */}
	</div>
)
const Step2 = () => (
	<div className="w-full -mt-1">
		<div className="flex flex-col w-full h-full -mt-1 -mb-1">
			<div className="mt-2 mb-4">
				<span className="font-normal text-sm">Select the days the automation will run :</span>
				<Select
					label="Event days"
					selectionMode="multiple"
					placeholder="Select automation days"
					className="max-w-xs mt-2"
				>
					<SelectItem key="Monday">
						Monday
					</SelectItem>
					<SelectItem key="Tuesday">
						Tuesday
					</SelectItem>
					<SelectItem key="Wednesday">
						Wednesday
					</SelectItem>
					<SelectItem key="Thursday">
						Thursday
					</SelectItem>
					<SelectItem key="Friday">
						Friday
					</SelectItem>
					<SelectItem key="Saturday">
						Saturday
					</SelectItem>
					<SelectItem key="Sunday">
						Sunday
					</SelectItem>
				</Select>
			</div>
			<Divider className="max-w-xs"></Divider>
			<div className="mt-3">
				<span className="font-normal text-sm mt-2">Select the hour the automation will run :</span>

				<TimeInput className="max-w-xs mt-2" label="Event Time" /></div>
		</div>
	</div>
)



export default ModalAddAutomation;