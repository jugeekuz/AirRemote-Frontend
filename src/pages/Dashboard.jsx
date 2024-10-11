import React, {useEffect, useState} from "react";

import { useLocation, Link } from 'react-router-dom';
import {Tabs, Tab} from "@nextui-org/react"; 
import { MoveRight, BluetoothSearching } from "lucide-react";
import { Divider } from "@nextui-org/react";

import config from "../configs/config";
import ModalError from "../components/ModalError";
import AutomationColor from '../assets/icons/automation-color.svg?react';
import Esp from '../assets/icons/esp.svg?react';
import Money from '../assets/icons/money.svg?react';

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
    const { data: costData, loading: costLoading, error: costError, refetch: costRefetch } = useFetchMemo(`${apiUrl}/costs`);

    const [buttonsClicked, setButtonsClicked] = useState(0);
    const [enabledAutomations, setEnabledAutomations] = useState(0);
    const [cost, setCost] = useState("0.00");
    
    const date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const lastMonthName = monthNames[(date.getMonth() - 1 + 12)%12];
    

    useEffect(() => {
      if (!remoteData || remoteData?.length == 0) return;
      
      const totalCount = remoteData.reduce((acc, item) => acc + parseInt(item?.buttonClicks),0)
      setButtonsClicked(totalCount)
    }, [remoteData])
    
    useEffect(() => {
      if(!automationData || automationData?.length == 0 ) return;

      const totalAutomations = automationData.filter(item => item.automationState === 'ENABLED').length;
      setEnabledAutomations(totalAutomations);
    },[automationData])

    useEffect(() => {
      if(!costData || !costData[0]?.totalCost) return;
      const num = parseFloat(costData[0].totalCost);
      const roundedCost = Math.round(num * 100) / 100;
      
      setCost(roundedCost.toFixed(2));
    },[costData])

    useEffect(() => {
        if (!remoteError) return;
        attributes.setError(remoteError);
    },[remoteError])
    
    useEffect(() => {
      if (!deviceError) return;
      attributes.setError(deviceError);
    },[deviceError])

    useEffect(() => {
      if (!automationError) return;
      attributes.setError(automationError);
    },[automationError])

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
        <div className="px-2 sm:px-0 w-full overflow-x-hidden overflow-y-scroll">
            <TopToolbar/>
            <div className="flex flex-col w-full h-16 items-start justify-end px-3 pb-1  mt-1">
                <span className="text-2xl font-semibold font-roboto">Hello, Jovana 👋</span>
                <span className="text-xs font-normal text-gray-600 font-poppins ml-[1px]">Welcome to <span className="font-bold text-teal-500">AirRemote</span></span>
            </div>

            {/* Top Statistics Tile  */}
            <div className="p-1">
                <div className="grid grid-rows-1 grid-cols-3 gap-1 max-w-5xl">
                    {/* Tile Monthly Cost */}
                    <div className="flex flex-col justify-between h-32 bg-gradient-to-l from-orange-600 to-orange-400 shadow-xs shadow-gray-700 border-gray-300 border-1 bg-opacity-70 rounded-xl p-1 py-2">
                        <div className="flex flex-col w-full justify-center items-center text-center">
                          <span className="text-sm font-normal text-gray-100 font-roboto">Money spent</span>

                        </div>
                        <div className="flex w-full justify-center items-center text-center">
                           <span className="font-medium text-xl text-white ">{cost} $</span>
                        </div>
                        <div className="flex w-full justify-center items-center text-center">
                        <span className="text-sm font-normal text-gray-100 font-roboto">Cost <span className="font-semibold text-white">{lastMonthName}</span></span>
                        </div>
                    </div>

                    {/* Tile Monthly Button Clicks */}
                    <div className="flex flex-col justify-between h-32 bg-gradient-to-l from-teal-800 to-teal-500 shadow-xs shadow-gray-700 border-gray-300 border-1 bg-opacity-70 rounded-xl p-1 py-2">
                        <div className="flex flex-row w-full justify-center items-center">
                          <span className="text-sm font-normal text-gray-100 font-roboto">Button Clicks</span>
                      
                        </div>
                        <div className="flex w-full justify-center items-center">
                           <span className="font-medium text-xl text-white">{buttonsClicked} <span className="font-normal text-medium text-gray-200">btns</span></span>
                        </div>
                        <div className="flex w-full justify-center text-center items-center">
                          <span className="text-sm font-normal text-gray-100 font-roboto">Total <span className="font-semibold text-gray-50">Clicked</span> </span>
                        </div>
                    </div>

                    {/* Tile Running Automations */}
                    <div className="flex flex-col justify-between h-32 bg-gradient-to-l from-gray-950 to-gray-700 shadow-xs shadow-gray-700 border-gray-300 border-1 bg-opacity-70 rounded-xl p-1 py-2">
                      <div className="flex flex-row w-full justify-center items-center">
                      <span className="text-sm font-normal text-gray-100 font-roboto">Automations </span>
                        
                      </div>
                      <div className="flex flex-row w-full justify-center items-center">
                        <span className="font-medium text-xl text-white ">{enabledAutomations}</span>

                      </div>
                      <div className="flex w-full justify-center text-center items-center">
                        <span className="text-sm font-normal text-white text-font-roboto"><span className="font-bold text-white">Enabled</span> Now</span>
                      </div>
                    </div>

                </div>
            </div>

            {/* Items */}
            <div className="">
              <Tabs key={"default"} color={"default"} aria-label="Tabs colors" radius="sm" variant="solid" className="ml-1 mt-2 -mb-2">
                  <Tab key="remotes" title="Remotes">
                  {
                      remoteData && remoteData?.length > 0?
                          <RemotesGrid remoteData={remoteData} length={remoteData.length} deviceData={deviceData}/>            
                      : null
                  }
                  </Tab>
                  <Tab key="automations" title="Automations">
                      {
                          automationData && automationData?.length > 0 ?
                              <AutomationList automationData={automationData} length={automationData.length}/>
                          : null
                      }
                  </Tab>
                  <Tab key="devices" title="Devices">
                      {
                          deviceData && deviceData?.length > 0 ?
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
