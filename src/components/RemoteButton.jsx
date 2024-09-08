import React, {useState, useEffect, useRef} from "react";
import { Power, Check, } from "lucide-react";
import {Spinner} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

import config from "../configs/config";
import { wsHandler } from "../services/websocket";

const RemoteButton = (props) => {
	const responseTimeout = 22000;	
	const successAnimationTimeout = 500;
	const wsUrl = config.wssUrl;
	
	const ws_payload = { 
		"action": "cmd",
		"cmd": "execute",
		"remoteName": props.remoteName,
		"buttonName": props.buttonName
	}

	const successResponseFormat = (data)  => {
		const response = JSON.parse(data);
		return (response.action === "ack");
	};

	const {isOpen, onOpen, onOpenChange} = useDisclosure();
	const [loadingState, setLoadingState] = useState('idle');
	const errorMessage = useRef("Unexpected Error Occured.");
	
	const setErrorMessage = (msg) => (errorMessage.current = msg);

	const handlePress = () => {		
		setLoadingState('loading');
		wsHandler(wsUrl, ws_payload, responseTimeout, successResponseFormat, setLoadingState, setErrorMessage);
	}

	useEffect(() => {
		if (loadingState === 'error') {
			setLoadingState('idle');
			onOpen(); // Open the modal when loading is 'error'
		}
	}, [loadingState, onOpen]);

	const renderButton = () => {
		switch (loadingState) {
			case 'loading':
				return <Spinner size="md" color="default" />;
			case 'success':
				// Render animation and then go back to idle
				setTimeout(() => setLoadingState('idle'), successAnimationTimeout);
				return <Check color={"#22c55e"} size={20} strokeWidth={"3px"} />;
			default:
				return <Power onClick={handlePress} color={"#22c55e"} size={17} strokeWidth={"2.5px"} />;
		}
	}

	return (
		<>
			{/* Modal displaying error information */}
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"top"}>
				<ModalContent>
				{(onClose) => (
					<>
					<ModalHeader className="flex flex-col gap-1 mt-2">Error</ModalHeader>
					<ModalBody>
						<p> 
						{errorMessage.current}
						</p>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onPress={onClose}>
						Close
						</Button>
					</ModalFooter>
					</>
				)}
				</ModalContent>
			</Modal>
			<div className={`flex flex-row justify-center items-center cursor-pointer rounded-full w-9 h-9 bg-gray-50 shadow-md mr-2 
							${(loadingState !== 'loading') ?
							"border-2 border-green-500"
							: ""}
							${(loadingState === 'success') ?
							"animate-pop": ""
							}
							`}>
				{
					renderButton()
				}
				
		
			</div> 
		</>
	);
};

export default RemoteButton;
