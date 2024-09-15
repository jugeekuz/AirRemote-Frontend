import React from 'react'
import { BadgeAlert } from 'lucide-react'
const NoticeBox = ({children}) => {
    return (
        <div className="flex w-full min-h-16 p-1 -mb-2 -mt-1">
            <div className="flex w-full h-full items-center justify-start rounded-md bg-green-100 bg-opacity-50 border-2 border-green-500 py-1">
                <div className="h-full"><BadgeAlert className={"ml-2 mr-2"} size={"23px"} fill="#22c55e" color='#ffffff'/></div>
                <span className="text-xs font-medium text-gray-700">{children}</span>
            </div>
        </div>
    
    )
}

export default NoticeBox