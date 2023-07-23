// JoinGroup.tsx

import React from 'react';
import { useParams } from 'react-router-dom';



const JoinGroup: React.FC = () => {
    const params = useParams();
    const groupId = params.groupId as string;
  return (
    <div>
      <h2>Join Group</h2>
      <p>Joining group with ID: {groupId}</p>
    </div>
  );
};

export default JoinGroup;
