import React, {useEffect, useRef, useState, useContext} from "react";
import config from  "../configs/config";

import useFetchMemo from "../hooks/useFetchMemo";
import useError from "../hooks/useError";
import api from "../api/api";
import { EditModeProvider, EditModeContext } from "../contexts/EditModeContext";
import { DraggingProvider } from "../contexts/DraggingContext";

import TopToolbar from '../components/TopToolbar';
import EmptyTiles from "../components/EmptyTiles";
import Toolbar from "../components/Toolbar";
import ModalAddDevice from "../components/ModalAddDevice";
import { TileGrid } from '../components/TileGrid';
import { TileDevice } from '../components/TileDevice';
import ModalError from "../components/ModalError";
import NoticeBox from "../components/NoticeBox";
const Devices = () => {
  const apiUrl = config.apiUrl;
  
  const { data: deviceData, loading: deviceLoading, error: deviceError, refetch: deviceRefetch } = useFetchMemo(`${apiUrl}/devices`);
  const [itemOrder, setItemOrder] = useState([]); // This represents which item is currently in the i-th position. If order[i] = 3 then the (originally) 4th item is in the (i+1)-th position
  const originalOrderIndex = useRef([]); // Same as below but original values.
  const newOrderIndex = useRef([]); // This represents in which position the item[i] should go. If item[i] = 3 then the i-th item should go to the 4th position.
  const attributes = useError("");

  useEffect(() => {
    if (!deviceError) return;
    attributes.setError(deviceError);
  },[deviceError])


  useEffect(() => {
    if (!deviceData) return;
    /*
    We're receiving for each item an orderIndex meaning that the item in position i should move to item.orderIndex
    We're looping through all items and initializing an array `newOrder` with each item from position i representing
    the item that had item.orderIndex == i.
    The reverse has to be done when saving the changes to the database
    */
    const originalOrder = new Array(deviceData.length);
    const newOrder = new Array(deviceData.length);

    deviceData.forEach((item, index) => {
      const new_order = parseInt(item.orderIndex);
      originalOrder[index] = parseInt(item.orderIndex);
      newOrder[new_order] = index;
    })

    originalOrderIndex.current = originalOrder;
    setItemOrder(newOrder);
  }, [deviceData])


  const Grid = ({ length, deviceData, itemOrder }) => {
    const { editMode } = useContext(EditModeContext);
    
    useEffect(() => {
      if (editMode) return;
      if (newOrderIndex.current.length === 0) return;

      const orderChanged = !(newOrderIndex.current.every((element, index) => element === originalOrderIndex.current[index]));
      if (!orderChanged) return;

      const response = api({
        method: "POST",
        url: `${apiUrl}/devices/sort`,
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
      const orderChanges = new Array(deviceData.length);
      newItemOrder.forEach((item, index) => {
        orderChanges[item] = index;
      })
      
      newOrderIndex.current = orderChanges;
      
      setItemOrder(newItemOrder)
    }
    return <DraggingProvider>
      <TileGrid size={length} itemOrder={itemOrder} onOrderChange={onOrderChange}>
        { 
          deviceData.map((device, index) => {
            const isConnected = !!device && !!device.connectionId;
            return <TileDevice isConnected={isConnected} key={index} id={index} item={device} refetch={deviceRefetch}/>
          })
        }
      </TileGrid>
    </DraggingProvider> 
  }

  return (<>
    <div className="px-2 sm:px-0 w-full overflow-x-hidden overflow-y-scroll">
      <TopToolbar/>
      <EditModeProvider>
        
      <div className="flex justify-between items-center flex-row mt-6 mb-3 ml-2">
        <div className="flex items-center">
          <span className="font-sans font-medium text-xl mb-[1px]">
            Your Devices
          </span>
          <div className="flex justify-center items-center ml-2 rounded-lg w-6 h-6 bg-green-600">
            <span className="font-sans text-center text-white text-xs" >
              {/* Buttons Count */}
              {deviceData ? deviceData.length : 0}
            </span>
          </div>
        </div>
        
        
        <div className="pr-3">
          <Toolbar>
            <ModalAddDevice deviceData={deviceData} onAddDevice={deviceRefetch}/>
          </Toolbar>
        </div>
      </div>
      <NoticeBox>
        If the device loses connection it will take up to 10 minutes to show up as disconnected.
      </NoticeBox>
      {deviceData && deviceData?.length > 0? 
        <Grid length={deviceData.length} deviceData={deviceData} itemOrder={itemOrder} />
        : <EmptyTiles text={"No devices available"}/>
      }
      </EditModeProvider>
      </div>
    <ModalError {...attributes}/>
  </>
  );
};

export default Devices;
