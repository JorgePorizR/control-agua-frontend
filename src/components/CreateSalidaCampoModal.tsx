import React, { useEffect, useState } from "react";
import { createSalidaCampo, type SalidaCampoCreate } from "../services/salidaCampoService";
import { listUsers, type Usuario } from "../services/userService";
import { listCuerposAgua, type CuerpoAgua } from "../services/cuerpoAguaService";

interface CreateSalidaCampoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalidaCampoCreated: () => void;
}

const CreateSalidaCampoModal: React.FC<CreateSalidaCampoModalProps> = ({ isOpen, onClose, onSalidaCampoCreated }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState("PROGRAMADA");
  const [tecnicos, setTecnicos] = useState<Usuario[]>([]);
  const [cuerposAgua, setCuerposAgua] = useState<CuerpoAgua[]>([]);
  const [selectedTecnicos, setSelectedTecnicos] = useState<number[]>([]);
  const [selectedCuerposAgua, setSelectedCuerposAgua] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuarios = await listUsers();
        setTecnicos(usuarios.filter((user) => user.rol === "TECNICO"));

        const cuerpos = await listCuerposAgua();
        setCuerposAgua(cuerpos);
      } catch {
        alert("Error al cargar técnicos o cuerpos de agua");
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    const idUsuarioCreador = user.id_usuario;

    const nuevaSalida: SalidaCampoCreate = {
      nombre,
      descripcion,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      fecha_creacion: new Date().toISOString(),
      estado,
      id_usuario_creador: idUsuarioCreador,
      ids_tecnicos: selectedTecnicos,
      ids_cuerpos_agua: selectedCuerposAgua,
    };

    try {
      await createSalidaCampo(nuevaSalida);
      onSalidaCampoCreated();
      onClose();
    } catch {
      alert("Error al crear la salida de campo");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Crear Salida de Campo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="PROGRAMADA">PROGRAMADA</option>
              <option value="EN_PROGRESO">EN_PROGRESO</option>
              <option value="COMPLETADA">COMPLETADA</option>
              <option value="CANCELADA">CANCELADA</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Técnicos</label>
            <select
              multiple
              value={selectedTecnicos.map(String)} // Convert number[] to string[]
              onChange={(e) =>
                setSelectedTecnicos(
                  Array.from(e.target.selectedOptions, (option) => Number(option.value))
                )
              }
              className="w-full border rounded px-3 py-2"
            >
              {tecnicos.map((tecnico) => (
                <option key={tecnico.id_usuario} value={tecnico.id_usuario}>
                  {tecnico.nombre} {tecnico.apellido}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Cuerpos de Agua</label>
            <select
              multiple
              value={selectedCuerposAgua.map(String)} // Convert number[] to string[]
              onChange={(e) =>
                setSelectedCuerposAgua(
                  Array.from(e.target.selectedOptions, (option) => Number(option.value))
                )
              }
              className="w-full border rounded px-3 py-2"
            >
              {cuerposAgua.map((cuerpo) => (
                <option key={cuerpo.id_cuerpo_agua} value={cuerpo.id_cuerpo_agua}>
                  {cuerpo.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSalidaCampoModal;
