import React, { useState, useEffect } from "react";
import {
  getStudents,
  getStudentSubjects,
  getClassmatesBySubject,
} from "../services/api";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState("");
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [classmatesBySubjectId, setClassmatesBySubjectId] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
        setMessage("No se pudieron cargar los estudiantes.");
      }
    };
    fetchStudents();
  }, []);

  const fetchStudentSubjects = async (studentId) => {
    try {
      const data = await getStudentSubjects(studentId);
      setSubjects(data);
    } catch (error) {
      console.error("Error al obtener las materias del estudiante:", error);
      setMessage("No se pudieron cargar las materias.");
    }
  };

  const fetchClassmates = async (subjectId) => {
    try {
      const data = await getClassmatesBySubject(subjectId);
      setClassmatesBySubjectId((prev) => ({
        ...prev,
        [subjectId]: prev[subjectId] ? null : data,
      }));
    } catch (error) {
      console.error("Error al obtener los compañeros:", error);
      setMessage("No se pudieron cargar los compañeros.");
    }
  };

  const toggleDetails = (studentId) => {
    if (expandedStudentId === studentId) {
      setExpandedStudentId(null);
      setSubjects([]);
      setClassmatesBySubjectId({});
    } else {
      setExpandedStudentId(studentId);
      fetchStudentSubjects(studentId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Estudiantes Registrados</h2>
      {message && <p className="text-sm text-red-600">{message}</p>}

      {students.length > 0 ? (
        students.map((student) => (
          <div key={student.id} className="mb-8 border-b pb-4">
            <h3 className="text-xl font-semibold">
              {student.firstName} {student.lastName}
            </h3>
            <p><strong>Cédula:</strong> {student.cedula}</p>
            <p><strong>Correo:</strong> {student.email}</p>
            <p><strong>Teléfono:</strong> {student.phone}</p>

            <button
              onClick={() => toggleDetails(student.id)}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {expandedStudentId === student.id
                ? "Ocultar Detalles"
                : "Ver Detalles de Materias"}
            </button>

            {expandedStudentId === student.id && (
              <div className="mt-4">
                {subjects.length > 0 ? (
                  <table className="w-full table-auto border mt-4">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="p-2 border">Materia</th>
                        <th className="p-2 border">Profesor</th>
                        <th className="p-2 border">Compañeros</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject) => (
                        <React.Fragment key={subject.id}>
                          <tr>
                            <td className="p-2 border">{subject.name}</td>
                            <td className="p-2 border">{subject.professorName}</td>
                            <td className="p-2 border">
                              <button
                                onClick={() => fetchClassmates(subject.id)}
                                className="text-sm text-green-600 hover:underline"
                              >
                                {classmatesBySubjectId[subject.id]
                                  ? "Ocultar"
                                  : "Ver Estudiantes por materia"}
                              </button>
                            </td>
                          </tr>

                          {classmatesBySubjectId[subject.id] && (
                            <tr>
                              <td colSpan={3} className="p-2 bg-gray-50">
                                {classmatesBySubjectId[subject.id].length > 0 ? (
                                  <ul className="list-disc ml-5">
                                    {classmatesBySubjectId[subject.id].map(
                                      (classmate, idx) => (
                                        <li key={idx}>{classmate.fullName}</li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  <p>No hay compañeros en esta materia.</p>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 mt-2">No se encontraron materias.</p>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No hay estudiantes registrados.</p>
      )}
    </div>
  );
};

export default StudentList;
