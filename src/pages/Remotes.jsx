import React, {useEffect, useContext, useRef, useState} from "react";
import config from  "../configs/config";

import useFetchMemo from "../hooks/useFetchMemo";
import useError from "../hooks/useError";
import api from "../api/api";

import { EditModeProvider, EditModeContext } from "../contexts/EditModeContext";
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
  const [itemOrder, setItemOrder] = useState([]); // This represents which item is currently in the i-th position. If order[i] = 3 then the (originally) 4th item is in the (i+1)-th position
  const originalOrderIndex = useRef([]); // Same as below but original values.
  const newOrderIndex = useRef([]); // This represents in which position the item[i] should go. If item[i] = 3 then the i-th item should go to the 4th position.
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

  useEffect(() => {
    if (!data) return;
    /*
    We're receiving for each item an orderIndex meaning that the item in position i should move to item.orderIndex
    We're looping through all items and initializing an array `newOrder` with each item from position i representing
    the item that had item.orderIndex == i.
    The reverse has to be done when saving the changes to the database in `onOrderChange`
    */
    const originalOrder = new Array(data.length);
    const newOrder = new Array(data.length);
    data.forEach((item, index) => {
      const new_order = parseInt(item.orderIndex);
      originalOrder[index] = parseInt(item.orderIndex);
      newOrder[new_order] = index;
    })
    originalOrderIndex.current = originalOrder;
    setItemOrder(newOrder);
  }, [data])

  
  const Grid = ({ data, length, deviceData, itemOrder }) => {
    const { editMode } = useContext(EditModeContext);
    
    useEffect(() => {
      if (editMode) return;
      if (newOrderIndex.current.length === 0) return;
      const orderChanged = !(newOrderIndex.current.every((element, index) => element === originalOrderIndex.current[index]));
      if (!orderChanged) return;

      const response = api({
        method: "POST",
        url: `${apiUrl}/remotes/sort`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {"newOrder": newOrderIndex.current},
      });

      response
      .catch((error => attributes.setError(error.message)));
    }, [editMode])

    const onOrderChange = (newItemOrder) => {
      const orderChanged = !(itemOrder.every((element, index) => element === newItemOrder[index]));
      if (!orderChanged) return;
      const orderChanges = new Array(data.length);
      newItemOrder.forEach((item, index) => {
        orderChanges[item] = index;
      })
      
      newOrderIndex.current = orderChanges;
      
      setItemOrder(newItemOrder);
    }
    
    return <DraggingProvider>
      <TileGrid size={length} itemOrder={itemOrder} onOrderChange={onOrderChange}>
        { 
          data.map((item, index) => {
            const device = deviceData ? deviceData.find((dev) => dev.macAddress == item.macAddress) : null;
            const isConnected = !!device && !!device.connectionId;
            return <TileRemote isConnected={isConnected} key={index} id={index} item={item} refetch={refetch}></TileRemote>
          })
        }
      </TileGrid>
      </DraggingProvider> 
}
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
      <Grid data={data} deviceData={deviceData} length={data.length} itemOrder={itemOrder} />
      : null
    }
    </EditModeProvider>
    </div>
    <ModalError {...attributes}/>
    </>);
};

export default Remotes;
