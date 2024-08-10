import React, {useState, useEffect} from "react";
import { Power } from "lucide-react";
import {Spinner} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const RemoteButton = () => {
	const [loading, setLoading] = useState('idle');
	const {isOpen, onOpen, onOpenChange} = useDisclosure();

	const load = () => {
		setLoading('error'); // Set loading to 'error' for demonstration
	};

	// Effect to handle the 'error' case and open the modal
	useEffect(() => {
		if (loading === 'error') {
			onOpen(); // Open the modal when loading is 'error'
		}
	}, [loading, onOpen]);

	const renderButton = () => {
		switch (loading) {
			case 'idle':
				return <Power onClick={load} color={"#22c55e"} size={17} strokeWidth={"2.5px"} />;
			case 'loading':
				return <Spinner size="md" color="default" />;
			case 'success':
				return <div className="absolute w-7 h-7 border-5 border-green-500 rounded-full animate-custom-ping"></div>;
		}
	}

	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"top"}>
				<ModalContent>
				{(onClose) => (
					<>
					<ModalHeader className="flex flex-col gap-1 mt-2">Error</ModalHeader>
					<ModalBody>
						<p> 
						Unexpected error occured! Please try again later.
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
							${(loading == 'idle') ?
							"border-2 border-green-500"
							: ""}`}>
				{
					renderButton()
				}
				
		
			</div> 
		</>
	);
};

export default RemoteButton;
