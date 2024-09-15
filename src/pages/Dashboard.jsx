import React from "react";

import { useLocation, Link } from 'react-router-dom';

import { MoveRight } from "lucide-react";

import TopToolbar from '../components/TopToolbar';

const Dashboard = () => {
  return (
    <div className="w-full overflow-x-hidden overflow-y-scroll">
        <TopToolbar/>
        <div className="flex w-full h-16 items-end justify-start px-3 pb-1 mb-2 mt-1">
            <span className="text-2xl font-semibold">Welcome, Jovana</span>
        </div>

        <div className=" p-1">
            <div className={`flex justify-start align-start flex-col w-full bg-[#006466]    rounded-md p-4 shadow-2xl 
                h-[9rem]
                xl:h-60
                -mb-1
                `}>
                    <div className="flex flex-row w-full h-1/2 justify-start p-1">
                        <div className="flex h-full">
                            <span className="text-xl font-medium text-white">Remotes</span>
                        </div>
                        
                    </div>
                    <div className="flex w-full h-1/2 justify-end">
                        <div className="flex h-full items-end">
                            <Link to={"/remotes"}>
                                <MoveRight size={"30px"} color="#ffffff" />
                            </Link>
                        </div>
                    </div>

            </div>
        </div>

        <div className=" p-1">
            <div className={`flex justify-center align-center flex-col w-full bg-[#006466] rounded-md p-4 shadow-2xl 
                h-[9rem]
                xl:h-60
                -mb-1
                `}>
                    <div className="flex flex-row w-full h-1/2 justify-start p-1">
                        <div className="flex h-full">
                            <span className="text-xl font-medium text-white">Devices</span>
                        </div>
                        
                    </div>
                    <div className="flex w-full h-1/2 justify-end">
                        <div className="flex h-full items-end">
                            <Link to={"/devices"}>
                                <MoveRight size={"30px"} color="#ffffff" />
                            </Link>
                        </div>
                    </div>
            </div>
        </div>
        <div className=" p-1">
            <div className={`flex justify-center align-center flex-col w-full bg-[#006466] rounded-md p-4 shadow-2xl 
                h-[9rem]
                xl:h-60
                -mb-1
                `}>
                    <div className="flex flex-row w-full h-1/2 justify-start p-1">
                        <div className="flex h-full">
                            <span className="text-xl font-medium text-white">Automations</span>
                        </div>
                        
                    </div>
                    <div className="flex w-full h-1/2 justify-end">
                        <div className="flex h-full items-end">
                            <Link to={"/automations"}>
                                <MoveRight size={"30px"} color="#ffffff" />
                            </Link>
                        </div>
                    </div>
            </div>
            
        </div>
        
        </div>);
};

export default Dashboard;
