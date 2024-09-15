import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const ModalError = ({ isOpen, onOpenChange, error }) => {
	
	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"top"}>
			<ModalContent>
			{(onClose) => (
				<>
				<ModalHeader className="flex flex-col gap-1 mt-2">Error</ModalHeader>
				<ModalBody>
					<p> 
						{error}
					</p>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onPress={onClose}>
					OK
					</Button>
				</ModalFooter>
				</>
			)}
			</ModalContent>
		</Modal>
	);
};

export default ModalError;
