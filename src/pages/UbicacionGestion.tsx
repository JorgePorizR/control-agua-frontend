import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  listDepartamentos,
  listMunicipios,
  listComunidades,
  type Departamento,
  type Municipio,
  type Comunidad,
} from "../services/ubicacionService";
import DepartamentoModal from "../components/DepartamentoModal";
import MunicipioModal from "../components/MunicipioModal";
import ComunidadModal from "../components/ComunidadModal";
import EditDepartamentoModal from "../components/EditDepartamentoModal";
import EditMunicipioModal from "../components/EditMunicipioModal";
import EditComunidadModal from "../components/EditComunidadModal";

const WaterDropIcon = () => (
  <svg
    className="inline-block align-middle mr-2"
    width="28"
    height="28"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 4C24 4 10 20.5 10 30C10 38.2843 16.7157 45 25 45C33.2843 45 40 38.2843 40 30C40 20.5 24 4 24 4Z"
      fill="url(#paint0_linear)"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="24"
        y1="4"
        x2="24"
        y2="45"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#38bdf8" />
        <stop offset="1" stopColor="#0ea5e9" />
      </linearGradient>
    </defs>
  </svg>
);

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

type Section = "departamentos" | "municipios" | "comunidades";

const UbicacionGestion: React.FC = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [comunidades, setComunidades] = useState<Comunidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<Section>("departamentos");

  const [modalDepartamentoOpen, setModalDepartamentoOpen] = useState(false);
  const [modalMunicipioOpen, setModalMunicipioOpen] = useState(false);
  const [modalComunidadOpen, setModalComunidadOpen] = useState(false);
  const [editDepartamentoModalOpen, setEditDepartamentoModalOpen] = useState(false);
  const [editMunicipioModalOpen, setEditMunicipioModalOpen] = useState(false);
  const [editComunidadModalOpen, setEditComunidadModalOpen] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] = useState<Departamento | null>(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(null);
  const [selectedComunidad, setSelectedComunidad] = useState<Comunidad | null>(null);

  const fetchDepartamentos = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listDepartamentos();
      setDepartamentos(data);
    } catch {
      setError("No se pudieron cargar los departamentos");
    } finally {
      setLoading(false);
    }
  };

  const fetchMunicipios = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listMunicipios();
      setMunicipios(data);
    } catch {
      setError("No se pudieron cargar los municipios");
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

  useEffect(() => {
    if (activeSection === "departamentos") {
      fetchDepartamentos();
    } else if (activeSection === "municipios") {
      fetchMunicipios();
    } else if (activeSection === "comunidades") {
      fetchComunidades();
    }
  }, [activeSection]);

  const getDepartamentoById = (id: number) => {
    return departamentos.find((d) => d.id_departamento === id);
  }
  
  const getMunicipioById = (id: number) => {
    return municipios.find((m) => m.id_municipio === id);
  }

  /*const getComunidadById = (id: number) => {
    return comunidades.find((c) => c.id_comunidad === id);
  }*/

  const handleEditDepartamento = (departamento: Departamento) => {
    setSelectedDepartamento(departamento);
    setEditDepartamentoModalOpen(true);
  };

  const handleEditMunicipio = (municipio: Municipio) => {
    setSelectedMunicipio(municipio);
    setEditMunicipioModalOpen(true);
  };

  const handleEditComunidad = (comunidad: Comunidad) => {
    setSelectedComunidad(comunidad);
    setEditComunidadModalOpen(true);
  };

  const renderDepartamentosTable = () => (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <button
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors"
          title="Agregar Departamento"
          onClick={() => setModalDepartamentoOpen(true)}
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
            <th className="py-3 px-4 rounded-tr-lg">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {departamentos.map((departamento) => (
            <tr
              key={departamento.id_departamento}
              className="even:bg-blue-50 hover:bg-cyan-100 transition-colors"
            >
              <td className="py-2 px-4 text-center font-mono">
                {departamento.id_departamento}
              </td>
              <td className="py-2 px-4">{departamento.nombre}</td>
              <td className="py-2 px-4">{departamento.descripcion}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleEditDepartamento(departamento)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Editar"
                >
                  <EditIcon />
                </button>
              </td>
            </tr>
          ))}
          {departamentos.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-blue-400">
                No hay departamentos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderMunicipiosTable = () => (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <button
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors"
          title="Agregar Municipio"
          onClick={() => setModalMunicipioOpen(true)}
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
            <th className="py-3 px-4">Departamento</th>
            <th className="py-3 px-4 rounded-tr-lg">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {municipios.map((municipio) => (
            <tr
              key={municipio.id_municipio}
              className="even:bg-blue-50 hover:bg-cyan-100 transition-colors"
            >
              <td className="py-2 px-4 text-center font-mono">
                {municipio.id_municipio}
              </td>
              <td className="py-2 px-4">{municipio.nombre}</td>
              <td className="py-2 px-4">{municipio.descripcion}</td>
              <td className="py-2 px-4 text-center">
                <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                  {getDepartamentoById(municipio.id_departamento)?.nombre || "N/A"}
                </span>
              </td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleEditMunicipio(municipio)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Editar"
                >
                  <EditIcon />
                </button>
              </td>
            </tr>
          ))}
          {municipios.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-blue-400">
                No hay municipios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderComunidadesTable = () => (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <button
          className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors"
          title="Agregar Comunidad"
          onClick={() => setModalComunidadOpen(true)}
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
            <th className="py-3 px-4">Municipio</th>
            <th className="py-3 px-4 rounded-tr-lg">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comunidades.map((comunidad) => (
            <tr
              key={comunidad.id_comunidad}
              className="even:bg-blue-50 hover:bg-cyan-100 transition-colors"
            >
              <td className="py-2 px-4 text-center font-mono">
                {comunidad.id_comunidad}
              </td>
              <td className="py-2 px-4">{comunidad.nombre}</td>
              <td className="py-2 px-4">{comunidad.descripcion}</td>
              <td className="py-2 px-4 text-center">
                <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                  {getMunicipioById(comunidad.id_municipio)?.nombre || "N/A"}
                </span>
              </td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleEditComunidad(comunidad)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Editar"
                >
                  <EditIcon />
                </button>
              </td>
            </tr>
          ))}
          {comunidades.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-blue-400">
                No hay comunidades registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const getSectionTitle = () => {
    switch (activeSection) {
      case "departamentos":
        return "Departamentos";
      case "municipios":
        return "Municipios";
      case "comunidades":
        return "Comunidades";
      default:
        return "Ubicaciones";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-200 flex flex-col items-center relative">
      <Navbar />
      <div className="py-10 w-full max-w-6xl px-4">
        {/* Botones de navegación */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setActiveSection("departamentos")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeSection === "departamentos"
                ? "bg-sky-500 text-white shadow-lg"
                : "bg-white/80 text-sky-700 hover:bg-white hover:shadow-md"
            }`}
          >
            Departamentos
          </button>
          <button
            onClick={() => setActiveSection("municipios")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeSection === "municipios"
                ? "bg-sky-500 text-white shadow-lg"
                : "bg-white/80 text-sky-700 hover:bg-white hover:shadow-md"
            }`}
          >
            Municipios
          </button>
          <button
            onClick={() => setActiveSection("comunidades")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeSection === "comunidades"
                ? "bg-sky-500 text-white shadow-lg"
                : "bg-white/80 text-sky-700 hover:bg-white hover:shadow-md"
            }`}
          >
            Comunidades
          </button>
        </div>

        {/* Contenido de la tabla */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 p-8">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center flex items-center justify-center">
            <WaterDropIcon /> Gestión de {getSectionTitle()}
          </h2>

          {error && (
            <div className="mb-4 text-red-500 text-center font-semibold">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-blue-500 text-center font-bold">
              Cargando {getSectionTitle().toLowerCase()}...
            </div>
          ) : (
            <>
              {activeSection === "departamentos" && renderDepartamentosTable()}
              {activeSection === "municipios" && renderMunicipiosTable()}
              {activeSection === "comunidades" && renderComunidadesTable()}
            </>
          )}
        </div>
        <DepartamentoModal
          isOpen={modalDepartamentoOpen}
          onClose={() => setModalDepartamentoOpen(false)}
          onDepartamentoCreated={fetchDepartamentos}
        />
        <MunicipioModal
          isOpen={modalMunicipioOpen}
          onClose={() => setModalMunicipioOpen(false)}
          onMunicipioCreated={fetchMunicipios}
        />
        <ComunidadModal
          isOpen={modalComunidadOpen}
          onClose={() => setModalComunidadOpen(false)}
          onComunidadCreated={fetchComunidades}
        />
        <EditDepartamentoModal
          isOpen={editDepartamentoModalOpen}
          onClose={() => setEditDepartamentoModalOpen(false)}
          departamento={selectedDepartamento}
          onDepartamentoUpdated={fetchDepartamentos}
        />
        <EditMunicipioModal
          isOpen={editMunicipioModalOpen}
          onClose={() => setEditMunicipioModalOpen(false)}
          municipio={selectedMunicipio}
          onMunicipioUpdated={fetchMunicipios}
        />
        <EditComunidadModal
          isOpen={editComunidadModalOpen}
          onClose={() => setEditComunidadModalOpen(false)}
          comunidad={selectedComunidad}
          onComunidadUpdated={fetchComunidades}
        />
      </div>
    </div>
  );
};

export default UbicacionGestion;
