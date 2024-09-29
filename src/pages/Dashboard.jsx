import React from "react";

import { useLocation, Link } from 'react-router-dom';

import { MoveRight } from "lucide-react";
import { Divider } from "@nextui-org/react";

import TopToolbar from '../components/TopToolbar';
import remoteImg from '../assets/imgs/remote-side.png'
import esp32Img from '../assets/imgs/microcontroller-side-2.png'
const Dashboard = () => {

    const RemoteImg = () => <div 
							className="absolute inset-0 bg-no-repeat bg-cover bg-center -mb-10"
							style={{ backgroundImage: `url(${remoteImg})`,
									backgroundSize: '65%',
									backgroundPosition: 'bottom left'}}
						></div>

    const MicrocontrollerImg = () => <div 
        className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 -mb-8"
        style={{ backgroundImage: `url(${esp32Img})`,
                backgroundSize: '60%',
                backgroundPosition: 'bottom left'}}
    ></div>
    return (
        <div className="w-full overflow-x-hidden overflow-y-scroll">
            <TopToolbar/>
            <div className="flex w-full h-16 items-end justify-start px-3 pb-1  mt-1">
                <span className="text-2xl font-semibold font-roboto">Welcome, Jovana</span>
            </div>

            <div className=" p-2">
                <div className={`relative flex justify-start align-start flex-col w-full  bg-gradient-to-l from-gray-950 to-gray-700 rounded-xl shadow-2xl overflow-hidden 
                    h-[9rem]
                    xl:h-60
                    -mb-1
                    `}>
                        <div className="flex flex-col w-full h-full items-center justify-center p-4">
                            
                            <div className="flex flex-row w-full h-1/3">
                                <div className="flex flex-col w-1/2 ml-6 z-10">
                                    <span className="text-md font-normal text-gray-100">Remotes</span>
                                    <span className="text-xs text-gray-400">Sed ut perspiciatis unde</span>
                                </div>   
                                <div className="flex flex-col w-1/2 items-end justify-center mr-6 z-10">
                                    <span className="text-sm font-normal text-gray-100 text-right">Registered remotes</span>
                                </div>   
                            </div>
                            <div className="flex w-full h-1/3 justify-center items-center">
                                <Divider className="max-w-xs bg-gradient-to-r from-gray-700 to-gray-700 z-10"/>
                            
                            </div>
                            <div className="flex w-full h-1/3"></div>
                        </div>
                        <RemoteImg/>
                </div>
            </div>

            <div className=" p-2">
                <div className={`relative flex justify-center align-center flex-col w-full bg-gradient-to-l from-orange-700 to-orange-500 rounded-xl  shadow-2xl 
                    h-[9rem] overflow-hidden
                    xl:h-60
                    -mb-1
                    `}>
                        <div className="flex flex-col w-full h-full items-center justify-center p-4">
                            
                            <div className="flex flex-row w-full h-1/3">
                                <div className="flex flex-col ml-6">
                                    <span className="text-md font-normal text-gray-100">Remotes</span>
                                    <span className="text-xs text-gray-400">Access </span>
                                </div>   
                            </div>
                            <div className="flex w-full h-1/3 justify-center items-center">
                                <Divider className="max-w-xs bg-gradient-to-r from-orange-500 to-orange-500 z-10"/>
                            
                            </div>
                            <div className="flex w-full h-1/3"></div>
                        </div>
                        <RemoteImg/>
                </div>
            </div>
            <div className=" p-2">
                <div className={`relative flex justify-center align-center flex-col w-full  bg-gradient-to-l from-teal-800 to-teal-600 rounded-xl  shadow-2xl 
                    h-[9rem] overflow-hidden
                    xl:h-60
                    -mb-1
                    `}>
                        <div className="flex flex-col w-full h-full items-center justify-center p-4">
                            
                            <div className="flex flex-row w-full h-1/3">
                                <div className="flex flex-col ml-6">
                                    <span className="text-md font-normal text-gray-100">Remotes</span>
                                    <span className="text-xs text-gray-400">Access </span>
                                </div>   
                                
                            </div>
                            <div className="flex w-full h-1/3 justify-center items-center">
                                <Divider className="max-w-xs bg-gradient-to-r from-teal-700 to-teal-700 z-10"/>
                            
                            </div>
                            <div className="flex w-full h-1/3"></div>
                        </div>
                        <RemoteImg/>
                </div>
            </div>
            
            </div>);
};

export default Dashboard;
