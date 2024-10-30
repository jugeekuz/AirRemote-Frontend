import { useEffect } from 'react';
import { X, Minus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

import useDelete from '../hooks/useDelete';
import useError from '../hooks/useError';

import ModalError from './ModalError';
const TileDelete = ({url, refetch, position}) => {
	const { remoteName } = useParams();
	const attributes = useError("");

	const { success, loading , error , refetch: deleteRefetch } = useDelete(url);
	const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();

	const onPressYes = () => {
		deleteRefetch().then(refetch);
		onClose();
	}

	useEffect(() => {
		if (!error) return;
		attributes.setError(error);
	  },[error])	

	return (
		<>
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"top"}>
			<ModalContent>
			{(onClose) => (
				<>
				<ModalHeader className="flex flex-col gap-1 mt-2">Confirmation</ModalHeader>
				<ModalBody>
					<p> 
						Are you sure you want to delete this item?
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
		<div className={`absolute z-[200] top-0 transform -translate-y-1/2 ${position == 'left' ? "-translate-x-1/4 left-0" :"translate-x-1/2 right-0"} `}>
			<div onClick={onOpen} className=" flex flex-row justify-center items-center cursor-pointer rounded-full w-6 h-6 bg-gray-300 shadow-sm shadow-gray-500 mr-2 border-1 border-gray-300  opacity-80 backdrop-filter backdrop-blur-md">
				<X color={"#000000"} size={14} strokeWidth={"2.5px"} />
			</div>
		</div>
		<ModalError {...attributes}/>
		</>
	);
};

export default TileDelete;
