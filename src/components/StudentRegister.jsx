import React, { useState, useEffect } from "react";
import { getSubjects, registerStudent } from "../services/api";
import { CheckCircle, AlertCircle } from "lucide-react";

const StudentRegister = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cedula, setCedula] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Error al obtener las materias:", error);
        setMessage("No se pudieron cargar las materias.");
      }
    };

    fetchSubjects();
  }, []);

  const validateSubjects = () => {
    const selectedSubjectsData = subjects.filter((subject) =>
      selectedSubjects.includes(subject.id.toString())
    );
    const professorIds = selectedSubjectsData.map((subject) => subject.professorId);
    const uniqueProfessors = new Set(professorIds);
    return uniqueProfessors.size === 3;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !cedula.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      setMessage("❌ Todos los campos son obligatorios.");
      return;
    }

    if (selectedSubjects.length !== 3) {
      setMessage("❌ Debes seleccionar exactamente 3 materias.");
      return;
    }

    if (!validateSubjects()) {
      setMessage("❌ Las materias deben tener profesores distintos.");
      return;
    }

    const studentData = {
      firstName,
      lastName,
      cedula,
      email,
      phone,
      subjectIds: selectedSubjects,
    };

    try {
      await registerStudent(studentData);
      setMessage("✅ Estudiante registrado con éxito.");
      setFirstName("");
      setLastName("");
      setCedula("");
      setEmail("");
      setPhone("");
      setSelectedSubjects([]);
    } catch (error) {
      console.error("Error al registrar el estudiante:", error);
      const backendMessage =
        error?.response?.data?.message || "❌ Hubo un error al registrar el estudiante.";
      setMessage(`❌ ${backendMessage}`);
    }
  };

  const toggleSubject = (id) => {
    setSelectedSubjects((prev) =>
      prev.includes(id)
        ? prev.filter((sid) => sid !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Formulario de Registro</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos personales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="p-3 border rounded shadow-sm focus:outline-blue-500"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="p-3 border rounded shadow-sm focus:outline-blue-500"
          />
          <input
            type="text"
            placeholder="Cédula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            className="p-3 border rounded shadow-sm focus:outline-blue-500"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded shadow-sm focus:outline-blue-500"
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 border rounded shadow-sm focus:outline-blue-500"
          />
        </div>

        {/* Materias */}
        <div>
          <p className="font-semibold mb-2 text-gray-700">
            Selecciona <span className="text-blue-600">3 materias</span> con profesores distintos:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => {
              const selected = selectedSubjects.includes(subject.id.toString());
              return (
                <div
                  key={subject.id}
                  onClick={() => toggleSubject(subject.id.toString())}
                  className={`cursor-pointer p-4 border rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                    selected ? "bg-blue-50 border-blue-600" : "bg-white"
                  }`}
                >
                  <h4 className="font-bold text-md">{subject.name}</h4>
                  <p className="text-sm text-gray-600">{subject.professorName}</p>
                  {selected && (
                    <div className="text-green-600 text-sm mt-2 flex items-center gap-1">
                      <CheckCircle size={16} /> Seleccionada
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
        >
          Registrar Estudiante
        </button>

        {/* Mensaje */}
        {message && (
          <div
            className={`mt-4 p-3 rounded-md text-sm flex items-center gap-2 ${
              message.includes("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.includes("✅") ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentRegister;
