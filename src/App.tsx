import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateGroup from './components/createGroup';
import GroupList from './components/listGroup';
import JoinGroup from './components/joinGroup';
import {ChatRoom} from './components/ChatRoom';
import './App.css'
function App() {
  return (
    <Router>
      <div className="page-container">
      
        <div className="groups-section">
          <GroupList />
          <div className="create-group">
            <CreateGroup />
          </div>
          </div>
        
          <div className="chat-section">
            <Routes>
              <Route path="/groups/:roomId" element={<JoinGroup />} />
              <Route path="/groups/:roomId/video-chat" element={<ChatRoom />} />
            </Routes>
          </div>
        </div>
   
    </Router>
  );
}

export default App;
