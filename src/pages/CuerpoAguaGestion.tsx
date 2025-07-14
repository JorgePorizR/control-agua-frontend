import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { listCuerposAgua, type CuerpoAgua } from "../services/cuerpoAguaService";
import { listComunidades, type Comunidad } from "../services/ubicacionService";
import CuerpoAguaModal from "../components/CuerpoAguaModal";
import EditCuerpoAguaModal from "../components/EditCuerpoAguaModal";

const PlusCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="12" fill="#38bdf8" />
    <path
      d="M12 7v10M7 12h10"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
);

const CuerpoAguaGestion: React.FC = () => {
  const [cuerposAgua, setCuerposAgua] = useState<CuerpoAgua[]>([]);
  const [comunidades, setComunidades] = useState<Comunidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCuerpoAgua, setSelectedCuerpoAgua] = useState<CuerpoAgua | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchCuerposAgua = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listCuerposAgua();
      setCuerposAgua(data);
    } catch {
      setError("No se pudieron cargar los cuerpos de agua");
    } finally {
      setLoading(false);
    }
  };

  const fetchComunidades = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listComunidades();
      setComunidades(data);
    } catch {
      setError("No se pudieron cargar las comunidades");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCuerposAgua();
    fetchComunidades();
  }, []);

  const getComunidadById = (id: number) => {
    return comunidades.find(comunidad => comunidad.id_comunidad === id);
  }

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleCuerpoAguaCreated = () => {
    fetchCuerposAgua();
  };

  const handleEditModalOpen = (cuerpoAgua: CuerpoAgua) => {
    setSelectedCuerpoAgua(cuerpoAgua);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setSelectedCuerpoAgua(null);
    setIsEditModalOpen(false);
  };

  const handleCuerpoAguaUpdated = () => {
    fetchCuerposAgua();
  };

  const renderCuerposAguaTable = () => (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <button
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors"
          title="Agregar Departamento"
          onClick={() => handleModalOpen()}
        >
          <PlusCircle />
        </button>
      </div>
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gradient-to-r from-sky-400 to-cyan-500 text-white">
            <th className="py-3 px-4 rounded-tl-lg">ID</th>
            <th className="py-3 px-4">Nombre</th>
            <th className="py-3 px-4">Descripción</th>
            <th className="py-3 px-4">Tipo</th>
            <th className="py-3 px-4">Lat / Lng</th>
            <th className="py-3 px-4">Ubicación</th>
            <th className="py-3 px-4">Fecha Registro</th>
            <th className="py-3 px-4">Comunidad</th>
            <th className="py-3 px-4 rounded-tr-lg">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuerposAgua.map((cuerpo) => (
            <tr
              key={cuerpo.id_cuerpo_agua}
              className="even:bg-blue-50 hover:bg-cyan-100 transition-colors"
            >
              <td className="py-2 px-4 text-center font-mono">
                {cuerpo.id_cuerpo_agua}
              </td>
              <td className="py-2 px-4">{cuerpo.nombre}</td>
              <td className="py-2 px-4">{cuerpo.descripcion}</td>
              <td className="py-2 px-4">{cuerpo.tipo}</td>
              <td className="py-2 px-4 text-center"><span>{cuerpo.latitud}</span>,<span>{cuerpo.longitud}</span></td>
              <td className="py-2 px-4">{cuerpo.ubicacion_descripcion}</td>
              <td className="py-2 px-4">{new Date(cuerpo.fecha_registro).toLocaleDateString("es-ES")}</td>
              <td className="py-2 px-4">
                {cuerpo.id_comunidad ? getComunidadById(cuerpo.id_comunidad)?.nombre : "N/A"}
              </td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleEditModalOpen(cuerpo)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Editar Cuerpo de Agua"
                >
                  <EditIcon />
                </button>
              </td>
            </tr>
          ))}
          {cuerposAgua.length === 0 && (
            <tr>
              <td colSpan={8} className="py-6 text-center text-blue-400">
                No hay cuerpos de agua registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-200 flex flex-col items-center relative">
      <Navbar />
      <div className="py-10 w-full max-w-6xl px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 p-8">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center flex items-center justify-center">
            Gestión de Cuerpos de Agua
          </h2>
          {error && (
            <div className="mb-4 text-red-500 text-center font-semibold">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-blue-500 text-center font-bold">
              Cargando cuerpos de agua...
            </div>
          ) : (
            renderCuerposAguaTable()
          )}
          
        </div>
          <CuerpoAguaModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onCuerpoAguaCreated={handleCuerpoAguaCreated}
          />
          <EditCuerpoAguaModal
            isOpen={isEditModalOpen}
            onClose={handleEditModalClose}
            cuerpoAgua={selectedCuerpoAgua}
            onCuerpoAguaUpdated={handleCuerpoAguaUpdated}
          />
      </div>
    </div>
  );
};

export default CuerpoAguaGestion;