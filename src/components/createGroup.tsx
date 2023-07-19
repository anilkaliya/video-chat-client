// CreateGroup.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../services/api';

const CreateGroup: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const navigate = useNavigate();

  const handleCreateGroup = async () => {
    try {
      const response = await createGroup(groupName);
      console.log(response.data);
      // Redirect to the group list page
      navigate('/groups');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div>
    
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
      />
      <button onClick={handleCreateGroup}>Create Group</button>
    </div>
  );
};

export default CreateGroup;
