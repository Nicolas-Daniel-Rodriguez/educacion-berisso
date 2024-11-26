import React, { useEffect, useState, useRef, /*useCallback*/ } from "react";
import { PROFESSIONAL_FAMILIES } from "../constants";

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

  useEffect(() => {
    if (show && courseData) {
      setCourseInfo({
        title: courseData.title || "",
        description: courseData.description || "",
        institution: courseData.institution || "",
        address: courseData.address || "",
        startDate: courseData.startDate || "",
        endDate: courseData.endDate || "",
        daysAndHours: courseData.daysAndHours || "",
        institutionLink: courseData.institutionLink || "",
        professionalFamily: courseData.professionalFamily || "",
      });
    }
  }, [courseData, show]);

  const formRef = useRef(null);
  const professionalFamilies = PROFESSIONAL_FAMILIES;

  const orderedFields = [
    "title",
    "description",
    "institution",
    "address",
    "startDate",
    "endDate",
    "daysAndHours",
    "institutionLink",
    "professionalFamily",
  ];

  const fieldLabels = {
    title: "Título",
    description: "Descripción",
    institution: "Institución",
    address: "Dirección",
    startDate: "Fecha de Inicio",
    endDate: "Fecha de Finalización",
    daysAndHours: "Días y Horarios",
    institutionLink: "Enlace de la Institución",
    professionalFamily: "Familia Profesional",
  };

  useEffect(() => {
    if (show && courseData) {
      setCourseInfo(courseData);
    }
  }, [courseData, show]);

  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show]);

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
    
    const emptyFields = Object.entries(courseInfo).some(
      ([key, value]) => !value && key !== "optionalField"
    );

    if (emptyFields) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    onSave(courseInfo);
    resetForm();
    onClose();
  };

  /*const handleClickOutside = useCallback(
    (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, handleClickOutside]);*/

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div
        ref={formRef}
        className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80%] overflow-y-auto"
      >

         {/* Botón de cierre (X) */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-black"
        aria-label="Cerrar formulario"
      >
        &#x2715;
      </button>

        <h2 className="text-xl font-semibold mb-4">
          {courseData ? "Editar Curso" : "Nuevo Curso"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {orderedFields.map((field) => {
            const labelText = fieldLabels[field] || field;

            if (field === "professionalFamily") {
              return (
                <div key={field} className="flex flex-col">
                  <label htmlFor={field} className="text-gray-700">
                    {labelText}
                  </label>
                  <select
                    id={field}
                    name={field}
                    value={courseInfo[field]}
                    onChange={handleChange}
                    className="p-2 border rounded"
                    required
                    autoComplete="off"
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
                  <label htmlFor={field} className="text-gray-700">
                    {labelText}
                  </label>
                  <input
                    id={field}
                    type={field.includes("Date") ? "date" : "text"}
                    name={field}
                    value={courseInfo[field]}
                    onChange={handleChange}
                    className="p-2 border rounded"
                    required
                    autoComplete={
                      field === "title"
                        ? "name"
                        : field === "address"
                        ? "street-address"
                        : "off"
                    }
                  />
                </div>
              );
            }
          })}
          <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
            Guardar
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="w-full p-2 mt-2 bg-gray-300 rounded"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
