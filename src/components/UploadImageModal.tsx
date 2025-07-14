import React, { useState } from "react";
import { createImagenCuerpoAgua } from "../services/ImgCuerpoAguaService";

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  idCuerpoAgua: number;
  onImageUploaded: () => void;
}

const UploadImageModal: React.FC<UploadImageModalProps> = ({
  isOpen,
  onClose,
  idCuerpoAgua,
  onImageUploaded,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Debe seleccionar un archivo");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createImagenCuerpoAgua({ file, descripcion, id_cuerpo_agua: idCuerpoAgua });
      onImageUploaded();
      onClose();
    } catch {
      setError("No se pudo subir la imagen");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-400 hover:text-blue-700 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Subir Imagen</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Archivo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Subiendo..." : "Subir Imagen"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadImageModal;
