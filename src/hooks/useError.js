import { useState, useEffect } from 'react';
import { useDisclosure } from "@nextui-org/react";
const useError = (err) => {
	const [error, setError] = useState(err || "");
	const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();

	useEffect(() => {
		if (error === "") return;

		onOpen();
	},[error]);

	return { error, setError, isOpen, onOpen, onClose, onOpenChange };
}

export default useError;
