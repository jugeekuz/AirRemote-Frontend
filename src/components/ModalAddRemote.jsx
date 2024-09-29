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
	Progress,
	Divider,
	Input,	
} from "@nextui-org/react";

import { useParams } from "react-router-dom"

import useError from "../hooks/useError";
import usePost from "../hooks/usePost";

import ModalError from "./ModalError";
import config from "../configs/config";

export const ModalAddRemote = ({deviceData, onAddRemote}) => {
	const apiUrl = config.apiUrl;
	const remoteCategories = ["Air Conditioner", "Audio System", "Dehumidifier", "Heater", "RGB Lights", "Smart TV", "Generic Device"];

	const { postItem, success: remoteAddSuccess, error: remoteAddError, data: remoteAddResponse } = usePost(`${apiUrl}/remotes`);

	const devicesList = useRef([]);
	const [modalState, setModalState] = useState(1);
	const [remoteName, setRemoteName] = useState("");	
	const [remoteCategory, setRemoteCategory] = useState("");	
	const [deviceName, setDeviceName] = useState("");	

	const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
	
	const attributes = useError("");
	const {error, setError} = attributes;
	
	const isInvalid = useMemo(() => {
		if (remoteName === "") return false; 

		const regex = /^[a-zA-Z0-9- ]+$/;

		return regex.test(remoteName) ? false : true;
	}, [remoteName]);

	useEffect(() => {
		if (!remoteAddError) return;
		attributes.setError(remoteAddError);
	  },[remoteAddError])

	useEffect(() => {
		onClose();
		setModalState(1);
	},[error])

	// Restart the steps of the modal if the user closes it
	useEffect(()=>{
		if (modalState > 4 || isOpen) return;
		
		setRemoteName("");
		setDeviceName("");
		setRemoteCategory("");
		setModalState(1);
	},[isOpen])

	useEffect(() => {
		devicesList.current = [];
		deviceData && deviceData.map((item, index) => devicesList.current.push(item?.deviceName));
	},[deviceData])

	useEffect(() => {
		onClose();
		onAddRemote();
		setRemoteName("");
		setDeviceName("");
		setRemoteCategory("");
		setModalState(1);
	},[remoteAddSuccess])

	const stepsMapping = {
		1: <Step1 categoriesList={remoteCategories} callback={(e) => setRemoteCategory(e.target.value)}/>,
		2: <Step2 deviceList={devicesList.current} callback={(e) => setDeviceName(e.target.value)}/>,
		3: <Step3 remoteName={remoteName} isInvalid={isInvalid} setRemoteName={setRemoteName}/>
	}
	const incrStep = () => {
		if (modalState === 1 && remoteCategory === "") return;
		if (modalState === 2 && deviceName === "") return;
		if (modalState === 3 && (isInvalid || remoteName === "")) return;
		setModalState(modalState+1);
	}

	const addRemote = () => {
		if (!remoteCategory) return;
		if (!deviceName) return;
		if (!remoteName || isInvalid) return;

		const device = deviceData.find(item => item.deviceName === deviceName)

		const macAddress = device.macAddress;

		const payload = {
			"remoteName": remoteName,
			"category": remoteCategory,
			"macAddress": macAddress,
			"buttons": []
		}
		postItem(payload);
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
				Add Remote
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
					<Button color="primary" onPress={addRemote}>
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

const Step1 = ({categoriesList, callback}) => (
	<div className="w-full -mt-1">
		<p className="mb-4">Select remote category:</p>
		<Select 
			label="Select an option" 
			className="max-w-xs" 
			onChange={callback}
		>
			{ categoriesList && categoriesList.map((item, index) => (
				<SelectItem key={item}>
					{item}
				</SelectItem>
			))}
		</Select>
	</div>
)

const Step2 = ({deviceList, callback}) => (
	<div className="w-full -mt-1">
		<p className="mb-4">Select IoT device that will use this remote:</p>
		<Select 
			label="Select an option" 
			className="max-w-xs" 
			onChange={callback}
		>
			{ deviceList && deviceList.map((item, index) => (
				<SelectItem key={item}>
					{item}
				</SelectItem>
			))}
		</Select>
	</div>
)

const Step3 = ({isInvalid, remoteName, setRemoteName}) => (
	<div className="-mt-1 -mb-1">
		<div className="flex mb-3">Select a name for the new remote</div>
		<Input
			type="remoteName"
			label="Remote Name"
			variant="bordered"
			isInvalid={isInvalid}
			color={(remoteName === "") ? "default" : (isInvalid ? "danger" : "success")}
			errorMessage="Please enter a valid button name"
			onValueChange={setRemoteName}
			className="max-w-xs"
		/>
	</div>
)

export default ModalAddRemote;