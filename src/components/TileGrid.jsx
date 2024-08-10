import React from "react";

export const TileGrid = (props) => {
	return (
		<div className="w-full grid grid-rows-10 grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10  gap-2 p-1 pr-2">
			{props.children}
		</div>
	)
}

export const Tile = (props) => {
	return (
		<div className="bg-gray-100 rounded-lg border border-gray-300 h-32 p-1">
				{props.children}
		</div>
	)
}