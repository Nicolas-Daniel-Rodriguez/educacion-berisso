import { useEffect, useState } from "react";
import { auth, db } from "../firebase"; // Asegúrate de que 'db' esté configurado en firebase.js para la base de datos
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import CourseForm from "../components/CourseForm"; // Importa el componente del formulario

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchCourses(user.uid); // Cargar los cursos del usuario
      } else {
        //navigate("/"); // Redirigir si no está autenticado
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Función para obtener los cursos del usuario
  const fetchCourses = async (userId) => {
    const coursesCollection = collection(db, "courses"); // Reemplaza "courses" con el nombre de tu colección en Firebase
    const coursesSnapshot = await getDocs(coursesCollection);
    const coursesList = coursesSnapshot.docs
      .filter(doc => doc.data().userId === userId)
      .map(doc => ({ id: doc.id, ...doc.data() }));
    setCourses(coursesList);
  };

  // Función para agregar o actualizar un curso
  const saveCourse = async (courseData) => {
    if (editingCourse) {
      // Actualizar curso
      const courseDoc = doc(db, "courses", editingCourse.id);
      await updateDoc(courseDoc, courseData);
      setEditingCourse(null);
    } else {
      // Crear nuevo curso
      await addDoc(collection(db, "courses"), { ...courseData, userId: user.uid });
    }
    fetchCourses(user.uid); // Actualizar la lista de cursos
  };

  // Función para eliminar un curso
  const deleteCourse = async (courseId) => {
    await deleteDoc(doc(db, "courses", courseId));
    fetchCourses(user.uid); // Actualizar la lista de cursos
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl">Panel de Carga de Información</h1>
      {user && <p>Bienvenido, {user.email}</p>}

      <button
        onClick={() => {
          setEditingCourse(true); // Para crear un nuevo curso
        }}
        className="my-4 p-2 bg-blue-500 text-white rounded"
      >
        Crear Curso
      </button>

      <CourseForm show={editingCourse} onClose={() => setEditingCourse(false)} />

      <ul>
        {courses.map(course => (
          <li key={course.id} className="border p-4 my-2 flex justify-between">
            <div>
              <h2 className="text-xl">{course.title}</h2>
              <p>{course.description}</p>
              <p>{course.schedule}</p>
              <p>{course.institution}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingCourse(course)} // Cargar los datos del curso en el formulario
                className="p-2 bg-yellow-500 text-white rounded"
              >
                Editar
              </button>
              <button
                onClick={() => deleteCourse(course.id)}
                className="p-2 bg-red-500 text-white rounded"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Muestra el formulario como un popup si hay un curso editando */}
      {editingCourse !== null && (
        <CourseForm 
          onClose={() => setEditingCourse(null)} // Función para cerrar el formulario
          courseData={editingCourse} // Envío de datos del curso para editar
          onSave={saveCourse} // Pasar la función para guardar el curso
        />
      )}

      <button onClick={handleLogout} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded">
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Dashboard;
