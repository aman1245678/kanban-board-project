import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearNotification } from '../store/slices/uiSlice'

const Notification = () => {
    const dispatch = useDispatch()
    const { notification } = useSelector(state => state.ui)

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                dispatch(clearNotification())
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [notification, dispatch])

    if (!notification) return null

    const getNotificationStyles = (type) => {
        const baseStyles = "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm"

        switch (type) {
            case 'success':
                return `${baseStyles} bg-green-500 text-white`
            case 'error':
                return `${baseStyles} bg-red-500 text-white`
            case 'info':
                return `${baseStyles} bg-blue-500 text-white`
            default:
                return `${baseStyles} bg-gray-500 text-white`
        }
    }

    return (
        <div className={getNotificationStyles(notification.type)}>
            <div className="flex items-center justify-between">
                <span>{notification.message}</span>
                <button
                    onClick={() => dispatch(clearNotification())}
                    className="ml-4 text-white hover:text-gray-200"
                >
                    ×
                </button>
            </div>
        </div>
    )
}

export default Notification