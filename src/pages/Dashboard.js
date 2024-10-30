import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import CourseForm from "../components/CourseForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchCourses(user.uid);
      } else {
        navigate("/"); // Redirigir si no está autenticado
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchCourses = async (userId) => {
    try {
      const coursesCollection = collection(db, "courses");
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = coursesSnapshot.docs
        .filter(doc => doc.data().userId === userId)
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesList);
    } catch (error) {
      console.error("Error fetching courses: ", error);
    } 
  };

  const saveCourse = async (courseData) => {
    // Validar que el usuario esté autenticado
    if (!user) {
      console.error("User not authenticated");
      return;
    }
  
    // Validar que los campos obligatorios estén llenos
    if (!courseData.title || !courseData.description) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }
  
    console.log("Course data to save:", courseData);
  
    try {
      if (editingCourse && editingCourse.id) {
        const courseDoc = doc(db, "courses", editingCourse.id);
        await updateDoc(courseDoc, { ...courseData, userId: user.uid });
        setEditingCourse(null);
      } else {
        await addDoc(collection(db, "courses"), { ...courseData, userId: user.uid });
      }
      fetchCourses(user.uid); // Actualiza la lista de cursos
    } catch (error) {
      console.error("Error saving course: ", error);
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await deleteDoc(doc(db, "courses", courseId));
      fetchCourses(user.uid);
    } catch (error) {
      console.error("Error deleting course: ", error);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl">Panel de Carga de Información</h1>
      {user && <p>Bienvenido, {user.email}</p>}

      <button
        onClick={() => setEditingCourse({})} 
        className="my-4 p-2 bg-blue-500 text-white rounded"
      >
        Crear Curso
      </button>

      <CourseForm show={editingCourse} onClose={() => setEditingCourse(false)} 
         onSave={saveCourse} />

      <ul>
        {courses.map(course => (
          <li key={course.id} className="border p-4 my-2 flex justify-between">
            <div>
              <h2 className="text-xl"><strong>{course.title}</strong></h2>
              <p><strong>Dirección:</strong> {course.address}</p>
              <p><strong>Fecha de Inicio:</strong> {course.startDate}</p>
              <p><strong>Fecha de Finalización:</strong> {course.endDate}</p>
              <p><strong>Días y Horarios:</strong> {course.daysAndHours}</p>
              <p><strong>Link:</strong> {course.institutionLink}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingCourse(course)} 
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
      {editingCourse && (
              <CourseForm 
                show={Boolean(editingCourse)}
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
