import React from "react";
import {Plus} from "lucide-react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const AddBorderButton = (props) => {
	const {isOpen, onOpen, onOpenChange} = useDisclosure();
	return (
		<>
		<button onClick={onOpen} className="rounded-xl border-medium border-dashed border-green-600 col-span-full w-full h-14">
			<div className="flex justify-center items-center">
				<Plus size={20} color="#16a34a" stroke="#16a34a"/>
				<span className="font-sans font-normal ml-1 text-green-600">
					Add New Button
				</span>
			</div>
		</button>
		 
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
			{(onClose) => (
				<>
				<ModalHeader className="flex flex-col gap-1 mt-2">Add New Button</ModalHeader>
				<ModalBody>
					<p> 
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Nullam pulvinar risus non risus hendrerit venenatis.
					Pellentesque sit amet hendrerit risus, sed porttitor quam.
					</p>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" variant="light" onPress={onClose}>
					Close
					</Button>
					<Button color="primary" onPress={onClose}>
					Action
					</Button>
				</ModalFooter>
				</>
			)}
			</ModalContent>
		</Modal>
		</>
	)
}

export default AddBorderButton;