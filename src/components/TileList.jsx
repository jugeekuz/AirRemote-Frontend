import React, { useEffect, useState, useRef, useContext } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	DragOverlay,
} from "@dnd-kit/core";

import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	rectSortingStrategy,
	useSortable
} from "@dnd-kit/sortable";

import { CSS } from '@dnd-kit/utilities';

import { DraggingContext } from "../contexts/DraggingContext";

export const TileList = (props) => {
	const [activeId, setActiveId] = useState(null);
	const { setDragging } = useContext(DraggingContext);
	const [childrenOrder, setChildrenOrder] = useState(
        Array.from({ length: React.Children.count(props.children) }, (_, index) => index)
    );
	const sensors = useSensors(
		useSensor(MouseSensor, {
		  activationConstraint: {
			distance: 8,
		  },
		}),
		useSensor(TouchSensor, {
		  activationConstraint: {
			delay: 300,
			tolerance: 8,
		  },
		}),
		useSensor(KeyboardSensor, {
		  coordinateGetter: sortableKeyboardCoordinates,
		}),
	  );
	
	const handleDragStart = (event) => {
		setActiveId(event.active.id);
		setDragging(true);
	};
	
	const handleDragEnd = (event) => {
		setActiveId(null);
		setDragging(false);

		const { active, over } = event;
		
		if (active.id !== over.id) {
			const oldIndex = childrenOrder.indexOf(Number(active.id));
            const newIndex = childrenOrder.indexOf(Number(over.id));
            setChildrenOrder(arrayMove(childrenOrder, oldIndex, newIndex));
		}
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
		>
			<div className="w-full grid grid-rows-2 grid-cols-1 gap-2 p-1 pr-2
			sm:grid-cols-2
			md:grid-cols-3
			lg:grid-cols-4
			xl:grid-cols-5
			2xl:grid-cols-6
			3xl:grid-cols-7
			">
				<SortableContext items={childrenOrder.map(id => `${id}`)} strategy={rectSortingStrategy}>
					{props.size && childrenOrder.map((orderIndex) => props.children[orderIndex])}
					<DragOverlay>
						{activeId ? <div className="shadow-[0px_2px_5px_rgba(0,0,0,0.4)] shadow-gray-500 scale-105 rounded-lg">{props.children[activeId]}</div> : null}
					</DragOverlay>
				</SortableContext>
			</div>
		</DndContext>
	)
}