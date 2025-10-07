import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchTerm,
  openTaskForm,
  setFilter,
  clearFilters,
} from "../store/slices/uiSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { searchTerm, filters } = useSelector((state) => state.ui);
  const { currentBoard } = useSelector((state) => state.boards);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilter({ [filterType]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(setSearchTerm(""));
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentBoard?.name || "Kanban Board"}
            </h1>
            <button
              onClick={() => dispatch(openTaskForm())}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium">
              + New Task
            </button>
          </div>

          <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full lg:w-64"
              />

              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filters.assignee}
                onChange={(e) => handleFilterChange("assignee", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option value="">All Assignees</option>
                <option value="John">John</option>
                <option value="Jane">Jane</option>
                <option value="Mike">Mike</option>
                <option value="Sarah">Sarah</option>
              </select>

              {(searchTerm || filters.priority || filters.assignee) && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none">
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
