import React, {useEffect, useRef} from "react";
import config from  "../configs/config";

import useFetchMemo from "../hooks/useFetchMemo";
import useError from "../hooks/useError";
import usePost from "../hooks/usePost";

import { EditModeProvider } from "../contexts/EditModeContext";
import { DraggingProvider } from "../contexts/DraggingContext";

import Toolbar from "../components/Toolbar";
import TopToolbar from "../components/TopToolbar";
import ModalError from "../components/ModalError";
import ModalAddRemote from "../components/ModalAddRemote";

import { TileGrid } from "../components/TileGrid";
import { TileRemote } from "../components/TileRemote";
import NoticeBox from "../components/NoticeBox";
const Remotes = () => {
  const apiUrl = config.apiUrl;
  
  const { data, loading, error, refetch } = useFetchMemo(`${apiUrl}/remotes`);
  const { data: deviceData, loading: deviceLoading, error: deviceError, refetch: deviceRefetch } = useFetchMemo(`${apiUrl}/devices`);
  
  const attributes = useError("");

  useEffect(() => {
    if (!error) return;
    attributes.setError(error);
  },[error])

  useEffect(() => {
    if (!deviceError) return;
    attributes.setError(deviceError);
  },[deviceError])

  const Grid = ({ data, length, deviceData }) => (
    <DraggingProvider>
      <TileGrid size={length}>
        { 
          data.map((item, index) => {
            const device = deviceData ? deviceData.find((dev) => dev.macAddress == item.macAddress) : null;
            const isConnected = !!device && !!device.connectionId;
            return <TileRemote isConnected={isConnected} key={index} id={index} item={item} refetch={refetch}></TileRemote>
          })
        }
      </TileGrid>
      </DraggingProvider> 
  )
  return (
    <>
    <div className="px-2 sm:px-0 w-full overflow-x-hidden overflow-y-scroll">
    <TopToolbar/>
    <EditModeProvider>
      
    <div className="flex justify-between items-center flex-row mt-6 mb-3 ml-2">
      <div className="flex items-center justify-center">
        <span className="font-sans font-medium text-xl mb-[1px]">
          Your remotes
        </span>
        <div className="flex justify-center items-center ml-2 rounded-lg w-6 h-6 bg-green-600">
          <span className="font-sans text-center text-white text-xs" >
            {/* Buttons Count */}
            {data ? data.length : 0}
          </span>
        </div>
      </div>

      <div className="pr-3">
        <Toolbar>
          <ModalAddRemote deviceData={deviceData} onAddRemote={refetch}/>
        </Toolbar>
      </div>
    </div>
    <NoticeBox>
      If the device loses connection it will take up to 10 minutes to show up as disconnected.
    </NoticeBox>
    
    {data && data?.length > 0 ? 
      
      <Grid data={data} deviceData={deviceData} length={data.length}/>
      : null
    }
    </EditModeProvider>
    </div>
    <ModalError {...attributes}/>
    </>);
};

export default Remotes;
