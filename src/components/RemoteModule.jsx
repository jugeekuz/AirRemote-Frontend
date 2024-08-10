import React from "react";

const RemoteModule = (props) => {
	return(
		<div className="flex w-full h-64 bg-black p-4">
			{props.children}
		</div>
	)
}

export default RemoteModule;