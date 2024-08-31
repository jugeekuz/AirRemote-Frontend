import { X, Minus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import config from '../configs/config';
import useDelete from '../hooks/useDelete';
const RemoteDeleteButton = ({buttonName, refetch}) => {
	const apiUrl = config.apiUrl;
	const { remoteName } = useParams();

	const { success, loading , error , refetch: deleteRefetch } = useDelete(null);
	const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();

	const onPressYes = () => {
		deleteRefetch(`${apiUrl}/remotes/${remoteName}/buttons/${buttonName}`).then(refetch);
		onClose();
	}
	return (
		<>
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"top"}>
			<ModalContent>
			{(onClose) => (
				<>
				<ModalHeader className="flex flex-col gap-1 mt-2">Confirmation</ModalHeader>
				<ModalBody>
					<p> 
						Are you sure you want to delete this button?
					</p>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onPress={onPressYes}>
					Yes
					</Button>
					<Button color="secondary" onPress={onClose}>
					No
					</Button>
				</ModalFooter>
				</>
			)}
			</ModalContent>
		</Modal>
		<div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 z-50">
			<div onClick={onOpen} className=" flex flex-row justify-center items-center cursor-pointer rounded-full w-6 h-6 bg-gray-300 shadow-sm shadow-gray-500 mr-2 border-1 border-gray-300  opacity-80 backdrop-filter backdrop-blur-md">
				<X color={"#000000"} size={14} strokeWidth={"2.5px"} />
			</div>
		</div>
		</>
	);
};

export default RemoteDeleteButton;
