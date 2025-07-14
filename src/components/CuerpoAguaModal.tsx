import React, { useState, useEffect } from "react";
import { createCuerpoAgua } from "../services/cuerpoAguaService";
import { listComunidades, type Comunidad } from "../services/ubicacionService";
import MapComponent from "./MapComponent";

interface CuerpoAguaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCuerpoAguaCreated: () => void;
}

const initialState = {
  nombre: "",
  descripcion: "",
  tipo: "",
  latitud: 0,
  longitud: 0,
  ubicacion_descripcion: "",
  id_comunidad: 0,
};

const CuerpoAguaModal: React.FC<CuerpoAguaModalProps> = ({
  isOpen,
  onClose,
  onCuerpoAguaCreated,
}) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comunidades, setComunidades] = useState<Comunidad[]>([]);

  useEffect(() => {
    const fetchComunidades = async () => {
      try {
        const data = await listComunidades();
        setComunidades(data);
      } catch {
        setError("No se pudieron cargar las comunidades");
      }
    };
    fetchComunidades();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "id_comunidad" ? Number(value) : value,
    }));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setForm((prev) => ({
      ...prev,
      latitud: lat,
      longitud: lng,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const timestamp = new Date().toISOString();
      await createCuerpoAgua({ ...form, fecha_registro: timestamp });
      setForm(initialState);
      onCuerpoAguaCreated();
      onClose();
    } catch {
      setError("No se pudo crear el cuerpo de agua");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-400 hover:text-blue-700 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Crear Cuerpo de Agua</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="" disabled>
                Seleccione un tipo
              </option>
              <option value="RIOS">Ríos</option>
              <option value="ARROYOS">Arroyos</option>
              <option value="LAGOS">Lagos</option>
              <option value="HUMEDALES">Humedales</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Detalle Ubicación</label>
            <input
              type="text"
              name="ubicacion_descripcion"
              value={form.ubicacion_descripcion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Comunidad</label>
            <select
              name="id_comunidad"
              value={form.id_comunidad}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value={0} disabled>
                Seleccione una comunidad
              </option>
              {comunidades.map((comunidad) => (
                <option key={comunidad.id_comunidad} value={comunidad.id_comunidad}>
                  {comunidad.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Coordenadas</label>
            <p className="text-sm text-gray-500 mb-2">
              Latitud: {form.latitud}, Longitud: {form.longitud}
            </p>
            <MapComponent onMapClick={handleMapClick} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creando..." : "Crear Cuerpo de Agua"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CuerpoAguaModal;
