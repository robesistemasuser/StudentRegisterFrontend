import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { UserPlus, List, AlertTriangle } from 'lucide-react';
import StudentList from './components/StudentList';
import StudentRegister from './components/StudentRegister';
import StudentDetail from './components/StudentDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <header className="bg-white shadow">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Gestión de Estudiantes</h1>
            <nav className="space-x-4">
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-600 hover:bg-blue-100'
                  }`
                }
              >
                <UserPlus size={18} />
                Registrar
              </NavLink>
              <NavLink
                to="/students"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-600 hover:bg-blue-100'
                  }`
                }
              >
                <List size={18} />
                Estudiantes
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<StudentList />} />
            <Route path="/register" element={<StudentRegister />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/student/:id" element={<StudentDetail />} />
            <Route
              path="*"
              element={
                <div className="flex items-center text-red-600 space-x-2 mt-8">
                  <AlertTriangle size={20} />
                  <span>Página no encontrada (404)</span>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
