import axios from "axios";

// The base URL of our Spring Boot backend
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:8080/api/v1/reminders";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Updated to handle all filtering parameters dynamically
export const getAllReminders = (params) => {
  const {
    page = 0,
    size = 6,
    sort = "dueDate,asc",
    title = "",
    priority = "",
    isCompleted,
  } = params;

  // Start with base parameters
  let url = `/all?page=${page}&size=${size}&sort=${sort}&title=${title}&priority=${priority}`;

  // Only add the isCompleted parameter if it's not null or undefined (i.e., it's explicitly true or false)
  if (isCompleted !== null && isCompleted !== undefined) {
    url += `&isCompleted=${isCompleted}`;
  }

  return api.get(url);
};

// --- Other API functions remain the same ---

export const getReminderById = (id) => api.get(`/get/${id}`);

export const createReminder = (reminder) => api.post("/create", reminder);

export const updateReminder = (id, reminder) =>
  api.put(`/update/${id}`, reminder);

export const deleteReminder = (id) => api.delete(`/delete/${id}`);

export const markAsCompleted = (id) => api.patch(`/complete/${id}`);

export default api;
