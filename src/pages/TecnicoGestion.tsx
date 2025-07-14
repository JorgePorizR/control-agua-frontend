import React, { useEffect, useState } from "react";
import { getSalidaTecnicoId, getSalidaCampo, type SalidaCampo } from "../services/salidaCampoService";
import {
  getCuerpoAguaById,
  type CuerpoAgua,
} from "../services/cuerpoAguaService";
import { getUserById, type Usuario } from "../services/userService";
import Navbar from "../components/Navbar";
import { getMuestreosByTecnico, type Muestreo, createMuestreo, updateMuestreo } from "../services/muestreoService";
import { useNavigate } from "react-router-dom";

// Modal para crear muestreo
interface CrearMuestreoModalProps {
  isOpen: boolean;
  onClose: () => void;
  salida: any | null;
  cuerposAgua: CuerpoAgua[];
  muestreos: Muestreo[];
  onMuestreoCreado: () => void;
}

const CrearMuestreoModal: React.FC<CrearMuestreoModalProps> = ({
  isOpen,
  onClose,
  salida,
  cuerposAgua,
  muestreos,
  onMuestreoCreado,
}) => {
  const [cuerpoAguaId, setCuerpoAguaId] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCuerpoAguaId("");
    setObservaciones("");
    setError("");
  }, [isOpen, salida]);

  if (!isOpen || !salida) return null;

  // Filtrar cuerpos de agua que ya tienen muestreo de este usuario en esta salida
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const idUsuario = user.id_usuario;
  const cuerposDisponibles = cuerposAgua.filter((cuerpo) => {
    return !muestreos.some(
      (m) =>
        m.id_salida_campo === salida.id_salida_campo &&
        m.id_cuerpo_agua === cuerpo.id_cuerpo_agua &&
        m.id_tecnico === idUsuario
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!cuerpoAguaId) {
        setError("Selecciona un cuerpo de agua disponible.");
        setLoading(false);
        return;
      }
      const nuevoMuestreo = {
        fecha_muestreo: new Date().toISOString(),
        observaciones,
        id_salida_campo: salida.id_salida_campo,
        id_cuerpo_agua: Number(cuerpoAguaId),
        id_tecnico: idUsuario,
      };
      await createMuestreo(nuevoMuestreo);
      onMuestreoCreado();
      onClose();
    } catch {
      setError("No se pudo crear el muestreo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-400 hover:text-blue-700 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Crear Muestreo</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {cuerposDisponibles.length === 0 ? (
          <div className="text-gray-500">Ya has muestreado todos los cuerpos de agua de esta salida.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Cuerpo de Agua</label>
              <select
                name="cuerpoAguaId"
                value={cuerpoAguaId}
                onChange={(e) => setCuerpoAguaId(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="" disabled>
                  Selecciona un cuerpo de agua
                </option>
                {cuerposDisponibles.map((cuerpo) => (
                  <option key={cuerpo.id_cuerpo_agua} value={cuerpo.id_cuerpo_agua}>
                    {cuerpo.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Observaciones</label>
              <textarea
                name="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creando..." : "Crear Muestreo"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const TecnicoGestion: React.FC = () => {
  const [salidas, setSalidas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cuerposAgua, setCuerposAgua] = useState<
    Record<number, CuerpoAgua | undefined>
  >({});
  const [tecnicos, setTecnicos] = useState<Record<number, Usuario | undefined>>(
    {}
  );
  const [muestreos, setMuestreos] = useState<Muestreo[]>([]);
  const [loadingMuestreos, setLoadingMuestreos] = useState(true);
  const [errorMuestreos, setErrorMuestreos] = useState("");
  const [muestreoCuerpos, setMuestreoCuerpos] = useState<Record<number, CuerpoAgua | undefined>>({});
  const [muestreoSalidas, setMuestreoSalidas] = useState<Record<number, SalidaCampo | undefined>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSalida, setModalSalida] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        const idUsuario = user.id_usuario;
        if (!idUsuario) {
          setError("No se encontró el usuario autenticado.");
          setLoading(false);
          return;
        }
        const data = await getSalidaTecnicoId(idUsuario);
        // Si la API devuelve un solo objeto, conviértelo en array
        const salidasArray = Array.isArray(data) ? data : [data];
        setSalidas(salidasArray);

        // Obtener detalles de cuerpos de agua y técnicos
        const cuerposIds = new Set<number>();
        const tecnicosIds = new Set<number>();
        salidasArray.forEach((salida) => {
          (salida.ids_cuerpos_agua || []).forEach((id: number) =>
            cuerposIds.add(id)
          );
          (salida.ids_tecnicos || []).forEach((id: number) =>
            tecnicosIds.add(id)
          );
          if (salida.id_usuario_creador)
            tecnicosIds.add(salida.id_usuario_creador);
        });

        // Fetch cuerpos de agua
        const cuerposPromises = Array.from(cuerposIds).map((id) =>
          getCuerpoAguaById(id).then(
            (cuerpo) => [id, cuerpo] as [number, CuerpoAgua]
          )
        );
        const cuerposResults = await Promise.allSettled(cuerposPromises);
        const cuerposObj: Record<number, CuerpoAgua | undefined> = {};
        cuerposResults.forEach((res) => {
          if (res.status === "fulfilled") {
            const [id, cuerpo] = res.value;
            cuerposObj[id] = cuerpo;
          }
        });
        setCuerposAgua(cuerposObj);

        // Fetch técnicos
        const tecnicosPromises = Array.from(tecnicosIds).map((id) =>
          getUserById(id).then((user) => [id, user] as [number, Usuario])
        );
        const tecnicosResults = await Promise.allSettled(tecnicosPromises);
        const tecnicosObj: Record<number, Usuario | undefined> = {};
        tecnicosResults.forEach((res) => {
          if (res.status === "fulfilled") {
            const [id, user] = res.value;
            tecnicosObj[id] = user;
          }
        });
        setTecnicos(tecnicosObj);
      } catch (err) {
        setError("Error al cargar las salidas de campo del técnico.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshMuestreos = async () => {
    setLoadingMuestreos(true);
    setErrorMuestreos("");
    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      const idUsuario = user.id_usuario;
      if (!idUsuario) {
        setErrorMuestreos("No se encontró el usuario autenticado.");
        setLoadingMuestreos(false);
        return;
      }
      const data = await getMuestreosByTecnico(idUsuario);
      setMuestreos(data);

      // Obtener ids únicos de salidas y cuerpos de agua de los muestreos
      const salidaIds = new Set<number>();
      const cuerpoIds = new Set<number>();
      data.forEach((muestreo) => {
        if (muestreo.id_salida_campo) salidaIds.add(muestreo.id_salida_campo);
        if (muestreo.id_cuerpo_agua) cuerpoIds.add(muestreo.id_cuerpo_agua);
      });

      // Fetch salidas de campo
      const salidaPromises = Array.from(salidaIds).map((id) =>
        getSalidaCampo(id).then((salida) => [id, salida] as [number, SalidaCampo])
      );
      const salidaResults = await Promise.allSettled(salidaPromises);
      const salidaObj: Record<number, SalidaCampo | undefined> = {};
      salidaResults.forEach((res) => {
        if (res.status === "fulfilled") {
          const [id, salida] = res.value;
          salidaObj[id] = salida;
        }
      });
      setMuestreoSalidas(salidaObj);

      // Fetch cuerpos de agua
      const cuerpoPromises = Array.from(cuerpoIds).map((id) =>
        getCuerpoAguaById(id).then((cuerpo) => [id, cuerpo] as [number, CuerpoAgua])
      );
      const cuerpoResults = await Promise.allSettled(cuerpoPromises);
      const cuerpoObj: Record<number, CuerpoAgua | undefined> = {};
      cuerpoResults.forEach((res) => {
        if (res.status === "fulfilled") {
          const [id, cuerpo] = res.value;
          cuerpoObj[id] = cuerpo;
        }
      });
      setMuestreoCuerpos(cuerpoObj);
    } catch (err) {
      setErrorMuestreos("Error al cargar los muestreos del técnico.");
    } finally {
      setLoadingMuestreos(false);
    }
  };

  useEffect(() => {
    refreshMuestreos();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-200 flex flex-col items-center relative">
      <Navbar />
      <div className="py-10 w-full max-w-6xl px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 p-8">
          <h1 className="text-3xl font-bold mb-6 text-blue-700">
            Mis Salidas de Campo
          </h1>
          {loading && <div className="text-blue-500">Cargando...</div>}
          {error && (
            <div className="text-red-500 font-semibold mb-4">{error}</div>
          )}
          {!loading && !error && salidas.length === 0 && (
            <div className="text-gray-500">
              No tienes salidas de campo asignadas.
            </div>
          )}
          <div className="grid gap-6">
            {salidas.map((salida) => (
              <div
                key={salida.id_salida_campo}
                className="bg-white rounded-xl shadow p-6"
              >
                <h2 className="text-xl font-semibold text-blue-600 mb-2">
                  {salida.nombre}
                </h2>
                <p className="mb-1 text-gray-700">{salida.descripcion}</p>
                <div className="mb-2 text-sm text-gray-500">
                  <span className="mr-4">
                    Inicio: <b>{new Date(salida.fecha_inicio).toLocaleDateString()}</b>
                  </span>
                  <span>
                    Fin: <b>{new Date(salida.fecha_fin).toLocaleDateString()}</b>
                  </span>
                </div>
                <div className="mb-2 text-sm text-gray-500">
                  Estado: <span className="font-semibold text-blue-500">{salida.estado}</span>
                </div>
                <div className="mb-2 text-sm text-gray-500">
                  Creado por: {tecnicos[salida.id_usuario_creador]?.nombre} {tecnicos[salida.id_usuario_creador]?.apellido}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Técnicos:</span>
                  <ul className="list-disc ml-6">
                    {(salida.ids_tecnicos || []).map((id: number) => (
                      <li key={id} className="text-gray-700">
                        {tecnicos[id]?.nombre} {tecnicos[id]?.apellido} <span className="text-xs text-gray-400">(ID: {id})</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold">Cuerpos de Agua:</span>
                  <ul className="list-disc ml-6">
                    {(salida.ids_cuerpos_agua || []).map((id: number) => (
                      <li key={id} className="text-gray-700">
                        {cuerposAgua[id]?.nombre} <span className="text-xs text-gray-400">(ID: {id})</span>
                        <div className="text-xs text-gray-500 ml-2">
                          {cuerposAgua[id]?.tipo} - {cuerposAgua[id]?.ubicacion_descripcion}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors"
                    onClick={() => {
                      setModalSalida(salida);
                      setModalOpen(true);
                    }}
                  >
                    Crear Muestreo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal para crear muestreo */}
        <CrearMuestreoModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          salida={modalSalida}
          cuerposAgua={modalSalida ? (modalSalida.ids_cuerpos_agua || []).map((id: number) => cuerposAgua[id]).filter(Boolean) as CuerpoAgua[] : []}
          muestreos={muestreos}
          onMuestreoCreado={refreshMuestreos}
        />

        {/* Sección de Muestreos */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 p-8 mt-10">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">
            Mis Muestreos
          </h2>
          {loadingMuestreos && <div className="text-blue-500">Cargando muestreos...</div>}
          {errorMuestreos && (
            <div className="text-red-500 font-semibold mb-4">{errorMuestreos}</div>
          )}
          {!loadingMuestreos && !errorMuestreos && muestreos.length === 0 && (
            <div className="text-gray-500">No tienes muestreos registrados.</div>
          )}
          <div className="grid gap-6">
            {muestreos.map((muestreo) => (
              <MuestreoCard
                key={muestreo.id_muestreo}
                muestreo={muestreo}
                salida={muestreoSalidas[muestreo.id_salida_campo]}
                cuerpoAgua={muestreoCuerpos[muestreo.id_cuerpo_agua]}
                onObservacionActualizada={async (nuevaObs) => {
                  await updateMuestreo(muestreo.id_muestreo, { observaciones: nuevaObs });
                  refreshMuestreos();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TecnicoGestion;

interface MuestreoCardProps {
  muestreo: Muestreo;
  salida?: SalidaCampo;
  cuerpoAgua?: CuerpoAgua;
  onObservacionActualizada: (nuevaObs: string) => Promise<void>;
}

const MuestreoCard: React.FC<MuestreoCardProps> = ({ muestreo, salida, cuerpoAgua, onObservacionActualizada }) => {
  const [editObs, setEditObs] = useState(muestreo.observaciones || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setEditObs(muestreo.observaciones || "");
  }, [muestreo.observaciones]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await onObservacionActualizada(editObs);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);
    } catch {
      setError("Error al guardar observación");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <div>
          <span className="font-semibold text-blue-600">Fecha de Muestreo:</span> {new Date(muestreo.fecha_muestreo).toLocaleDateString()}
        </div>
        <div className="text-sm text-gray-500 mt-2 md:mt-0">
          ID Muestreo: {muestreo.id_muestreo}
        </div>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Observaciones:</span>
        <textarea
          value={editObs}
          onChange={e => setEditObs(e.target.value)}
          className="w-full border rounded px-2 py-1 mt-1"
          rows={2}
        />
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
          {success && <span className="text-green-600 text-sm">¡Guardado!</span>}
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
      </div>
      <div className="mb-2 text-sm text-gray-500">
        <span className="font-semibold">Salida de Campo:</span> {salida?.nombre || "-"} <span className="text-xs text-gray-400">(ID: {muestreo.id_salida_campo})</span>
      </div>
      <div className="mb-2 text-sm text-gray-500">
        <span className="font-semibold">Cuerpo de Agua:</span> {cuerpoAgua?.nombre || "-"} <span className="text-xs text-gray-400">(ID: {muestreo.id_cuerpo_agua})</span>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="bg-cyan-600 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-700 transition-colors"
          onClick={() => navigate(`/analisis-muestreo/${muestreo.id_muestreo}`)}
        >
          Ir a Análisis
        </button>
      </div>
    </div>
  );
};
