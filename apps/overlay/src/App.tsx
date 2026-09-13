import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

function App() {
  const [lastTick, setLastTick] = useState<string>('waiting for tick...')

  useEffect(() => {
    const socket = io('http://localhost:3050')

    socket.on('connect', () => {
      socket.emit('join', 'dev-token')
    })

    socket.on('tick', (data: { timestamp: number }) => {
      setLastTick(new Date(data.timestamp).toLocaleTimeString())
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return <p>last tick: {lastTick}</p>
}

export default App
