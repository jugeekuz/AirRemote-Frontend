import React, { useRef, useEffect, useState } from "react";

import { useParams } from "react-router-dom"

import config from "../configs/config";

import useFetchMemo from "../hooks/useFetchMemo";
import useError from "../hooks/useError";

import { EditModeProvider } from "../contexts/EditModeContext";
import { DraggingProvider } from "../contexts/DraggingContext";

import TopToolbar from '../components/TopToolbar';
import InfoBar from '../components/InfoBar';
import Toolbar from "../components/Toolbar";
import ModalAddButton from "../components/ModalAddButton";
import { TileGrid } from '../components/TileGrid';
import { TileRemoteButton } from '../components/TileRemoteButton';
import ModalError from "../components/ModalError";
const RemoteButtons = () => {
	const apiUrl = config.apiUrl;
	const { remoteName } = useParams();
  const attributes = useError("");

	const macAddress = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: remoteData, loading, error: remoteError, refetch: remoteRefetch } = useFetchMemo(`${apiUrl}/remotes/${remoteName}`);
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

  useEffect(() => {
    if (!remoteError) return;
    attributes.setError(remoteError);
  },[remoteError])

  useEffect(() => {
    if (!deviceError) return;
    attributes.setError(deviceError);
  },[deviceError])

  const Grid = ({ length, buttons, remoteName }) => (
    <DraggingProvider>
      <TileGrid size={length}>
        { buttons.map((item, index) => 
            <TileRemoteButton key={index} id={index} item={item} state={item?.buttonState === "YES"} remoteName={remoteName} refetch={remoteRefetch}/>
          )}
      </TileGrid> 
    </DraggingProvider>
  )
  

  return (
        <>
        <div className="w-full overflow-x-hidden overflow-y-scroll">

          {/* Top Toolbar */}
          <TopToolbar/>
          <EditModeProvider>
          
            {/* Info Bar */}
            <InfoBar 
              macAddress={deviceData?.macAddress ? deviceData?.macAddress : "Loading.."} 
              category={remoteData? remoteData.category: "Loading.."}
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
                <Toolbar>
                  <ModalAddButton onAddButton={remoteRefetch}/>
                </Toolbar>
              </div>
            </div>
            {/* Buttons Grid */}
            {remoteData && remoteData?.buttons.length !== 0
              ?
                <Grid length={remoteData.buttons.length} buttons={remoteData.buttons} remoteName={remoteName}/>
              : null
            }
          </EditModeProvider>
        </div>
        <ModalError {...attributes}/>
        </>
);
};

export default RemoteButtons;
