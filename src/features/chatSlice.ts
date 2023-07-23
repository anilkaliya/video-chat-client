import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createGroup, deleteGroupFromList, getGroups } from '../services/api'

export interface GroupState {
  groups: [{id:string,name:string}] |[]
}

const initialState: GroupState = {
  groups: [],
}
export const deleteGroup=createAsyncThunk('chat/deleteGroup',async(groupId:string)=>{
  const response = await deleteGroupFromList(groupId)
    return response.data
})
export const fetchGroups = createAsyncThunk(
  'chat/fetchGroups',
  async () => {
    const response = await getGroups()
    return response.data
  }
)
export const createNewGroup = createAsyncThunk('chat/createGroups',
async(groupName:string,thunkAPI) => {
    const response = await createGroup(groupName);
  })

export const chatSlice = createSlice({
  name: 'chatSlice',
  initialState,
  reducers: {
   
  },
  extraReducers:(builder)=>{
    builder.addCase(fetchGroups.fulfilled,(state,action)=>{

      state.groups=action.payload.groups
    })
    .addCase(createNewGroup.fulfilled,(state,action)=>{
      
    })
     
  }
})

export const {  } = chatSlice.actions

export default chatSlice.reducer