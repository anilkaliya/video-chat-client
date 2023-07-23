// api.ts

import axios from 'axios';
import { backendUrl } from '../config';

const api = axios.create({
  baseURL:`${backendUrl}/api`,
// baseURL:"http://localhost:3001/api"
});

export const createGroup = async (groupName: string) => {
    try {
      return await api.post('/groups', { name: groupName }, { headers: { 'Content-Type': 'application/json'}});
    } catch (error) {
      console.log('Error creating group:', error);
      throw error;
    }
  };

export const getGroups = async () => {

  return await api.get('/groups');
};
export const deleteGroupFromList=async(groupId:string)=>{
return await api.delete(`/groups/${groupId}`)
}