import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/"); // Redirigir si no está autenticado
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="p-4">
      <h1 className="text-2xl">Panel de Carga de Información</h1>
      {user && <p>Bienvenido, {user.email}</p>}
      {/* Aquí iría la lógica para cargar información */}
    </div>
  );
};

export default Dashboard;
