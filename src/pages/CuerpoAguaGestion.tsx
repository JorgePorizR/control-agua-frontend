import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  listCuerposAgua,
  type CuerpoAgua,
  listCuerposAguaByDepartamentoId,
  listCuerposAguaByMunicipioId,
} from "../services/cuerpoAguaService";
import {
  listComunidades,
  type Comunidad,
} from "../services/ubicacionService";
import CuerpoAguaModal from "../components/CuerpoAguaModal";
import EditCuerpoAguaModal from "../components/EditCuerpoAguaModal";
import { useNavigate } from "react-router-dom";
import {
  listDepartamentos,
  type Departamento,
  listMunicipios,
  type Municipio,
} from "../services/ubicacionService";

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

const ImgIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
    />
  </svg>
);

const CuerpoAguaGestion: React.FC = () => {
  const [cuerposAgua, setCuerposAgua] = useState<CuerpoAgua[]>([]);
  const [comunidades, setComunidades] = useState<Comunidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCuerpoAgua, setSelectedCuerpoAgua] =
    useState<CuerpoAgua | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] = useState<number | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<number | null>(null);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  const navigate = useNavigate();

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
  };

  const fetchDepartamentos = async () => {
    try {
      const data = await listDepartamentos();
      setDepartamentos(data);
    } catch {
      setError("No se pudieron cargar los departamentos");
    }
  };

  const fetchMunicipios = async () => {
    try {
      const data = await listMunicipios();
      setMunicipios(data);
    } catch {
      setError("No se pudieron cargar los municipios");
    }
  };

  useEffect(() => {
    fetchCuerposAgua();
    fetchComunidades();
    fetchDepartamentos();
    fetchMunicipios();
  }, []);

  const getComunidadById = (id: number) => {
    return comunidades.find((comunidad) => comunidad.id_comunidad === id);
  };

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

  const handleDepartamentoChange = async (departamentoId: number | null) => {
    setSelectedDepartamento(departamentoId);
    setSelectedMunicipio(null); // Reset Municipio filter

    if (departamentoId !== null) {
      try {
        const data = await listCuerposAguaByDepartamentoId(departamentoId);
        setCuerposAgua(data);
      } catch {
        setError("No se pudieron cargar los cuerpos de agua por departamento");
      }
    } else {
      fetchCuerposAgua(); // Reset to all Cuerpos de Agua
    }
  };

  const handleMunicipioChange = async (municipioId: number | null) => {
    setSelectedMunicipio(municipioId);
    setSelectedDepartamento(null); // Reset Departamento filter

    if (municipioId !== null) {
      try {
        const data = await listCuerposAguaByMunicipioId(municipioId);
        setCuerposAgua(data);
      } catch {
        setError("No se pudieron cargar los cuerpos de agua por municipio");
      }
    } else {
      fetchCuerposAgua(); // Reset to all Cuerpos de Agua
    }
  };

  const renderFilters = () => (
    <div className="flex gap-4 mb-4">
      <select
        value={selectedDepartamento ?? ""}
        onChange={(e) => handleDepartamentoChange(e.target.value ? Number(e.target.value) : null)}
        className="border rounded px-4 py-2"
      >
        <option value="">Todos los Departamentos</option>
        {departamentos.map((dep) => (
          <option key={dep.id_departamento} value={dep.id_departamento}>
            {dep.nombre}
          </option>
        ))}
      </select>

      <select
        value={selectedMunicipio ?? ""}
        onChange={(e) => handleMunicipioChange(e.target.value ? Number(e.target.value) : null)}
        className="border rounded px-4 py-2"
      >
        <option value="">Todos los Municipios</option>
        {municipios.map((mun) => (
          <option key={mun.id_municipio} value={mun.id_municipio}>
            {mun.nombre}
          </option>
        ))}
      </select>
    </div>
  );

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
              <td className="py-2 px-4 text-center">
                <span>{cuerpo.latitud}</span>,<span>{cuerpo.longitud}</span>
              </td>
              <td className="py-2 px-4">{cuerpo.ubicacion_descripcion}</td>
              <td className="py-2 px-4">
                {new Date(cuerpo.fecha_registro).toLocaleDateString("es-ES")}
              </td>
              <td className="py-2 px-4">
                {cuerpo.id_comunidad
                  ? getComunidadById(cuerpo.id_comunidad)?.nombre
                  : "N/A"}
              </td>
              <td className="py-2 px-4 text-center gap-2 flex justify-center">
                <button
                  onClick={() => handleEditModalOpen(cuerpo)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Editar Cuerpo de Agua"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() =>
                    navigate(`/cuerpos-agua/${cuerpo.id_cuerpo_agua}`)
                  }
                  className="text-green-500 hover:text-green-700"
                  title="Ver Galería"
                >
                  <ImgIcon />
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
            <>
              {renderFilters()}
              {renderCuerposAguaTable()}
            </>
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
