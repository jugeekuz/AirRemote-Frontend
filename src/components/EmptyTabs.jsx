import React from 'react'
import { Button } from '@nextui-org/react'
import { useNavigate } from 'react-router-dom'
const EmptyTabs = ({text, link, textLink}) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col justify-center items-center w-full h-screen">
            <div className="flex flex-col items-center text-center">
                <span className="text-lg font-semibold font-poppins">{text}</span>
                <span className="text-sm text-gray-500 flex items-center font-poppins">Click the button to get started.</span>
                <Button color="primary" className='w-full mt-6 bg-gradient-to-tr from-teal-500 to-teal-700' onPress={() => navigate(link)}>
					<span className="font-normal font-roboto text-md">{textLink}</span>
				</Button>
            </div>
            <div className="h-3/5"></div>
        </div>
    )
}

export default EmptyTabs