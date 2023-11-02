import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const initialState = {
  selectedFriends: [],
  completedLentRecord: [],
  unCompletedLentRecord: [],
  totalCompletedLentRecord: 0,
  totalUnCompletedLentRecord: 0,
  lentRemainingAmount: 0,
  lentReceivedAmount: 0,
  completedBorrowRecord: [],
  unCompletedBorrowRecord: [],
  totalCompletedBorrowRecord: 0,
  totalUnCompletedBorrowRecord: 0,
  borrowRemainingAmount: 0,
  borrowReceivedAmount: 0,
  totalLent: 0,
  totalBorrowed: 0,
  selectedLentRecord: null,
  selectedBorrowRecord: null,
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const createRecord = createAsyncThunk(
  "records/createRecords",
  async (recordData, thunkAPI) => {
    try {
      const email = await SecureStore.getItemAsync("email");
      console.log("Received record data: ", recordData);
      const response = await axios.post(
        `${API_URL}/record/create-borrow-record/${email}`,
        { friend_and_amount: recordData }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const getLentRecord = createAsyncThunk(
  "records/getLentRecord",
  async (thunkAPI) => {
    try {
      const email = await SecureStore.getItemAsync("email");

      const response = await axios.get(
        `${API_URL}/record/get-lent-record/${email}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const updateLentRecord = createAsyncThunk(
  "records/updateLentRecord",
  async (updatedData, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/record/update-record-status/`,
        {
          record_ids: updatedData.recordIds,
          borrow_id: updatedData.borrowId,
        }
      );
      console.log(
        "This is the response data: ",
        Object.values(response.data)[0]
      );
      thunkAPI.dispatch(setSelectedLentRecord(Object.values(response.data)[0]));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const getBorrowRecord = createAsyncThunk(
  "records/getBorrowRecord",
  async (thunkAPI) => {
    try {
      const email = await SecureStore.getItemAsync("email");

      const response = await axios.get(
        `${API_URL}/record/get-borrow-record/${email}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.detail);
    }
  }
);

export const recordsSlice = createSlice({
  name: "records",
  initialState,
  reducers: {
    setSelectedFriends: (state, action) => {
      state.selectedFriends = action.payload.sort();
    },
    setSelectedLentRecord: (state, action) => {
      state.selectedLentRecord = action.payload;
    },
    setSelectedBorrowRecord: (state, action) => {
      state.selectedBorrowRecord = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLentRecord.fulfilled, (state, action) => {
      state.completedLentRecord = [];
      state.unCompletedLentRecord = [];
      state.totalCompletedLentRecord = 0;
      state.totalUnCompletedLentRecord = 0;
      state.lentReceivedAmount = 0;
      state.lentRemainingAmount = 0;
      state.totalLent = 0;

      for (const key in action.payload) {
        const record = action.payload[key];
        state.totalLent += record.total_amount;

        if (record.overall_status) {
          state.completedLentRecord.push(record);
          state.totalCompletedLentRecord += 1;
          state.lentReceivedAmount += record.total_amount;
        } else {
          state.unCompletedLentRecord.push(record);
          state.totalUnCompletedLentRecord += 1;
          state.lentRemainingAmount += record.total_amount;
        }
      }
    });
    builder.addCase(getBorrowRecord.fulfilled, (state, action) => {
      state.completedBorrowRecord = [];
      state.unCompletedBorrowRecord = [];
      state.totalCompletedBorrowRecord = 0;
      state.totalUnCompletedBorrowRecord = 0;
      state.borrowReceivedAmount = 0;
      state.borrowRemainingAmount = 0;
      state.totalBorrowed = 0;

      for (const key in action.payload) {
        const record = action.payload[key];
        state.totalBorrowed += record.total_amount;

        if (record.friends[0].status) {
          state.completedBorrowRecord.push(record);
          state.totalCompletedBorrowRecord += 1;
          state.borrowReceivedAmount += record.friends[0].amount;
        } else {
          state.unCompletedBorrowRecord.push(record);
          state.totalUnCompletedBorrowRecord += 1;
          state.borrowRemainingAmount += record.friends[0].amount;
        }
      }
    });
  },
});

export const { setSelectedFriends, setSelectedLentRecord } =
  recordsSlice.actions;

export default recordsSlice.reducer;
