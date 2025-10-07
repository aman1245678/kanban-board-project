import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTask,
  updateTask,
  optimisticUpdate,
} from "../store/slices/tasksSlice";
import { closeTaskForm, showNotification } from "../store/slices/uiSlice";

const TaskForm = () => {
  const dispatch = useDispatch();
  const { isTaskFormOpen, selectedTask } = useSelector((state) => state.ui);
  const { currentBoard } = useSelector((state) => state.boards);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignee: "",
    dueDate: "",
    status: "todo",
  });
  useEffect(() => {
    if (selectedTask) {
      setFormData({
        title: selectedTask.title,
        description: selectedTask.description || "",
        priority: selectedTask.priority,
        assignee: selectedTask.assignee || "",
        dueDate: selectedTask.dueDate ? selectedTask.dueDate.split("T")[0] : "",
        status: selectedTask.status,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        assignee: "",
        dueDate: "",
        status: "todo",
      });
    }
  }, [selectedTask]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      dispatch(
        showNotification({
          type: "error",
          message: "Title is required",
        })
      );
      return;
    }
    const taskData = {
      ...formData,
      boardId: currentBoard._id,
    };

    if (selectedTask) {
      const fullTaskData = {
        ...selectedTask,
        ...taskData,
      };
      dispatch(
        optimisticUpdate({
          taskId: selectedTask._id,
          updates: taskData,
        })
      );
      try {
        await dispatch(updateTask(fullTaskData)).unwrap();
        dispatch(closeTaskForm());
        dispatch(
          showNotification({
            type: "success",
            message: "Task updated successfully",
          })
        );
      } catch (error) {
        dispatch(
          showNotification({
            type: "error",
            message: "Failed to update task",
          })
        );
      }
    } else {
      const temporaryId = `temp-${Date.now()}`;
      dispatch(
        optimisticUpdate({
          temporaryId,
          updates: { ...taskData, _id: temporaryId, isOptimistic: true },
        })
      );
      try {
        await dispatch(createTask(taskData)).unwrap();
        dispatch(closeTaskForm());
        dispatch(
          showNotification({
            type: "success",
            message: "Task created successfully",
          })
        );
      } catch (error) {
        dispatch(
          showNotification({
            type: "error",
            message: "Failed to create task",
          })
        );
      }
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  if (!isTaskFormOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedTask ? "Edit Task" : "Create New Task"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee
                </label>
                <input
                  type="text"
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter assignee name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => dispatch(closeTaskForm())}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {selectedTask ? "Update Task" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
