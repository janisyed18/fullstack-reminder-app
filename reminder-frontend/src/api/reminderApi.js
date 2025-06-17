import axios from "axios";

// The base URL of our Spring Boot backend
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:8080/api/v1/reminders";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Function to get all reminders with pagination
export const getAllReminders = (page = 0, size = 10, sort = "dueDate,asc") =>
  api.get(`/all?page=${page}&size=${size}&sort=${sort}`);

// Function to get a single reminder by its ID
export const getReminderById = (id) => api.get(`/get/${id}`);

// Function to create a new reminder
export const createReminder = (reminder) => api.post("/create", reminder);

// Function to update an existing reminder
export const updateReminder = (id, reminder) =>
  api.put(`/update/${id}`, reminder);

// Function to delete a reminder
export const deleteReminder = (id) => api.delete(`/delete/${id}`);

// Function to mark a reminder as completed
export const markAsCompleted = (id) => api.patch(`/complete/${id}`);

export default api;
