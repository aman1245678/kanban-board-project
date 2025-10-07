import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoards } from './store/slices/boardsSlice'
import { useWebSocket } from './hooks/useWebSocket'
import { testConnection } from './utils/api'
import Header from './components/Header'
import KanbanBoard from './components/KanbanBoard'
import TaskForm from './components/TaskForm'
import Notification from './components/Notification'
function App() {
  const dispatch = useDispatch()
  const { currentBoard } = useSelector(state => state.boards)
  const [connectionStatus, setConnectionStatus] = useState('checking')
  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing Kanban App...')
      const isConnected = await testConnection()
      setConnectionStatus(isConnected ? 'connected' : 'failed')

      if (isConnected) {
        console.log('Backend connected, fetching boards...')
        dispatch(fetchBoards())
      } else {
        console.error('Cannot connect to backend.')
      }
    }

    initializeApp()
  }, [dispatch])

  useWebSocket(currentBoard?._id)

  if (connectionStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Connecting to backend server...</p>
        </div>
      </div>
    )
  }

  if (connectionStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Backend Connection Failed</h2>
          <p className="text-gray-600 mb-4">
            Cannot connect to the backend server. Please ensure:
          </p>
          <ul className="text-left text-gray-600 mb-4 space-y-2">
            <li>• Backend server is running on port 5000</li>
            <li>• MongoDB connection is configured</li>
            <li>• CORS is properly set up</li>
          </ul>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <KanbanBoard />
      </main>
      <TaskForm />
      <Notification />
    </div>
  )
}

export default App