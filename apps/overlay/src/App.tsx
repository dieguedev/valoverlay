import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState<string>('loading...')

  useEffect(() => {
    fetch('http://localhost:3050/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('unreachable'))
  }, [])

  return <p>server status: {status}</p>
}

export default App
