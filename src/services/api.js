import axios from 'axios';

const API_URL = 'http://190.156.150.149:5035/api'; // Usa el puerto de tu backend

// Obtener las materias
export const getSubjects = async () => {
  const response = await axios.get(`${API_URL}/subjects`); // 'subjects' en minúsculas
  return response.data;
};

// Registrar un estudiante
export const registerStudent = async (studentData) => {
  const response = await axios.post(`${API_URL}/students/register`, studentData);
  return response.data;
};

// Obtener todos los estudiantes
export const getStudents = async () => {
  const response = await axios.get(`${API_URL}/students`);
  return response.data;
};

// Obtener un estudiante por ID
export const getStudentById = async (id) => {
  const response = await axios.get(`${API_URL}/students/${id}`);
  return response.data;
};

// Obtener las materias de un estudiante por ID
export const getStudentSubjects = async (studentId) => {
  const response = await axios.get(`${API_URL}/studentsubjects/student/${studentId}`);
  return response.data;
};

// Obtener los compañeros de clase para una materia por ID de materia
export const getClassmatesBySubject = async (subjectsid) => {
  const response = await axios.get(`${API_URL}/Subjects/${subjectsid}/classmates`);
  return response.data;
};
