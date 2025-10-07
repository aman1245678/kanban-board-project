import React from "react";
import { Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

const Column = ({ column, tasks, isDraggingOver, provided }) => {
  return (
    <div
      className={`rounded-lg shadow-sm border ${
        isDraggingOver
          ? "bg-blue-50 border-blue-300"
          : "bg-white border-gray-200"
      }`}>
      <div className={`p-4 rounded-t-lg ${column.color} text-white`}>
        <h3 className="font-semibold text-lg">
          {column.title} ({tasks.length})
        </h3>
      </div>

      <div
        {...provided.droppableProps}
        ref={provided.innerRef}
        className={`p-4 min-h-[500px] transition-colors duration-200 ${
          isDraggingOver ? "bg-blue-25" : "bg-gray-50"
        }`}>
        {tasks.map((task, index) => (
          <Draggable key={task._id} draggableId={task._id} index={index}>
            {(provided, snapshot) => (
              <TaskCard
                task={task}
                provided={provided}
                isDragging={snapshot.isDragging}
              />
            )}
          </Draggable>
        ))}
        {provided.placeholder}

        {tasks.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No tasks in this column
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
