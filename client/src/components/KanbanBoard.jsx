import React, { useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  updateTaskStatus,
  optimisticUpdate,
} from "../store/slices/tasksSlice";
import Column from "./Column";
import { kanbanAPI } from "../utils/api";
import { showNotification } from "../store/slices/uiSlice";

const KanbanBoard = () => {
  const dispatch = useDispatch();
  const { currentBoard } = useSelector((state) => state.boards);
  const { items: tasks } = useSelector((state) => state.tasks);
  const { searchTerm, filters } = useSelector((state) => state.ui);

  useEffect(() => {
    if (currentBoard) {
      dispatch(fetchTasks(currentBoard._id));
    }
  }, [currentBoard, dispatch]);

  const columns = [
    { id: "todo", title: "To Do", color: "bg-blue-500" },
    { id: "in-progress", title: "In Progress", color: "bg-yellow-500" },
    { id: "review", title: "Review", color: "bg-purple-500" },
    { id: "done", title: "Done", color: "bg-green-500" },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAssignee =
      !filters.assignee || task.assignee === filters.assignee;
    const matchesPriority =
      !filters.priority || task.priority === filters.priority;

    return matchesSearch && matchesAssignee && matchesPriority;
  });

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const task = tasks.find((t) => t._id === draggableId);
    if (!task) return;

    dispatch(
      optimisticUpdate({
        taskId: draggableId,
        updates: { status: destination.droppableId },
      })
    );

    try {
      await dispatch(
        updateTaskStatus({
          taskId: draggableId,
          status: destination.droppableId,
        })
      ).unwrap();

      dispatch(
        showNotification({
          type: "success",
          message: "Task moved successfully",
        })
      );
    } catch (error) {
      dispatch(
        optimisticUpdate({
          taskId: draggableId,
          updates: { status: source.droppableId },
        })
      );

      dispatch(
        showNotification({
          type: "error",
          message: "Failed to move task",
        })
      );
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <Column
                  column={column}
                  tasks={filteredTasks.filter(
                    (task) => task.status === column.id
                  )}
                  isDraggingOver={snapshot.isDraggingOver}
                  provided={provided}
                />
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
