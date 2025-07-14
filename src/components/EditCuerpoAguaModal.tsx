import React, { useState, useEffect } from "react";
import { updateCuerpoAgua, type CuerpoAgua } from "../services/cuerpoAguaService";
import { listComunidades, type Comunidad } from "../services/ubicacionService";
import EditableMapComponent from "./EditableMapComponent";

interface EditCuerpoAguaModalProps {
  isOpen: boolean;
  onClose: () => void;
  cuerpoAgua: CuerpoAgua | null;
  onCuerpoAguaUpdated: () => void;
}

const EditCuerpoAguaModal: React.FC<EditCuerpoAguaModalProps> = ({
  isOpen,
  onClose,
  cuerpoAgua,
  onCuerpoAguaUpdated,
}) => {
  const [form, setForm] = useState<CuerpoAgua | null>(cuerpoAgua);
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

  useEffect(() => {
    setForm(cuerpoAgua);
  }, [cuerpoAgua]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) =>
      prev ? { ...prev, [name]: value } : null
    );
  };

  const handleMapClick = (lat: number, lng: number) => {
    setForm((prev) =>
      prev ? { ...prev, latitud: lat, longitud: lng } : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    setError("");
    try {
      await updateCuerpoAgua(form.id_cuerpo_agua, form);
      onCuerpoAguaUpdated();
      onClose();
    } catch {
      setError("No se pudo actualizar el cuerpo de agua");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !form) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-400 hover:text-blue-700 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Editar Cuerpo de Agua</h2>
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
              <option value="" disabled>
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
            <EditableMapComponent
              initialPosition={{ lat: form.latitud, lng: form.longitud }}
              zoomLevel={15}
              onMapClick={handleMapClick}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Actualizando..." : "Actualizar Cuerpo de Agua"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCuerpoAguaModal;
