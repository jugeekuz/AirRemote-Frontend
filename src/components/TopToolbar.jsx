import React, {useState} from "react";
import { ArrowLeft, Settings, LogOut, UserPlus } from "lucide-react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Avatar} from "@nextui-org/react";
import UserLogo from '../assets/icons/avatar.svg?react';
import AppLogo from '../assets/icons/airremote-logo-short.svg?react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from "../services/authenticate";
import { useAuth } from "../contexts/AuthContext";
import logoImg from '../assets/imgs/logo.png'
import ModalAddUser from "./ModalAddUser";
const TopToolbar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { setToken } = useAuth();
	const isNested = location.pathname.split('/').filter(Boolean).length > 1;
	const [toggleOpen, setToggleOpen] = useState(false);
	return (
		<div className="flex justify-between items-center h-16 w-full p-3">
			{ isNested?
				<div onClick={()=>navigate(-1)} className="flex justify-center items-center w-8 h-8 rounded-md bg-gray-50 cursor-pointer"><ArrowLeft /></div> 
				:
				<AppLogo
				className="w-10 h-10 cursor-pointer"
				onClick={()=>navigate('/')}
				/>
			}
			
			<div className="flex items-center">
				{/* <div className="flex w-8 h-8 items-center justify-center mx-2 rounded-full ">
					<Settings size={20}/>
				</div> */}
				<Dropdown>
					<DropdownTrigger>
						<Button 
							isIconOnly 
							className="bg-transparent w-7"
						>
							<UserLogo className="w-8 h-8"/>
						</Button>
						
					</DropdownTrigger>
					<DropdownMenu aria-label="Dynamic Actions">
						<DropdownItem
							key="invite"
							startContent={<UserPlus size={18}/>}
							onClick={() => {
								setToggleOpen(!toggleOpen);
							}}
						>
							Invite a friend
						</DropdownItem>
						<DropdownItem
							key="logout"
							className="text-danger"
							color="danger"
							onClick={() => {
								logout();
								setToken(null);
							}}
							startContent={<LogOut size={18}/>}
						>
							Logout
						</DropdownItem>
						
					</DropdownMenu>
				</Dropdown>
				<ModalAddUser toggleOpen={toggleOpen}/>
			</div>
		</div>
	)	
};

export default TopToolbar;
