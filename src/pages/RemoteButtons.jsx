import React, { useRef, useEffect, useState, createContext } from "react";

import { useParams } from "react-router-dom"
import { Pencil } from "lucide-react";

import config from "../configs/config";
import useFetchMemo from "../hooks/useFetchMemo";

import { EditModeProvider } from "../contexts/EditModeContext";
import { DraggingContext, DraggingProvider } from "../contexts/DraggingContext";

import TopToolbar from '../components/TopToolbar';
import InfoBar from '../components/InfoBar';
import { Toolbar } from "../components/Toolbar";
import { TileGrid } from '../components/TileGrid';
import { ButtonTile } from '../components/ButtonTile';


const RemoteButtons = () => {
	const apiUrl = config.apiUrl;
	const { remoteName } = useParams();

	const macAddress = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: remoteData, loading, error, refetch: remoteRefetch } = useFetchMemo(`${apiUrl}/remotes/${remoteName}`);
  const { data: deviceData, loading: deviceLoading, error: deviceError, refetch: deviceRefetch } = useFetchMemo(macAddress.current ? `${apiUrl}/devices/${macAddress.current}` : null);

  useEffect(() => {
		if (!remoteData?.macAddress) return;
    macAddress.current = remoteData.macAddress;
    deviceRefetch();
  }, [remoteData]);

  useEffect(() => {
		if (!deviceData?.connectionId) return;
    setIsConnected(deviceData?.connectionId ? true : false);
  }, [deviceData])

  return (
        <div className="w-full overflow-x-hidden overflow-y-scroll">

          {/* Top Toolbar */}
          <TopToolbar/>
          <EditModeProvider>
          
            {/* Info Bar */}
            <InfoBar 
              macAddress={deviceData?.macAddress ? deviceData?.macAddress : "Loading.."} 
              remoteName={remoteName}
              deviceName={deviceData?.deviceName ? deviceData?.deviceName : "Loading.."}
              isConnected={isConnected}
            />

            {/* Secondary Toolbar */}
            <div className="flex justify-between items-center flex-row mt-6 mb-3 ml-2">
              <div className="flex items-center">
                <span className="font-sans font-medium text-xl">
                  Remote Buttons
                </span>
                <div className="flex justify-center items-center ml-2 rounded-lg w-6 h-6 bg-green-600">
                  <span className="font-sans text-center text-white text-xs" >
                    {/* Buttons Count */}
                    {remoteData?.buttons && remoteData.buttons.length}
                  </span>
                </div>
              </div>
              <div className="pr-3">
                <Toolbar onAddButton={remoteRefetch}/>
              </div>
            </div>

            {/* Buttons Grid */}
            {remoteData && remoteData?.buttons 
              ?
              <DraggingProvider>
                <TileGrid>
                  {/* This is a patch otherwise the component wont rerender when doing refetchRemote */}
                  {console.log(remoteData)}
                  {
                    remoteData.buttons.map((item, index) => 
                      <ButtonTile key={index} id={index} item={item} state={true} remoteName={remoteName} refetch={remoteRefetch}/>
                    )}
                  {/* <AddBorderButton/> */}
                </TileGrid> 
              </DraggingProvider>
              :<h1>Loading..</h1>
            }
          </EditModeProvider>
        </div>
);
};

export default RemoteButtons;
