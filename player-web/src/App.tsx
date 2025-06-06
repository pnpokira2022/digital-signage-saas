import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [status, setStatus] = useState('');
  useEffect(() => {
    axios.get('http://localhost:3001/health')
      .then(res => setStatus(res.data.status))
      .catch(err => console.error(err));
  }, []);
  return <div>Player-Web Backend Status: {status}</div>;
}

export default App;