import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { listSalidasCampo, type SalidaCampo, deleteSalidaCampo } from "../services/salidaCampoService";
import { getUserById, type Usuario } from "../services/userService";
import { getCuerpoAguaById, type CuerpoAgua } from "../services/cuerpoAguaService";
import CreateSalidaCampoModal from "../components/CreateSalidaCampoModal";
import EditSalidaCampoModal from "../components/EditSalidaCampoModal";
import { listMuestreos, type Muestreo } from "../services/muestreoService";

const SalidaCampoGestion: React.FC = () => {
  const [salidasCampo, setSalidasCampo] = useState<SalidaCampo[]>([]);
  const [usuarios, setUsuarios] = useState<Record<number, Usuario>>({});
  const [cuerposAgua, setCuerposAgua] = useState<Record<number, CuerpoAgua>>({});
  const [muestreos, setMuestreos] = useState<Muestreo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSalida, setSelectedSalida] = useState<SalidaCampo | null>(null);

  const fetchSalidasCampo = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listSalidasCampo();
      setSalidasCampo(data);

      // Fetch additional data for users and cuerpos de agua
      const usuariosMap: Record<number, Usuario> = {};
      const cuerposAguaMap: Record<number, CuerpoAgua> = {};

      for (const salida of data) {
        if (!usuariosMap[salida.id_usuario_creador]) {
          usuariosMap[salida.id_usuario_creador] = await getUserById(salida.id_usuario_creador);
        }

        for (const tecnicoId of salida.ids_tecnicos) {
          if (!usuariosMap[tecnicoId]) {
            usuariosMap[tecnicoId] = await getUserById(tecnicoId);
          }
        }

        for (const cuerpoAguaId of salida.ids_cuerpos_agua) {
          if (!cuerposAguaMap[cuerpoAguaId]) {
            cuerposAguaMap[cuerpoAguaId] = await getCuerpoAguaById(cuerpoAguaId);
          }
        }
      }

      setUsuarios(usuariosMap);
      setCuerposAgua(cuerposAguaMap);
    } catch {
      setError("No se pudieron cargar las salidas de campo");
    } finally {
      setLoading(false);
    }
  };

  const fetchMuestreos = async () => {
    try {
      const data = await listMuestreos();
      setMuestreos(data);
    } catch {
      setError("No se pudieron cargar los muestreos");
    }
  };

  useEffect(() => {
    fetchSalidasCampo();
    fetchMuestreos();
  }, []);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const handleSalidaCampoCreated = () => {
    handleModalClose();
    fetchSalidasCampo();
  };

  const handleEditModalOpen = (salida: SalidaCampo) => {
    setSelectedSalida(salida);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setSelectedSalida(null);
    setIsEditModalOpen(false);
  };

  const handleSalidaCampoUpdated = () => {
    handleEditModalClose();
    fetchSalidasCampo();
  };

  const handleDeleteSalidaCampo = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta salida de campo?")) {
      try {
        await deleteSalidaCampo(id);
        fetchSalidasCampo();
      } catch {
        alert("Error al eliminar la salida de campo");
      }
    }
  };

  const renderSalidasCampoTable = () => (
    <table className="min-w-full bg-white rounded-lg shadow-md">
      <thead>
        <tr className="bg-gradient-to-r from-sky-400 to-cyan-500 text-white">
          <th className="py-3 px-4">ID</th>
          <th className="py-3 px-4">Nombre</th>
          <th className="py-3 px-4">Descripción</th>
          <th className="py-3 px-4">Fecha Inicio</th>
          <th className="py-3 px-4">Fecha Fin</th>
          <th className="py-3 px-4">Estado</th>
          <th className="py-3 px-4">Creador</th>
          <th className="py-3 px-4">Técnicos</th>
          <th className="py-3 px-4">Cuerpos de Agua</th>
          <th className="py-3 px-4">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {salidasCampo.map((salida) => {
          const hasMuestreos = muestreos.some((muestreo) => muestreo.id_salida_campo === salida.id_salida_campo);
          return (
            <tr key={salida.id_salida_campo} className="even:bg-blue-50 hover:bg-cyan-100 transition-colors">
              <td className="py-2 px-4 text-center font-mono">{salida.id_salida_campo}</td>
              <td className="py-2 px-4">{salida.nombre}</td>
              <td className="py-2 px-4">{salida.descripcion}</td>
              <td className="py-2 px-4">{new Date(salida.fecha_inicio).toLocaleDateString("es-ES")}</td>
              <td className="py-2 px-4">{new Date(salida.fecha_fin).toLocaleDateString("es-ES")}</td>
              <td className="py-2 px-4">{salida.estado}</td>
              <td className="py-2 px-4">{usuarios[salida.id_usuario_creador]?.nombre || "N/A"}</td>
              <td className="py-2 px-4">
                {salida.ids_tecnicos.map((id) => usuarios[id]?.nombre).join(", ") || "N/A"}
              </td>
              <td className="py-2 px-4">
                {salida.ids_cuerpos_agua.map((id) => cuerposAgua[id]?.nombre).join(", ") || "N/A"}
              </td>
              <td className="py-2 px-4 text-center">
                {!hasMuestreos && (
                  <>
                    <button
                      onClick={() => handleEditModalOpen(salida)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteSalidaCampo(salida.id_salida_campo)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          );
        })}
        {salidasCampo.length === 0 && (
          <tr>
            <td colSpan={10} className="py-6 text-center text-blue-400">
              No hay salidas de campo registradas.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-200 flex flex-col items-center relative">
      <Navbar />
      <div className="py-10 w-full max-w-6xl px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 p-8">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center flex items-center justify-center">
            Gestión de Salidas de Campo
          </h2>
          {error && (
            <div className="mb-4 text-red-500 text-center font-semibold">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-blue-500 text-center font-bold">
              Cargando salidas de campo...
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleModalOpen}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors"
                >
                  Crear Salida de Campo
                </button>
              </div>
              {renderSalidasCampoTable()}
            </>
          )}
        </div>
      <CreateSalidaCampoModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSalidaCampoCreated={handleSalidaCampoCreated}
      />
      <EditSalidaCampoModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSalidaCampoUpdated={handleSalidaCampoUpdated}
        initialData={selectedSalida ? {
          id: selectedSalida.id_salida_campo,
          nombre: selectedSalida.nombre,
          descripcion: selectedSalida.descripcion,
          fecha_inicio: selectedSalida.fecha_inicio,
          fecha_fin: selectedSalida.fecha_fin,
          estado: selectedSalida.estado,
          ids_tecnicos: selectedSalida.ids_tecnicos,
          ids_cuerpos_agua: selectedSalida.ids_cuerpos_agua,
        } : {
          id: 0,
          nombre: "",
          descripcion: "",
          fecha_inicio: "",
          fecha_fin: "",
          estado: "PROGRAMADA",
          ids_tecnicos: [],
          ids_cuerpos_agua: [],
        }}
      />
      </div>
    </div>
  );
};

export default SalidaCampoGestion;
