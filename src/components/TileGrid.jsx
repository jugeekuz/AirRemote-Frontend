import React, { useEffect, useState, useContext } from "react";
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

export const TileGrid = ({itemOrder, children, onOrderChange, size}) => {
	const [activeId, setActiveId] = useState(null);
	const { setDragging } = useContext(DraggingContext);
	const [childrenOrder, setChildrenOrder] = useState(
		itemOrder ||
        Array.from({ length: React.Children.count(children) }, (_, index) => index)
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
	
	useEffect(() => {
		if (!onOrderChange) return;
		onOrderChange(childrenOrder);
	},[childrenOrder])

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
			<div className="w-full grid grid-rows-2 grid-cols-2 gap-2 p-1 pr-2
			xs:grid-cols-3
			sm:grid-cols-4 
			md:grid-cols-5
			lg:grid-cols-7 
			xl:grid-cols-10 
			2xl:grid-cols-15
			3xl:grid-cols-17">
				<SortableContext items={childrenOrder.map(id => `${id}`)} strategy={rectSortingStrategy}>
					{size && childrenOrder.map((orderIndex) => children[orderIndex])}
					<DragOverlay>
						{activeId ? <div className="shadow-[0px_2px_5px_rgba(0,0,0,0.4)] shadow-gray-500 scale-105 rounded-lg">{children[activeId]}</div> : null}
					</DragOverlay>
				</SortableContext>
			</div>
		</DndContext>
	)
}
