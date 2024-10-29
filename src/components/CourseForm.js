import React, { useEffect, useState } from "react";

const CourseForm = ({ show, onClose, courseData, onSave }) => {
  const [courseInfo, setCourseInfo] = useState({
    title: "",
    description: "",
    institution: "",
    address: "",
    startDate: "",
    endDate: "",
    daysAndHours: "",
    institutionLink: "",
    professionalFamily: "",
  });

  const professionalFamilies = [
    "Metalmecánica",
    "Informática",
    "Salud",
    "Administración",
  ];

  useEffect(() => {
    if (courseData) {
      setCourseInfo(courseData);
    } else {
      // Limpia el formulario cuando no hay datos del curso
      resetForm();
    }
  }, [courseData, show]); // Agregar `show` para reiniciar el formulario al cerrar

  const resetForm = () => {
    setCourseInfo({
      title: "",
      description: "",
      institution: "",
      address: "",
      startDate: "",
      endDate: "",
      daysAndHours: "",
      institutionLink: "",
      professionalFamily: "",
    });
  };

  const handleChange = (e) => {
    setCourseInfo({
      ...courseInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(courseInfo);
    resetForm(); // Limpia el formulario después de guardar
    onClose(); // Cierra el formulario
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80%] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{courseData ? "Editar Curso" : "Nuevo Curso"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(courseInfo).map((field) => {
            if (field === "professionalFamily") {
              return (
                <div key={field} className="flex flex-col">
                  <label className="text-gray-700 capitalize">Familia Profesional</label>
                  <select
                    name={field}
                    value={courseInfo[field]}
                    onChange={handleChange}
                    className="p-2 border rounded"
                    required
                  >
                    <option value="">Selecciona una familia</option>
                    {professionalFamilies.map((family) => (
                      <option key={family} value={family}>
                        {family}
                      </option>
                    ))}
                  </select>
                </div>
              );
            } else {
              return (
                <div key={field} className="flex flex-col">
                  <label className="text-gray-700 capitalize">{field}</label>
                  <input
                    type={field.includes("Date") ? "date" : "text"}
                    name={field}
                    value={courseInfo[field]}
                    onChange={handleChange}
                    className="p-2 border rounded"
                    required
                  />
                </div>
              );
            }
          })}
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
