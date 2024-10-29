import React, { useEffect, useState } from "react";

const CourseForm = ({ show, onClose, courseData, onSave }) => {
  const [courseInfo, setCourseInfo] = useState({
    Titulo: "",
    Descripcion: "",
    Institucion: "",
    Direccion: "",
    Fecha_Inicio: "",
    Fecha_Fin: "",
    Dias_Y_Horarios: "",
    Link_Pagina_Institucion: "",
    Familia_Profesional: "",
  });

  useEffect(() => {
    if (courseData) {
      setCourseInfo(courseData);
    }
  }, [courseData]);

  const handleChange = (e) => {
    setCourseInfo({
      ...courseInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(courseInfo); // Llamar a la función para guardar el curso
    onClose(); // Cerrar el popup al enviar
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80%] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{courseData ? "Editar Curso" : "Nuevo Curso"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(courseInfo).map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-gray-700 capitalize">{field}</label>
              <input
                type={field === "startDate" || field === "endDate" ? "date" : "text"}
                name={field}
                value={courseInfo[field]}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
            </div>
          ))}
          <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
            Guardar
          </button>
          <button type="button" onClick={onClose} className="w-full p-2 mt-2 bg-gray-300 rounded">
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
