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

export const  ModalAddUser = ({toggleOpen, setToggleOpen}) => {
	const authUrl = config.authUrl;
	const { postItem, success: userAddSuccess, error: userAddError, data: userAddData } = usePost(`${authUrl}/registeruser`);
    
	const [userEmail, setUserEmail] = useState("");	

	const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
	
	const attributes = useError("");
	const {error, setError} = attributes;
	
	const isInvalid = useMemo(() => {
		if (userEmail === "") return false; 

		const regex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

		return regex.test(userEmail) ? false : true;
	}, [userEmail]);

	useEffect(() => {
		if (!userAddError) return;
		attributes.setError(userAddError);
	  },[userAddError])

	useEffect(() => {
		onClose();
	},[error])

	// Restart the steps of the modal if the user closes it
	useEffect(()=>{
		if (isOpen) return;
		setUserEmail("");
		setToggleOpen(false);
	},[isOpen])

	useEffect(() => {
		onClose();
		setUserEmail("");
	},[userAddSuccess])

	useEffect(() => {
		if (toggleOpen) onOpen();
	},[toggleOpen])
	
	const addUser = () => {
		if (userEmail === "") return;
		const item = {
			"userEmail": userEmail
		}
		postItem(item);
		onClose();
	}

	return (
		<>		
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"top-center"}>
		<ModalContent>
		{(onClose) => (
			<>
			<ModalHeader>
				Add new user
			</ModalHeader>
			<ModalBody className="">
                <div className="-mt-1 -mb-1">
                    
					<div className="flex flex-col justify-start w-full mb-3">
						<span className="font-normal text-foreground-500">Provide permission to user to access the app</span>
					</div>
                    <Input
                        type="userEmail"
                        label="User's Email"
                        variant="bordered"
                        isInvalid={isInvalid}
                        color={(userEmail === "") ? "default" : (isInvalid ? "danger" : "success")}
                        errorMessage="Please enter a valid user email"
                        onValueChange={setUserEmail}
                        className="max-w-xs"
                    />
                </div>
			</ModalBody>
			<ModalFooter>
				<Button color="danger" variant="light" onPress={onClose}>
                    Close
                </Button>
                <Button color="primary" onPress={addUser}>
                    Add User
                </Button>
			</ModalFooter>
			</>
			
		)}
		</ModalContent>
		</Modal>
		<ModalError {...attributes}/>
		</>
	);

}

export default ModalAddUser;