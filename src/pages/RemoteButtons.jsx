import React, { useContext, useEffect, useState, useRef } from "react";

import { useParams } from "react-router-dom"

import config from "../configs/config";

import useFetchMemo from "../hooks/useFetchMemo";
import useError from "../hooks/useError";

import { EditModeProvider, EditModeContext } from "../contexts/EditModeContext";
import { DraggingProvider } from "../contexts/DraggingContext";
import api from "../api/api";

import EmptyTiles from "../components/EmptyTiles";
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
  const [macAddress, setMacAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: remoteData, loading, error: remoteError, refetch: remoteRefetch } = useFetchMemo(`${apiUrl}/remotes/${remoteName}`);
  const { data: deviceData, loading: deviceLoading, error: deviceError, refetch: deviceRefetch } = useFetchMemo(macAddress ? `${apiUrl}/devices/${macAddress}` : null);
  const [itemOrder, setItemOrder] = useState(null); // This represents which item is currently in the i-th position. If order[i] = 3 then the (originally) 4th item is in the (i+1)-th position
  const originalOrder = useRef([]);
  

  useEffect(() => {
		if (!remoteData?.macAddress) return;
    setMacAddress(remoteData.macAddress);
    originalOrder.current = Array.from({ length: remoteData.buttons.length }, (_, i) => i);
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

  const Grid = ({ length, itemOrder, buttons, remoteName }) => {
    const { editMode } = useContext(EditModeContext);

    useEffect(() => {
      if (editMode) return;
      if (!itemOrder) return;
      if(originalOrder.current.length == 0 || itemOrder?.length == 0) return;
      const orderChanged = !(originalOrder.current.every((element, index) => element === itemOrder[index]));
      if (!orderChanged) return;

      const response = api({
        method: "POST",
        url: `${apiUrl}/remotes/${remoteName}/buttons/sort`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {"newOrder": itemOrder},
      });

      response
      .catch((error => attributes.setError(error.message)));
    }, [editMode])

    const onOrderChange = (newItemOrder) => {
      setItemOrder(newItemOrder)
    }
    return (
      length && 
      <DraggingProvider>
      <TileGrid size={length} itemOrder={itemOrder} onOrderChange={onOrderChange}>
        { buttons.map((item, index) => 
            <TileRemoteButton key={index} id={index} item={item} state={item?.buttonState === "YES"} remoteName={remoteName} refetch={remoteRefetch}/>
          )}
      </TileGrid> 
    </DraggingProvider>)
  }

  return (
        <>
        <div className="px-2 sm:px-0 w-full overflow-x-hidden overflow-y-scroll">

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
                <Grid length={remoteData.buttons.length} buttons={remoteData.buttons} remoteName={remoteName} itemOrder={itemOrder} />
              : <EmptyTiles text={"No remote buttons available"}/>
            }
          </EditModeProvider>
        </div>
        <ModalError {...attributes}/>
        </>
);
};

export default RemoteButtons;
