import React from 'react'
import { CircleFadingPlus } from "lucide-react";
const EmptyTiles = ({text}) => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-screen">
            <div className="flex flex-col items-center text-center">
                <span className="text-lg font-semibold font-poppins">{text}</span>
                <span className="text-sm text-gray-500 flex items-center font-poppins">Click the <CircleFadingPlus className='mx-1' size={16}/> icon to get started.</span>
            </div>
            <div className="h-1/2"></div>
        </div>
    )
}

export default EmptyTiles