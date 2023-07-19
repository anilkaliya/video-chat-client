// GroupList.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGroups } from '../services/api';

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<[{id:string,name:string}]>();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getGroups();
        setGroups(response.data.groups);
      } catch (error) {
        console.error('Error getting groups:', error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div>
      
      <ul>
        {groups&&groups.map((group) => (
          <li key={group.id}>
            <Link to={`/groups/${group.id}/video-chat`}>
              {group.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;
