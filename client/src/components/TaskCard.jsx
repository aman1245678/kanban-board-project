import React from "react";
import { useDispatch } from "react-redux";
import { openTaskForm } from "../store/slices/uiSlice";

const TaskCard = ({ task, provided, isDragging }) => {
  const dispatch = useDispatch();
  const handleEdit = () => {
    dispatch(openTaskForm(task));
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`bg-white rounded-lg shadow-sm border p-4 mb-3 cursor-pointer transition-all duration-200 ${isDragging ? "shadow-lg rotate-3" : "hover:shadow-md"
        } ${task.isOptimistic ? "opacity-70" : ""}`}
      onClick={handleEdit}>
      {task.isOptimistic && (
        <div className="text-xs text-blue-500 mb-2">Saving...</div>
      )}
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900 flex-1 mr-2">
          {task.title}
        </h4>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
            task.priority
          )}`}>
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>#{task._id.slice(-4)}</span>
        {task.dueDate && (
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        )}
      </div>
      {task.assignee && (
        <div className="mt-3 flex items-center">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
            {task.assignee.charAt(0).toUpperCase()}
          </div>
          <span className="ml-2 text-sm text-gray-600">{task.assignee}</span>
        </div>
      )}
    </div>
  );
};
export default TaskCard;
