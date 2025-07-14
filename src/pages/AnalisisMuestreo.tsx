import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listImagenesMuestreo, type ImgMuestreo, createImagenMuestreo } from "../services/imgMuestrroService";
import { getAnalisisTurbidezByMuestreo, type AnalisisTurbidez, createAnalisisTurbidez } from "../services/analisisTurbidezService";
import { getAnalisisCaudalByMuestreo, type AnalisisCaudal, createAnalisisCaudal } from "../services/analisisCaudalService";
import Navbar from "../components/Navbar";

// --- MODALS ---

// Modal para subir imagen
const ModalCrearImagen: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  idMuestreo: number;
  onCreated: () => void;
}> = ({ isOpen, onClose, idMuestreo, onCreated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFile(null);
    setDescripcion("");
    setError("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!file) {
        setError("Selecciona una imagen.");
        setLoading(false);
        return;
      }
      console.log({file, descripcion, idMuestreo});
      await createImagenMuestreo({ file, descripcion, id_muestreo: idMuestreo });
      onCreated();
      onClose();
    } catch (error) {
      console.log(error);
      setError("No se pudo subir la imagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-blue-400 hover:text-blue-700 text-2xl font-bold">&times;</button>
        <h2 className="text-xl font-semibold mb-4">Subir Imagen de Muestreo</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Imagen</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required className="w-full" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200" rows={2} />
          </div>
          <button type="submit" disabled={loading} className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>{loading ? "Subiendo..." : "Subir Imagen"}</button>
        </form>
      </div>
    </div>
  );
};

// Modal para crear análisis de turbidez
const ModalCrearTurbidez: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  idMuestreo: number;
  onCreated: () => void;
}> = ({ isOpen, onClose, idMuestreo, onCreated }) => {
  const [valorNtu, setValorNtu] = useState("");
  // const [clasificacion, setClasificacion] = useState(""); // Eliminado
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Clasificación automática
  function getClasificacion(ntu: number): string {
    if (ntu < 1) return "MUY_CLARA";
    if (ntu < 5) return "CLARA";
    if (ntu < 10) return "LIGERAMENTE_TURBIA";
    if (ntu < 50) return "TURBIA";
    return "MUY_TURBIA";
  }
  const clasificacion = valorNtu && !isNaN(Number(valorNtu)) ? getClasificacion(Number(valorNtu)) : "-";

  useEffect(() => {
    setValorNtu("");
    // setClasificacion(""); // Eliminado
    setObservaciones("");
    setError("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!valorNtu || isNaN(Number(valorNtu))) {
        setError("Ingresa un valor NTU válido.");
        setLoading(false);
        return;
      }
      await createAnalisisTurbidez({
        valor_ntu: Number(valorNtu),
        clasificacion,
        observaciones,
        fecha_analisis: new Date().toISOString(),
        id_muestreo: idMuestreo,
      });
      onCreated();
      onClose();
    } catch {
      setError("No se pudo crear el análisis de turbidez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-blue-400 hover:text-blue-700 text-2xl font-bold">&times;</button>
        <h2 className="text-xl font-semibold mb-4">Crear Análisis de Turbidez</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Valor NTU</label>
            <input type="number" value={valorNtu} onChange={e => setValorNtu(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Clasificación</label>
            <div className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700">{clasificacion}</div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200" rows={2} />
          </div>
          <button type="submit" disabled={loading} className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>{loading ? "Creando..." : "Crear Análisis"}</button>
        </form>
      </div>
    </div>
  );
};

// Modal para crear análisis de caudal
const ModalCrearCaudal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  idMuestreo: number;
  onCreated: () => void;
}> = ({ isOpen, onClose, idMuestreo, onCreated }) => {
  const [ancho, setAncho] = useState("");
  const [profundidad, setProfundidad] = useState("");
  const [velocidad, setVelocidad] = useState("");
  const [area, setArea] = useState("");
  const [caudal, setCaudal] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAncho("");
    setProfundidad("");
    setVelocidad("");
    setArea("");
    setCaudal("");
    setObservaciones("");
    setError("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if ([ancho, profundidad, velocidad, area, caudal].some(v => !v || isNaN(Number(v)))) {
        setError("Completa todos los campos numéricos correctamente.");
        setLoading(false);
        return;
      }
      await createAnalisisCaudal({
        ancho_metros: Number(ancho),
        profundidad_media_metros: Number(profundidad),
        velocidad_media_ms: Number(velocidad),
        area_m2: Number(area),
        caudal_m3s: Number(caudal),
        observaciones,
        fecha_analisis: new Date().toISOString(),
        id_muestreo: idMuestreo,
      });
      onCreated();
      onClose();
    } catch {
      setError("No se pudo crear el análisis de caudal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-blue-400 hover:text-blue-700 text-2xl font-bold">&times;</button>
        <h2 className="text-xl font-semibold mb-4">Crear Análisis de Caudal</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Ancho (m)</label>
            <input type="number" value={ancho} onChange={e => setAncho(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200" step="any" />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Profundidad Media (m)</label>
            <input type="number" value={profundidad} onChange={e => setProfundidad(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200" step="any" />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Velocidad Media (m/s)</label>
            <input type="number" value={velocidad} onChange={e => setVelocidad(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200" step="any" />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Área (m²)</label>
            <input type="number" value={area} onChange={e => setArea(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200" step="any" />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Caudal (m³/s)</label>
            <input type="number" value={caudal} onChange={e => setCaudal(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200" step="any" />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200" rows={2} />
          </div>
          <button type="submit" disabled={loading} className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>{loading ? "Creando..." : "Crear Análisis"}</button>
        </form>
      </div>
    </div>
  );
};

// --- FIN MODALS ---

const AnalisisMuestreo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const idMuestreo = Number(id);

  // Estados para imágenes
  const [imagenes, setImagenes] = useState<ImgMuestreo[]>([]);
  const [loadingImg, setLoadingImg] = useState(true);
  const [errorImg, setErrorImg] = useState("");
  const [modalImg, setModalImg] = useState(false);

  // Estados para turbidez
  const [turbidez, setTurbidez] = useState<AnalisisTurbidez[]>([]);
  const [loadingTurbidez, setLoadingTurbidez] = useState(true);
  const [errorTurbidez, setErrorTurbidez] = useState("");
  const [modalTurbidez, setModalTurbidez] = useState(false);

  // Estados para caudal
  const [caudal, setCaudal] = useState<AnalisisCaudal[]>([]);
  const [loadingCaudal, setLoadingCaudal] = useState(true);
  const [errorCaudal, setErrorCaudal] = useState("");
  const [modalCaudal, setModalCaudal] = useState(false);

  // Refrescar listas
  const refreshImagenes = () => {
    setLoadingImg(true);
    setErrorImg("");
    listImagenesMuestreo(idMuestreo)
      .then(setImagenes)
      .catch(() => setErrorImg("Error al cargar imágenes."))
      .finally(() => setLoadingImg(false));
  };
  const refreshTurbidez = () => {
    setLoadingTurbidez(true);
    setErrorTurbidez("");
    getAnalisisTurbidezByMuestreo(idMuestreo)
      .then(setTurbidez)
      .catch(() => setErrorTurbidez("Error al cargar análisis de turbidez."))
      .finally(() => setLoadingTurbidez(false));
  };
  const refreshCaudal = () => {
    setLoadingCaudal(true);
    setErrorCaudal("");
    getAnalisisCaudalByMuestreo(idMuestreo)
      .then(setCaudal)
      .catch(() => setErrorCaudal("Error al cargar análisis de caudal."))
      .finally(() => setLoadingCaudal(false));
  };

  useEffect(() => {
    if (!idMuestreo) return;
    refreshImagenes();
    refreshTurbidez();
    refreshCaudal();
    // eslint-disable-next-line
  }, [idMuestreo]);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-200 py-10">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 p-8 max-w-6xl w-full">
          <h1 className="text-2xl font-bold mb-4 text-blue-700">Análisis de Muestreo</h1>
          <p className="text-gray-700 text-lg mb-6">ID del muestreo: <span className="font-mono text-blue-600">{id}</span></p>
          {/* Imágenes */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-cyan-700">Imágenes del Muestreo</h2>
              <button onClick={() => setModalImg(true)} className="bg-blue-500 text-white px-4 py-1 rounded shadow hover:bg-blue-600 transition-colors">Subir Imagen</button>
            </div>
            {loadingImg && <div className="text-blue-500">Cargando imágenes...</div>}
            {errorImg && <div className="text-red-500">{errorImg}</div>}
            {!loadingImg && !errorImg && imagenes.length === 0 && (
              <div className="text-gray-500">No hay imágenes registradas para este muestreo.</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {imagenes.map((img) => (
                <div key={img.id_imagen_muestreo} className="bg-white rounded shadow p-3 border border-blue-100 flex flex-col items-center">
                  <img
                    src={import.meta.env.VITE_API_URL_IMG + img.ruta_archivo}
                    alt={img.descripcion || img.nombre_archivo}
                    className="w-full h-48 object-cover rounded mb-2"
                    style={{ maxWidth: 320 }}
                  />
                  <div className="text-sm text-gray-700 font-semibold mb-1">{img.descripcion || "Sin descripción"}</div>
                  <div className="text-xs text-gray-400">Subida: {new Date(img.fecha_subida).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </section>
          <ModalCrearImagen isOpen={modalImg} onClose={() => setModalImg(false)} idMuestreo={idMuestreo} onCreated={refreshImagenes} />
          {/* Turbidez */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-cyan-700">Análisis de Turbidez</h2>
              <button onClick={() => setModalTurbidez(true)} className="bg-blue-500 text-white px-4 py-1 rounded shadow hover:bg-blue-600 transition-colors">Crear Análisis</button>
            </div>
            {loadingTurbidez && <div className="text-blue-500">Cargando análisis de turbidez...</div>}
            {errorTurbidez && <div className="text-red-500">{errorTurbidez}</div>}
            {!loadingTurbidez && !errorTurbidez && turbidez.length === 0 && (
              <div className="text-gray-500">No hay análisis de turbidez registrados.</div>
            )}
            <div className="overflow-x-auto">
              {turbidez.length > 0 && (
                <table className="min-w-full border text-sm">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="px-2 py-1 border">ID</th>
                      <th className="px-2 py-1 border">Valor NTU</th>
                      <th className="px-2 py-1 border">Clasificación</th>
                      <th className="px-2 py-1 border">Observaciones</th>
                      <th className="px-2 py-1 border">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {turbidez.map((a) => (
                      <tr key={a.id_analisis_turbidez} className="even:bg-blue-50">
                        <td className="border px-2 py-1">{a.id_analisis_turbidez}</td>
                        <td className="border px-2 py-1">{a.valor_ntu}</td>
                        <td className="border px-2 py-1">{a.clasificacion}</td>
                        <td className="border px-2 py-1">{a.observaciones}</td>
                        <td className="border px-2 py-1">{new Date(a.fecha_analisis).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
          <ModalCrearTurbidez isOpen={modalTurbidez} onClose={() => setModalTurbidez(false)} idMuestreo={idMuestreo} onCreated={refreshTurbidez} />
          {/* Caudal */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-cyan-700">Análisis de Caudal</h2>
              <button onClick={() => setModalCaudal(true)} className="bg-blue-500 text-white px-4 py-1 rounded shadow hover:bg-blue-600 transition-colors">Crear Análisis</button>
            </div>
            {loadingCaudal && <div className="text-blue-500">Cargando análisis de caudal...</div>}
            {errorCaudal && <div className="text-red-500">{errorCaudal}</div>}
            {!loadingCaudal && !errorCaudal && caudal.length === 0 && (
              <div className="text-gray-500">No hay análisis de caudal registrados.</div>
            )}
            <div className="overflow-x-auto">
              {caudal.length > 0 && (
                <table className="min-w-full border text-sm">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="px-2 py-1 border">ID</th>
                      <th className="px-2 py-1 border">Ancho (m)</th>
                      <th className="px-2 py-1 border">Profundidad Media (m)</th>
                      <th className="px-2 py-1 border">Velocidad Media (m/s)</th>
                      <th className="px-2 py-1 border">Área (m²)</th>
                      <th className="px-2 py-1 border">Caudal (m³/s)</th>
                      <th className="px-2 py-1 border">Observaciones</th>
                      <th className="px-2 py-1 border">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caudal.map((a) => (
                      <tr key={a.id_analisis_caudal} className="even:bg-blue-50">
                        <td className="border px-2 py-1">{a.id_analisis_caudal}</td>
                        <td className="border px-2 py-1">{a.ancho_metros}</td>
                        <td className="border px-2 py-1">{a.profundidad_media_metros}</td>
                        <td className="border px-2 py-1">{a.velocidad_media_ms}</td>
                        <td className="border px-2 py-1">{a.area_m2}</td>
                        <td className="border px-2 py-1">{a.caudal_m3s}</td>
                        <td className="border px-2 py-1">{a.observaciones}</td>
                        <td className="border px-2 py-1">{new Date(a.fecha_analisis).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
          <ModalCrearCaudal isOpen={modalCaudal} onClose={() => setModalCaudal(false)} idMuestreo={idMuestreo} onCreated={refreshCaudal} />
        </div>
      </div>
    </div>
  );
};

export default AnalisisMuestreo; 