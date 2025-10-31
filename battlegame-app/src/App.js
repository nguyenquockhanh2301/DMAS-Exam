import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [playerAssets, setPlayerAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('report');
  const [message, setMessage] = useState(null);

  // Form states
  const [newPlayer, setNewPlayer] = useState({
    playerName: '',
    fullName: '',
    age: '',
    level: 1,
    email: ''
  });

  const [newAsset, setNewAsset] = useState({
    assetName: '',
    levelRequire: 1
  });

  const [assignForm, setAssignForm] = useState({
    playerName: '',
    assetName: ''
  });
  const [playersList, setPlayersList] = useState([]);
  const [assetsList, setAssetsList] = useState([]);

  const API_BASE_URL = 'http://localhost:7071/api';

  // Fetch available players and assets for dropdowns
  const fetchPlayersAndAssets = async () => {
    try {
      const [pResp, aResp] = await Promise.all([
        axios.get(`${API_BASE_URL}/getplayers`),
        axios.get(`${API_BASE_URL}/getassets`)
      ]);

      if (pResp.data?.success) setPlayersList(pResp.data.data || []);
      if (aResp.data?.success) setAssetsList(aResp.data.data || []);
    } catch (err) {
      console.error('Error fetching players/assets:', err);
      // non-fatal for UI; lists may be empty
    }
  };

  useEffect(() => {
    fetchPlayerAssets();
    fetchPlayersAndAssets();
  }, []);

  const fetchPlayerAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/getassetsbyplayer`);
      
      if (response.data.success) {
        setPlayerAssets(response.data.data);
      } else {
        setError('Failed to fetch player assets');
      }
    } catch (err) {
      console.error('Error fetching player assets:', err);
      setError('Failed to connect to the server. Make sure Azure Functions is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPlayer = async (e) => {
    e.preventDefault();
    try {
      setMessage({ type: 'loading', text: 'Registering player...' });
      const response = await axios.post(`${API_BASE_URL}/registerplayer`, newPlayer);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: `Player "${newPlayer.playerName}" registered successfully!` });
        setNewPlayer({ playerName: '', fullName: '', age: '', level: 1, email: '' });
        fetchPlayerAssets();
        fetchPlayersAndAssets();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to register player';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    try {
      setMessage({ type: 'loading', text: 'Creating asset...' });
      const response = await axios.post(`${API_BASE_URL}/createasset`, newAsset);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: `Asset "${newAsset.assetName}" created successfully!` });
        setNewAsset({ assetName: '', levelRequire: 1 });
        fetchPlayerAssets();
        fetchPlayersAndAssets();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create asset';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎮 Battle Game Management System</h1>
        <nav className="tabs">
          <button 
            className={`tab ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => { setActiveTab('report'); setMessage(null); }}
          >
            📊 Player Assets Report
          </button>
          <button 
            className={`tab ${activeTab === 'player' ? 'active' : ''}`}
            onClick={() => { setActiveTab('player'); setMessage(null); }}
          >
            👤 Register Player
          </button>
          <button 
            className={`tab ${activeTab === 'asset' ? 'active' : ''}`}
            onClick={() => { setActiveTab('asset'); setMessage(null); }}
          >
            ⚔️ Create Asset
          </button>
          <button 
            className={`tab ${activeTab === 'assign' ? 'active' : ''}`}
            onClick={() => { setActiveTab('assign'); setMessage(null); }}
          >
            🧾 Assign Asset
          </button>
        </nav>
      </header>

      <main className="App-main">
        {message && (
          <div className={`message message-${message.type}`}>
            {message.type === 'loading' && <div className="spinner-small"></div>}
            <p>{message.text}</p>
            {message.type !== 'loading' && (
              <button onClick={() => setMessage(null)}>×</button>
            )}
          </div>
        )}

        {/* REPORT TAB */}
        {activeTab === 'report' && (
          <>
            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading player assets...</p>
              </div>
            )}

            {error && (
              <div className="error">
                <p>⚠️ {error}</p>
                <button onClick={fetchPlayerAssets}>Retry</button>
              </div>
            )}

            {!loading && !error && (
              <div className="table-container">
                <div className="table-header">
                  <h2>Player Assets List</h2>
                  <button className="refresh-btn" onClick={fetchPlayerAssets}>
                    🔄 Refresh
                  </button>
                </div>

                {playerAssets.length === 0 ? (
                  <p className="no-data">No player assets found.</p>
                ) : (
                  <table className="player-assets-table">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Player Name</th>
                        <th>Level</th>
                        <th>Age</th>
                        <th>Asset Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerAssets.map((item) => (
                        <tr key={`${item.playerName}-${item.assetName}-${item.no}`}>
                          <td>{item.no}</td>
                          <td>{item.playerName}</td>
                          <td>{item.level}</td>
                          <td>{item.age}</td>
                          <td>{item.assetName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="table-footer">
                  <p>Total Records: <strong>{playerAssets.length}</strong></p>
                </div>
              </div>
            )}
          </>
        )}

        {/* REGISTER PLAYER TAB */}
        {activeTab === 'player' && (
          <div className="form-container">
            <h2>Register New Player</h2>
            <form onSubmit={handleRegisterPlayer}>
              <div className="form-group">
                <label>Player Name *</label>
                <input
                  type="text"
                  value={newPlayer.playerName}
                  onChange={(e) => setNewPlayer({...newPlayer, playerName: e.target.value})}
                  placeholder="Enter unique player name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={newPlayer.fullName}
                  onChange={(e) => setNewPlayer({...newPlayer, fullName: e.target.value})}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="text"
                    value={newPlayer.age}
                    onChange={(e) => setNewPlayer({...newPlayer, age: e.target.value})}
                    placeholder="Age"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Level</label>
                  <input
                    type="number"
                    value={newPlayer.level}
                    onChange={(e) => setNewPlayer({...newPlayer, level: parseInt(e.target.value)})}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={newPlayer.email}
                  onChange={(e) => setNewPlayer({...newPlayer, email: e.target.value})}
                  placeholder="player@example.com"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                ✓ Register Player
              </button>
            </form>
          </div>
        )}

        {/* CREATE ASSET TAB */}
        {activeTab === 'asset' && (
          <div className="form-container">
            <h2>Create New Asset</h2>
            <form onSubmit={handleCreateAsset}>
              <div className="form-group">
                <label>Asset Name *</label>
                <input
                  type="text"
                  value={newAsset.assetName}
                  onChange={(e) => setNewAsset({...newAsset, assetName: e.target.value})}
                  placeholder="Enter asset name (e.g., Magic Sword)"
                  required
                />
              </div>

              <div className="form-group">
                <label>Level Requirement *</label>
                <input
                  type="number"
                  value={newAsset.levelRequire}
                  onChange={(e) => setNewAsset({...newAsset, levelRequire: parseInt(e.target.value)})}
                  min="1"
                  placeholder="Minimum level required"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                ✓ Create Asset
              </button>
            </form>
          </div>
        )}

        {/* ASSIGN ASSET TAB */}
        {activeTab === 'assign' && (
          <div className="form-container">
            <h2>Assign Asset To Player</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                setMessage({ type: 'loading', text: 'Assigning asset...' });
                const response = await axios.post(`${API_BASE_URL}/assignasset`, assignForm);
                if (response.data.success) {
                  setMessage({ type: 'success', text: response.data.message || 'Asset assigned successfully' });
                  setAssignForm({ playerName: '', assetName: '' });
                  fetchPlayerAssets();
                  fetchPlayersAndAssets();
                }
              } catch (err) {
                const errorMsg = err.response?.data?.message || 'Failed to assign asset';
                setMessage({ type: 'error', text: errorMsg });
              }
            }}>
              <div className="form-group">
                <label>Player Name *</label>
                <select
                  value={assignForm.playerName}
                  onChange={(e) => setAssignForm({...assignForm, playerName: e.target.value})}
                  required
                >
                  <option value="">-- Select player --</option>
                  {playersList.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Asset Name *</label>
                <select
                  value={assignForm.assetName}
                  onChange={(e) => setAssignForm({...assignForm, assetName: e.target.value})}
                  required
                >
                  <option value="">-- Select asset --</option>
                  {assetsList.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="submit-btn">
                ✓ Assign Asset
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="App-footer">
        <p>Battle Game Assignment - DMAS Exam</p>
      </footer>
    </div>
  );
}

export default App;
