import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStudentById, getStudentSubjects, getClassmatesBySubject } from '../services/api'; // Importa las funciones

function StudentDetail() {
  const { id } = useParams(); // ID del estudiante de la URL
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [classmates, setClassmates] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Obtener el estudiante con todos los detalles
        const studentData = await getStudentById(id);
        setStudent(studentData);

        // Obtener las materias del estudiante
        const subjectsData = await getStudentSubjects(id);
        setSubjects(subjectsData);

        // Para cada materia, obtener los compañeros
        const classmatesData = {};
        for (const subject of subjectsData) {
          const classmatesDataForSubject = await getClassmatesBySubject(subject.id);
          classmatesData[subject.id] = classmatesDataForSubject.filter(s => s.id !== parseInt(id)); // Excluir al mismo estudiante
        }
        setClassmates(classmatesData);

      } catch (err) {
        console.error('Error al cargar detalles del estudiante:', err);
        setError('No se pudo cargar la información.');
      }
    };

    fetchStudentData();
  }, [id]);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!student) {
    return <p>Cargando estudiante...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Perfil de {student.firstName} {student.lastName}</h2>

      {/* Información básica del estudiante */}
      <div className="space-y-6">
        <div>
          <p><strong>Nombre:</strong> {student.firstName} {student.lastName}</p>
          <p><strong>Cédula:</strong> {student.cedula}</p>
          <p><strong>Correo:</strong> {student.email}</p>
          <p><strong>Teléfono:</strong> {student.phone}</p>
        </div>

        {/* Materias inscritas */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Materias inscritas:</h3>
          <ul className="list-disc list-inside">
            {subjects.map(subject => (
              <li key={subject.id}>
                <div>
                  <strong>{subject.name}</strong> (Profesor: {subject.professorName})
                  {/* Mostrar compañeros de clase */}
                  <ul className="ml-4 list-square list-inside text-sm text-gray-700 mt-1">
                    {classmates[subject.id]?.length > 0 ? (
                      classmates[subject.id].map(classmate => (
                        <li key={classmate.id}>{classmate.firstName} {classmate.lastName}</li>
                      ))
                    ) : (
                      <li>No hay compañeros en esta materia aún.</li>
                    )}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;
