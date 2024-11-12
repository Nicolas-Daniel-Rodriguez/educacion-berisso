import React, { useState, useEffect } from "react";
import LoginPopup from "../components/LoginPopup";
import logo1 from '../assets/img/Logo-gob-blanco.png';
import logo2 from '../assets/img/Logo-muni.png';
import { collection, getDocs } from "firebase/firestore"; // Asegúrate de que firestore esté configurado en Firebase
import { db } from "../firebase"; // Importa tu configuración de Firebase
import { PROFESSIONAL_FAMILIES } from "../constants";


import tecnologiaImg from "../assets/img/programacion.jpg";
import marketingImg from "../assets/img/marketing.jpg";
import administracionImg from "../assets/img/programacion.jpg";
import metalmecanicaImg from "../assets/img/programacion.jpg";


const Home = () => {
  const professionalFamilies = PROFESSIONAL_FAMILIES;
  const [showLogin, setShowLogin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFamily, setSelectedFamily] = useState(""); // Para manejar el filtro de familias
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const familyImages = {
    Salud: marketingImg,
    Informática: tecnologiaImg,
    Administración: administracionImg,
    Metalmecánica: metalmecanicaImg,
  };

  // Filtrar cursos según búsqueda por palabras clave y filtro por familia
  useEffect(() => {
    const fetchCourses = async () => {
      const today = new Date();
      const coursesRef = collection(db, "courses");
      const courseSnapshot = await getDocs(coursesRef);
      const coursesList = courseSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const filtered = coursesList
        .filter(course =>
          (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (selectedFamily === "" || course.professionalFamily === selectedFamily) &&
          new Date(course.endDate) > today
        )
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

      setFilteredCourses(filtered);
    };

    fetchCourses();
  }, [searchTerm, selectedFamily]);

  // Paginación
  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5; // Cambia a 3 o 5 según prefieras

    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    if (endPage - startPage < maxPageNumbersToShow - 1) {
      startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }

    // Flecha izquierda
    if (currentPage > 1) {
      pageNumbers.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="p-2 border"
        >
          ←
        </button>
      );
    }

    // Números de página
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`p-2 border ${currentPage === i ? 'bg-blue-500 text-white' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Flecha derecha
    if (currentPage < totalPages) {
      pageNumbers.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="p-2 border"
        >
          →
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="min-h-screen">
      {/* Imagen y título */}
      <div className="relative w-full h-96 bg-cover bg-center" style={{
        backgroundImage: `url(${require('../assets/img/portada.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <h1 className="text-5xl text-white font-bold">Estudia en Berisso</h1>
          <p className="text-xl text-white mt-4">Capacitate en tu ciudad</p>
        </div>
      </div>

      {/* Franja con título y logos */}
      <div className="flex items-center  justify-evenly bg-blue-500 p-4 space-x-8">
        <h1 className="text-2xl font-bold text-white ">Coordinación de Políticas <br />Socioeducativas</h1>
        <img src={logo1} alt="Logo Secretaria de Gobierno" className="h-16 mx-8" />
        <img src={logo2} alt="Logo Municipalidad de Berisso" className="h-16 mx-8" />
      </div>

      {/* Botón de Inicio de Sesión */}
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setShowLogin(true)}
          className="bg-blue-500 text-white p-3 rounded"
        >
          Iniciar Sesión
        </button>
      </div>

      <LoginPopup show={showLogin} onClose={() => setShowLogin(false)} />

      {/* Descripción breve */}
      <div className="p-6 text-center">
        <p className="text-lg">Aquí podrás buscar toda la oferta educativa de la ciudad, filtrar por familias profesionales y buscar cursos por palabras clave.</p>
      </div>

      {/* Filtro y buscador */}
      <div className="p-6 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Filtro por familias profesionales */}
        <select
          value={selectedFamily}
          onChange={(e) => setSelectedFamily(e.target.value)}
          className="p-2 border"
        >
           <option value="">Todas las familias profesionales</option>
        {professionalFamilies.map((family) => (
          <option key={family} value={family}>
            {family}
          </option>
        ))}
      </select>

        {/* Buscador de palabras */}
        <input
          type="text"
          placeholder="Buscar por palabras clave"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border w-96"
        />
      </div>

      {/* Cuadrícula de cursos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {currentCourses.map((course) => (
          <div key={course.id} className="border p-4 rounded shadow">
            <img src={familyImages[course.professionalFamily] || marketingImg } alt={course.title} className="h-40 w-full object-cover rounded mb-4" />
            <h2 className="text-xl font-bold mb-2">{course.title}</h2>
            <p className="text-sm text-gray-700">{course.description}</p>
            <p className="text-sm text-gray-600"><strong>Institución:</strong> {course.institution}</p>
            <p className="text-sm text-gray-600"><strong>Dirección:</strong> {course.address}</p>
            <p className="text-sm text-gray-600"><strong>Fecha de inicio:</strong> {course.startDate}</p>
            <p className="text-sm text-gray-600"><strong>Fecha de fin:</strong> {course.endDate}</p>
            <p className="text-sm text-gray-600"><strong>Días y horarios:</strong> {course.daysAndHours}</p>
            <p className="text-sm text-gray-600"><strong>Familia Profesional:</strong> {course.professionalFamily}</p>
            <a href={course.institutionLink} className="text-blue-500 mt-2 inline-block">Más información</a>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-5">
        {renderPageNumbers()}
      </div>
    </div>
  );
};

export default Home;
