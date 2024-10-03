import React, {useState, useEffect, useRef} from "react";
import { Power, Check, } from "lucide-react";
import {Spinner} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

import config from "../configs/config";
import { wsHandler } from "../services/websocket";

const RemoteButton = (props) => {
	const responseTimeout = 22000;	
	const successAnimationTimeout = 800;
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

	useEffect(() => {
		if (loadingState !== 'success') return;
		setTimeout(() => setLoadingState('idle'), successAnimationTimeout);
	},[loadingState])

	const renderButton = () => {
		switch (loadingState) {
			case 'loading':
				return <Spinner size="md" color="default" />;
			case 'success':				
				return <CheckBoxAnimation durationSeconds={0.8}/>;
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

const CheckBoxAnimation = ({durationSeconds}) => (
	<div className="flex justify-center items-center">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2" className="w-7 h-7"> {/* Tailwind class for width */}
        <polyline
          className="path check"
          fill="none"
          stroke="#22c55e"
          strokeWidth="9"
          strokeLinecap="round"
          strokeMiterlimit="10"
          points="100.2,40.2 51.5,88.8 29.8,67.5"
        />
      </svg>

      <style jsx>{`
        .path {
          	stroke-dasharray: 1000;
        }
        .check {
          	animation: dash-check ${durationSeconds}s ease-in-out forwards; 
			animation-delay: -${durationSeconds / 1.6}s;
        }
        
        @keyframes dash-check {
			0% {
				stroke-dashoffset: 1000;
			}
			100% {
				stroke-dashoffset: 2000;
			}
        }
		@-webkit-keyframes dash-check {
			0% {
				stroke-dashoffset: 1000;
			}
			100% {
				stroke-dashoffset: 2000;
			}
        }
      `}</style>
    </div>
)

export default RemoteButton;
