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
	Snippet,
	Input,	
} from "@nextui-org/react";

import { useParams } from "react-router-dom"

import useError from "../hooks/useError";
import usePost from "../hooks/usePost";
import useFetchMemo from "../hooks/useFetchMemo";

import ModalError from "./ModalError";
import config from "../configs/config";

export const ModalAddDevice = ({deviceData, onAddDevice}) => {
	const apiUrl = config.apiUrl;
	const wssHost = (import.meta.env.VITE_WSS_URL).replace(/^wss:\/\//, '');
	const wssUrl = `${import.meta.env.VITE_STAGE}/`;
	const { data: tokenData , loading: tokenLoading , error: tokenError, refetch: tokenRefetch } = useFetchMemo(`${apiUrl}/deviceToken`);
	const { postItem, success, error: deviceError, data } = usePost(`${apiUrl}/devices`);
	const deviceToken = tokenData?.deviceToken || null;

	const [modalState, setModalState] = useState(1);
	const [deviceName, setDeviceName] = useState("");	

	const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
	
	const attributes = useError("");
	const {error, setError} = attributes;
	const timeoutRef = useRef(null);
	
	const isInvalid = useMemo(() => {
		if (deviceName === "") return false; 

		const regex = /^[a-zA-Z0-9- ]+$/;

		return regex.test(deviceName) ? false : true;
	}, [deviceName]);

	useEffect(() => {
		onClose();
		setModalState(1);
	},[error])

	// Restart the steps of the modal if the user closes it
	useEffect(()=>{
		if (modalState > 4 || isOpen) return;
		
		tokenRefetch();
		setDeviceName("");
		setModalState(1);
	},[isOpen])

	const stepsMapping = {
		1: <Step1 />,
		2: <Step2 isInvalid={isInvalid} deviceName={deviceName} setDeviceName={setDeviceName}/>,
		3: <Step3 wssHost={wssHost} wssUrl={wssUrl} authKey={deviceToken || "Error Loading Token"}/>
	}
	const incrStep = () => {
		if (modalState === 2 && (isInvalid || deviceName === "")) return;
		setModalState(modalState+1);
	}	

	const createDevice = () => {
		if (!deviceName || !deviceToken) {
			setError("Device name and token can't be empty.");
			return;
		};

		const payload = {
			deviceName: deviceName,
			token: deviceToken
		}

		postItem(payload)
		.then(() => {
			onAddDevice();
			onClose();
		})

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
				Add device
			</ModalHeader>
			<ModalBody className="">
				{stepsMapping[modalState]}
			</ModalBody>
			<ModalFooter>
			{modalState < 3?
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
				<Button color="primary" onPress={createDevice}>
					Finish
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
	<div className="w-full -mt-1">
		<div className="-mt-1 -mb-1">
			<span className="font-medium mb-2">Steps to connecting your device</span>
		<ol className="list-decimal ml-6 mt-1 mb-2">
			<li><span className="font-medium">Prepare the Device: </span>If your device is not brand new, press the reset button to put it in reset mode. The device's light will blink continuously when it's ready.</li>
			<li><span className="font-medium">Connect to WiFi: </span>The device will act as a temporary WiFi hotspot (web server). Connect to its WiFi network, named AirRemote.</li>
			<li><span className="font-medium">Enter Device Credentials: </span>A setup page (captive portal) will open automatically. If it doesn't appear on Apple devices, open a browser and go to captive.apple.com.</li>
			<li><span className="font-medium">Save Your Authentication Key & Endpoints: </span>During setup, you'll receive a unique authentication key. Make sure to copy it, as you'll need to enter it later.</li>
		</ol>
		</div>
	</div>
)

const Step2 = ({isInvalid, deviceName, setDeviceName}) => (
	<div className="-mt-1 -mb-1">
		<div className="flex mb-3">Select a name for the new device</div>
		<Input
			type="deviceName"
			label="Device Name"
			variant="bordered"
			isInvalid={isInvalid}
			color={(deviceName === "") ? "default" : (isInvalid ? "danger" : "success")}
			errorMessage="Please enter a valid device name"
			onValueChange={setDeviceName}
			className="max-w-xs"
		/>
	</div>
)

const Step3 = ({authKey, wssHost, wssUrl}) => {
	
	return(
	<div className="-mt-1 -mb-1 max-w-lg">
		<div className="flex mb-3">Copy the credentials below and save them somewhere safe, as you'll need to provide them when setting up the device.</div>
		<div className="flex mb-1"><span className="font-medium">WSS Host</span></div>
		<Snippet size="lg" symbol="" color="default" className="text-xs min-w-full text-wrap">
		{wssHost}
		</Snippet>
		<div className="flex mb-1"><span className="font-medium">WSS URL</span></div>
		<Snippet size="lg" symbol="" color="default" className="text-xs">{wssUrl}</Snippet>
		<div className="flex mb-1"><span className="font-medium">Authentication key</span></div>
		<Snippet size="lg" symbol="" color="default" className="text-xs min-w-full">{authKey}</Snippet>
		<div className="flex mt-3 mb-3">Follow the instructions previously mentioned to finish setting up the device</div>

	</div>
	)
}

export default ModalAddDevice;