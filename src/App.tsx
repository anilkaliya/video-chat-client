import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateGroup from './components/createGroup';
import GroupList from './components/listGroup';
import JoinGroup from './components/joinGroup';
import {ChatRoom} from './components/ChatRoom';
import './App.css'
const backgroundImage='https://cdn.dribbble.com/users/1003944/screenshots/15741863/media/96a2668dbf0b4da82efca00d60011ca8.gif'
function App() {
  return (
    <Router>
      <div className="page-container">
      
        <div className="groups-section col-4">
          <GroupList />
          <div className="create-group">
            <CreateGroup />
          </div>
          </div>
        
          <div className="chat-section col-8"  
        style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover', 
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        minHeight: '100vh',
      }}>
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
