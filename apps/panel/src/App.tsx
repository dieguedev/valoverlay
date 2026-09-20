import type { HealthResponse } from '@valoverlay/shared'
import { useEffect, useState } from 'react'
import styles from './App.module.scss'

function App() {
  const [status, setStatus] = useState<string>('loading...')

  useEffect(() => {
    fetch('http://localhost:3050/health')
      .then((res) => res.json() as Promise<HealthResponse>)
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('unreachable'))
  }, [])

  return <p className={styles.status}>server status: {status}</p>
}

export default App
