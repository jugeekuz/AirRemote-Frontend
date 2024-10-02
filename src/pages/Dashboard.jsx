import React, {useEffect} from "react";

import { useLocation, Link } from 'react-router-dom';
import {Tabs, Tab} from "@nextui-org/react"; 
import { MoveRight, DollarSign } from "lucide-react";
import { Divider } from "@nextui-org/react";

import config from "../configs/config";
import ModalError from "../components/ModalError";

import useError from "../hooks/useError";
import useFetchMemo from "../hooks/useFetchMemo";
import { DraggingProvider } from "../contexts/DraggingContext";
import { EditModeProvider } from "../contexts/EditModeContext";
import TopToolbar from '../components/TopToolbar';
import { TileGrid } from "../components/TileGrid";
import TileList from "../components/TileList";
import TileDevice from "../components/TileDevice";
import TileAutomation from "../components/TileAutomation";
import TileRemote from "../components/TileRemote";
const Dashboard = () => {
    const apiUrl = config.apiUrl;
    const attributes = useError("");
    const { data: remoteData, loading: remoteLoading, error: remoteError, refetch: remoteRefetch } = useFetchMemo(`${apiUrl}/remotes`);
    const { data: deviceData, loading: deviceLoading, error: deviceError, refetch: deviceRefetch } = useFetchMemo(`${apiUrl}/devices`);
    const { data: automationData, loading: automationLoading, error: automationError, refetch: automationRefetch} = useFetchMemo(`${apiUrl}/automations`);
    useEffect(() => {
        if (!remoteError) return;
        attributes.setError(remoteError);
      },[remoteError])
    
      useEffect(() => {
        if (!deviceError) return;
        attributes.setError(deviceError);
      },[deviceError])

      useEffect(() => {
        console.log(automationData)
      },[automationData])

      useEffect(() => {
        if (!automationError) return;
        attributes.setError(automationError);
      },[automationError])

      const RemotesGrid = ({ remoteData, length, deviceData }) => (
        <EditModeProvider>
        <DraggingProvider>
          <TileGrid size={length}>
            { 
              remoteData.map((item, index) => {
                const device = deviceData ? deviceData.find((dev) => dev.macAddress == item.macAddress) : null
                const isConnected = device ? (device.connectionId != null) : false
                return <TileRemote isConnected={isConnected} key={index} id={index} item={item} refetch={remoteRefetch}></TileRemote>
              })
            }
          </TileGrid>
          </DraggingProvider> 
          </EditModeProvider>
      )
      const AutomationList = ({length, automationData}) => (
        <EditModeProvider>
		<DraggingProvider>
			<TileList size={length}>
				{ 
				automationData.map((item, index) => <TileAutomation key={index} id={index} item={item} refetch={automationRefetch}/>)
				}
			</TileList>
		</DraggingProvider> 
        </EditModeProvider>
	)
    const DevicesGrid = ({ length, deviceData }) => (
        <EditModeProvider>
        <DraggingProvider>
          <TileGrid size={length}>
            { 
              deviceData.map((device, index) => {
                const isConnected = device ? (device.connectionId != null) : false
                return <TileDevice isConnected={isConnected} key={index} id={index} item={device} refetch={deviceRefetch}/>
              })
            }
          </TileGrid>
        </DraggingProvider> 
        </EditModeProvider>
      )
    return (
        <>
        <div className="w-full overflow-x-hidden overflow-y-scroll">
            <TopToolbar/>
            <div className="flex flex-col w-full h-16 items-start justify-end px-3 pb-1  mt-1">
                <span className="text-2xl font-semibold font-roboto">Hello, Jovana 👋</span>
                <span className="text-xs font-normal text-gray-600 font-poppins ml-[1px]">Welcome to <span className="font-bold text-teal-500">AirRemote</span></span>
            </div>
            <div className="p-1">
                <div className="grid grid-rows-1 grid-cols-3 gap-2">
                    <div className="h-32 bg-gradient-to-l from-orange-600 to-orange-400 shadow-xs shadow-gray-700 border-gray-300 border-1 bg-opacity-70 rounded-xl ">
                        <div className="flex w-full h-full justify-center items-center">
                           
                        </div>
                    </div>
                    <div className="h-32 bg-gradient-to-l from-teal-800 to-teal-500 shadow-xs shadow-gray-700 border-gray-300 border-1 bg-opacity-70 rounded-xl">

                    </div>
                    <div className="h-32 bg-gradient-to-l from-gray-950 to-gray-700 shadow-xs shadow-gray-700 border-gray-300 border-1 bg-opacity-70 rounded-xl">

                    </div>
                </div>
            </div>
            <div className="p-1">
            <Tabs key={"default"} color={"default"} aria-label="Tabs colors" radius="md">
                <Tab key="remotes" title="Remotes">
                {
                    remoteData?
                        <RemotesGrid remoteData={remoteData} length={remoteData.length} deviceData={deviceData}/>            
                    : null
                }
                </Tab>
                <Tab key="automations" title="Automations">
                    {
                        automationData ?
                            <AutomationList automationData={automationData} length={automationData.length}/>
                        : null
                    }
                </Tab>
                <Tab key="devices" title="Devices">
                    {
                        deviceData?
                            <DevicesGrid deviceData={deviceData} length={deviceData.length}/>
                        : null
                    }
                </Tab>
            </Tabs>
            </div>
            
            

           
            
        </div>
        <ModalError {...attributes}/>
        </>);
};

export default Dashboard;
