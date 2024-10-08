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
	TimeInput,
	Divider,
	RadioGroup,
	Radio,
	DatePicker,
	Input
} from "@nextui-org/react";

import {now, getLocalTimeZone, Time, parseAbsoluteToLocal} from "@internationalized/date";

import useError from "../hooks/useError";
import useFetchMemo from "../hooks/useFetchMemo";
import usePost from "../hooks/usePost";

import ModalError from "./ModalError";
import config from "../configs/config";

export const ModalAddAutomation = ({onAddAutomation}) => {
	const apiUrl = config.apiUrl;
	const attributes = useError("");
	const { data: remoteData, loading: remoteLoading, error: remoteError, refetch: remoteRefetch } = useFetchMemo(`${apiUrl}/remotes`);
	const { postItem, success, error: automationsError, data } = usePost(`${apiUrl}/automations`);
	
	const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();

	const [modalState, setModalState] = useState(1);
	const [automationName, setAutomationName] = useState("");	
	const [buttonsSelected, setButtonsSelected] = useState([]);
	const [cronJob, setCronJob] = useState("")
	const {error, setError} = attributes;
	
	const isInvalid = useMemo(() => {
		if (automationName === "") return false; 

		const regex = /^[a-zA-Z0-9- ]+$/;

		return regex.test(automationName) ? false : true;
	}, [automationName]);

	// Reset Modal on error
	useEffect(() => {
		onClose();
		setModalState(1);
	},[error])

	const resetModal = () => {

		setCronJob("");
		setButtonsSelected([]);
		setAutomationName("");
		setModalState(1);
		onClose();
	}

	// Restart the steps of the modal if the user closes it
	useEffect(()=>{
		if (modalState > 4 || isOpen) return;
		
		resetModal();
	},[isOpen])

	const stepsMapping = {
		1: <InstructionsStep />,
		2: <AutomationNameStep isInvalid={isInvalid} automationName={automationName} setAutomationName={setAutomationName}/>,
		3: <ButtonSelectionStep buttonsSelected={buttonsSelected} setButtonsSelected={setButtonsSelected} remoteData={remoteData}/>,
		4: <ScheduleSelectionStep setCronJob={setCronJob} />,
	}
	const incrStep = () => {
		if (modalState === 2 && automationName === "") return;
		if (modalState === 3 && buttonsSelected.length === 0) return;
		setModalState(modalState+1);
	}

	const createAutomation = () => {
		if (modalState !== 4) return;

		const cronArgs = cronJob.split(" ")

		const payload = {
			"cronExpression": `cron(${cronJob})`,
			"automationName": automationName,
			"buttonsList": buttonsSelected,
			"automationMinutes": cronArgs[0],
			"automationHour": cronArgs[1],
			"automationDays": cronArgs[4]
		}
		postItem(payload)
		.then(() => {
			onAddAutomation();
		});
		resetModal();
	}

	useEffect(() => {
		if (!automationsError) return;
		attributes.setError(data);
	},[automationsError] )
	
	useEffect(() => {
		if (!remoteError) return;
		attributes.setError(remoteError);
	},[remoteError] )

	return (
		<>
		<CircleFadingPlus onClick={onOpen} size={19} strokeWidth={"2px"} color="black" className="cursor-pointer"/>
		
		{/* Add Button Modal */}
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"top-center"}>
		<ModalContent>
		{(onClose) => (
			<>
			<ModalHeader>
				Add Automation
			</ModalHeader>
			<ModalBody className="">
				{stepsMapping[modalState]}
			</ModalBody>
			<ModalFooter>
				{(modalState < 4) ?
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
					<Button color="primary" onPress={createAutomation}>
						Create
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

// Step 1
const InstructionsStep = () => (
	<div className="-mt-1 -mb-1">
		<div className="mb-1">Automations are a series of remote control commands, on potentially multiple devices, that can run repeatedly or once at specific points of time.</div> 
		<div className="flex items-center justify-center w-full"><Divider className="w-3/4"></Divider></div>
		<div className="mt-2 ">To create an automation you will:
		<ul className="list-disc ml-6 mt-1 mb-2">
			<li>Select the remote buttons in the series you wish to be executed</li>
			<li>Select if you want the automation to run once or repeatedly</li>
			<li>Select either the days of the week, or exact date and time </li>
		</ul>
		</div>
		
	</div>
)

// Step 2
const AutomationNameStep = ({isInvalid, automationName, setAutomationName}) => (
	<div className="flex flex-col -mt-1 -mb-1">
		<div className="flex mb-3"><span className="text-foreground-500">Select a name for the new automation</span></div>
		<Input
			type="automationName"
			label="Automation Name"
			variant="bordered"
			isInvalid={isInvalid}
			color={(automationName === "") ? "default" : (isInvalid ? "danger" : "success")}
			errorMessage="Please enter a valid automation name"
			onValueChange={setAutomationName}
			className="max-w-xs"
		/>
	</div>
)

// Step 3
const ButtonSelectionStep = ({remoteData, buttonsSelected, setButtonsSelected}) => {
	
	const filteredRemotes = remoteData.filter(item => item.buttons.length > 0) || ["UNDEFINED"];
	const [runningRemote, setRunningRemote] = useState(null);
	
	const addButton = (buttonName) => {		
		const newItem = {
			"remoteName": runningRemote.remoteName,
			"buttonName": buttonName
		}
		setButtonsSelected([...buttonsSelected, newItem]);
		setRunningRemote(null);
	}

	// Those are in a different component so that if the props change -> whole component renders
	// Otherwise there is a bug since `Select` doesn't render - but `SelectItem`s do 
	const RemoteSelection = ({filteredRemotes, callback}) => {
		return <Select
			label="Remote Name"
			placeholder="Select remote"
			className="w-full mt-2"
			selectionMode="single"
			onChange={callback}
			remotes={filteredRemotes.length}
		>	
			
			{ 	filteredRemotes && filteredRemotes.length > 0 ?
				
				filteredRemotes.map((item, index) => (
					<SelectItem key={item.remoteName}>{item.remoteName}</SelectItem>
				))
				: <SelectItem key={1}>No remotes available</SelectItem>
			}
		</Select>
	}

	const ButtonSelection = ({runningRemote, callback}) => (
		<Select
		label="Button Name"
		placeholder="Select button"
		className="w-full mt-2"
		selectionMode="single"
		onChange={callback}
	>	
		{	runningRemote?.buttons ?
			runningRemote.buttons.map((item, index) => (
				<SelectItem key={item.buttonName}>{item.buttonName}</SelectItem>
			)
			)
			: <SelectItem key={1}>No remotes available</SelectItem>
		}
	</Select>
	)

	return (
	<div className="w-full -mt-2">
		<div className="flex flex-col w-full h-full -mt-1 -mb-1">
			<div className="mt-2 mb-4">
				{buttonsSelected.length > 0 ?
				<>
				<span className=" ml-1 mb-2 text-medium font-medium text-green-500">Selected buttons</span>
				<div className="grid grid-rows-1 grid-cols-3 gap-3 border-2 border-green-400 rounded-xl p-2 shadow-md">
					{
						buttonsSelected.map((item, index) => (
							<div className="max-w-[10rem] h-14  bg-gray-100 rounded-xl bg-opacity-85 p-1">
								<div className="flex w-full h-1/5 mt-1 ml-1"><span className="text-xs text-gray-500">{item?.remoteName}</span></div>						
								<div className="flex w-full h-3/5 justify-start items-end ml-1"><span className="text-sm font-semibold text-gray-600">{item?.buttonName}</span></div>
							</div>
						))
					}
				</div>
				</>
				: <></>	
				}
				<div className="flex flex-col">
				{ buttonsSelected.length === 0 ?
					<span className="text-foreground-500">Select the buttons in the order you want them to be executed: </span>
					:
					<div className="mt-4"><span className="text-foreground-500">{runningRemote === null ? "Select the remote: " :"Select the next button: "}</span></div>
				}
				{	remoteData &&
					runningRemote === null ?
						<RemoteSelection filteredRemotes={filteredRemotes} callback={
							(e) => {
								const remote = filteredRemotes.find(obj => obj.remoteName === e.target.value);
								setRunningRemote(remote);
						}}/>
					:
						<ButtonSelection runningRemote={runningRemote} callback={(e) => addButton(e.target.value)}/>
				}
				</div>
				
			</div>
		</div>
	</div>
)}


const ScheduleSelectionStep = ({setCronJob}) => {
	const [timeNow, setTimeNow] = useState(parseAbsoluteToLocal("2024-04-08T21:00:00Z"));
	const [selectedDays, setSelectedDays] = useState(new Set([]));

	const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const createCronJob = () => {
		
		const utcTime = new Date();
		utcTime.setHours(parseInt(timeNow.hour, 10));
		utcTime.setMinutes(parseInt(timeNow.minute, 10));
		utcTime.setSeconds(0);
		utcTime.setMilliseconds(0);
		
		const days = Array.from(selectedDays);
		days.sort((a, b) => a - b);
		const timeDiff = utcTime.getUTCHours() - utcTime.getHours();
	
		let cronDays;
		if (utcTime.getTimezoneOffset() > 0 && timeDiff < 0) {
			cronDays = days
			.map(
				day => (parseInt(day)+1)%7 + 1
			)
			.sort((a, b) => a - b)
			.join(',');
		} else if (utcTime.getTimezoneOffset() < 0 && timeDiff > 0) {
			cronDays = days.map(
				day => (parseInt(day)+1)
			)
			.map(
				day => ((day == 1) ? 7 : (day-1))
			)
			.sort((a, b) => a - b)
			.join(',');

		} else {
			cronDays = days.map(day => (parseInt(day)+1)).join(',');
		}
		

		
		
		const utcHours = utcTime.getUTCHours().toString();
		const utcMinutes = utcTime.getUTCMinutes().toString();

		return `${utcMinutes} ${utcHours} ? * ${cronDays} *`;
	}

	useEffect(() => {
		setCronJob(createCronJob())
	},[timeNow, selectedDays])

	return (
		<div className="w-full -mt-1">
			<div className="flex flex-col w-full h-full -mt-1 -mb-1">
				<div className="mt-2 mb-4">
					<span className=" text-foreground-500 ">Select the days the automation will run :</span>
					<Select
						label="Event days"
						selectionMode="multiple"
						placeholder="Select automation days"
						className="max-w-xs mt-2"
						onSelectionChange={setSelectedDays}
					>
						{ weekDays.map((item,index) => (
							<SelectItem key={index}>{item}</SelectItem>
						))
						}
					</Select>
				</div>
				<Divider className="max-w-xs"></Divider>
				<div className="mt-3">
					<span className="text-foreground-500 mt-2">Select the hour the automation will run :</span>

					<TimeInput className="max-w-xs mt-2" label="Event Time" value={timeNow} onChange={setTimeNow} />
				</div>
			</div>
		</div>)}


// Step 4
// const ScheduleSelectionStep = () => {
// 	const [selected, setSelected] = useState("default");
// 	const [timeNow, setTimeNow] = useState(parseAbsoluteToLocal("2024-04-08T21:00:00Z"));
// 	const [selectedDays, setSelectedDays] = useState(new Set([]));

// 	const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
// 	const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// 	const createCronJob = () => {
// 		const days = Array.from(selectedDays);
// 		days.sort((a, b) => a - b);
// 		const cronDays = days.map(day => (day === 7 ? 0 : day)).join(',');
		
// 		const utcTime = new Date();
// 		utcTime.setHours(parseInt(timeNow.hour, 10));
// 		utcTime.setMinutes(parseInt(timeNow.minute, 10));
// 		utcTime.setSeconds(0);
// 		utcTime.setMilliseconds(0);

// 		const utcHours = utcTime.getUTCHours().toString().padStart(2, '0');
//       	const utcMinutes = utcTime.getUTCMinutes().toString().padStart(2, '0');

// 		return `${utcMinutes} ${utcHours} * * ${cronDays}`;
// 	}

// 	useEffect(() => {
// 		console.log(createCronJob())
// 	},[timeNow, selectedDays])
// 	const renderContent = () => {
// 		switch (selected) {
// 			case "recurring":
// 				return (
// 					<>
// 					<div className="mt-2 mb-4">
// 						<span className=" text-foreground-500 ">Select the days the automation will run :</span>
// 						<Select
// 							label="Event days"
// 							selectionMode="multiple"
// 							placeholder="Select automation days"
// 							className="max-w-xs mt-2"
// 							onSelectionChange={setSelectedDays}
// 						>
// 							{ weekDays.map((item,index) => (
// 								<SelectItem key={index}>{item}</SelectItem>
// 							))
// 							}
// 						</Select>
// 					</div>
// 					<Divider className="max-w-xs"></Divider>
// 					<div className="mt-3">
// 						<span className="text-foreground-500 mt-2">Select the hour the automation will run :</span>

// 						<TimeInput className="max-w-xs mt-2" label="Event Time" value={timeNow} onChange={setTimeNow} />
// 					</div>
// 					</>
// 				);
// 			case "once":
// 				return (
// 					<div className="w-full max-w-xl flex flex-col items-start gap-4">
// 						<DatePicker
// 							label="Event Date"
// 							variant="bordered"
// 							hideTimeZone
// 							showMonthAndYearPickers
// 							defaultValue={now(getLocalTimeZone())}
// 						/>
// 					</div>
// 				);
// 			default :
// 				return (<RadioGroup
// 					label="Select the type of automation"
// 					value={selected}
// 					onValueChange={setSelected}
// 				>
// 					<Radio value="once" description="This automation will run only once at specific date">Once</Radio>
// 					<Radio value="recurring" description="This automation will run every day you specify">Recurring</Radio>
// 				</RadioGroup>);
// 		}
// 	}


// 	return (
// 		<div className="w-full -mt-1">
// 			<div className="flex flex-col w-full h-full -mt-1 -mb-1">
// 				{renderContent()}
// 			</div>
// 		</div>)}




export default ModalAddAutomation;