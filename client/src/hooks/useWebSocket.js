import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import { fetchTasks } from "../store/slices/tasksSlice";
import { showNotification } from "../store/slices/uiSlice";

export const useWebSocket = (boardId) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!boardId) return;

    socketRef.current = io(
      import.meta.env.VITE_WS_URL || "http://localhost:5000"
    );

    socketRef.current.emit("join-board", boardId);

    socketRef.current.on("task-updated", (data) => {
      dispatch(fetchTasks(boardId));
      dispatch(
        showNotification({
          type: "info",
          message: `Task "${data.task.title}" updated`,
        })
      );
    });

    socketRef.current.on("task-created", (data) => {
      dispatch(fetchTasks(boardId));
      dispatch(
        showNotification({
          type: "info",
          message: `New task: "${data.task.title}"`,
        })
      );
    });

    socketRef.current.on("task-deleted", (data) => {
      dispatch(fetchTasks(boardId));
      dispatch(
        showNotification({
          type: "info",
          message: `Task deleted`,
        })
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [boardId, dispatch]);

  return socketRef.current;
};
