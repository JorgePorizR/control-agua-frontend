import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { listImagenesCuerpoAgua, type ImagenCuerpoAgua, deleteImagenCuerpoAgua } from "../services/ImgCuerpoAguaService";
import UploadImageModal from "../components/UploadImageModal";
import { getCuerpoAguaById, type CuerpoAgua } from "../services/cuerpoAguaService";
import StaticMapComponent from "../components/StaticMapComponent";

const API_URL = import.meta.env.VITE_API_URL_IMG as string;

const GaleriaCuerpoAgua: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [imagenes, setImagenes] = useState<ImagenCuerpoAgua[]>([]);
  const [cuerpoAgua, setCuerpoAgua] = useState<CuerpoAgua | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchImagenes = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const data = await listImagenesCuerpoAgua(Number(id));
      setImagenes(data);
    } catch {
      setError("No se pudieron cargar las imágenes del cuerpo de agua");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchCuerpoAgua = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const data = await getCuerpoAguaById(Number(id));
      setCuerpoAgua(data);
    } catch {
      setError("No se pudieron cargar los datos del cuerpo de agua");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchImagenes();
    fetchCuerpoAgua();
  }, [id, fetchImagenes, fetchCuerpoAgua]);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleImageUploaded = () => {
    fetchImagenes();
  };

  const handleDeleteImage = async (idImagen: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta imagen?")) return;
    try {
      await deleteImagenCuerpoAgua(idImagen);
      fetchImagenes();
    } catch {
      alert("No se pudo eliminar la imagen");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-200 flex flex-col items-center relative">
      <Navbar />
      <div className="py-10 w-full max-w-6xl px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 p-8">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center flex items-center justify-center">
            Galería de Imágenes
          </h2>
          {error && (
            <div className="mb-4 text-red-500 text-center font-semibold">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-blue-500 text-center font-bold">
              Cargando datos...
            </div>
          ) : (
            <>
              {cuerpoAgua && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-blue-600 mb-4">
                    {cuerpoAgua.nombre}
                  </h3>
                  <p className="text-gray-700 mb-2">{cuerpoAgua.descripcion}</p>
                  <p className="text-gray-500 mb-4">
                    Ubicación: {cuerpoAgua.ubicacion_descripcion}
                  </p>
                  <StaticMapComponent
                    lat={cuerpoAgua.latitud}
                    lng={cuerpoAgua.longitud}
                  />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {imagenes.map((imagen) => (
                  <div key={imagen.id_imagen} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img
                      src={API_URL+imagen.ruta_archivo}
                      alt={imagen.descripcion}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-700">{imagen.descripcion}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Subida el: {new Date(imagen.fecha_subida).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteImage(imagen.id_imagen)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
                {imagenes.length === 0 && (
                  <p className="text-center text-blue-400">No hay imágenes disponibles.</p>
                )}
              </div>
            </>
          )}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleModalOpen}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors"
            >
              Subir Imagen
            </button>
          </div>
        </div>
          <UploadImageModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            idCuerpoAgua={Number(id)}
            onImageUploaded={handleImageUploaded}
          />
      </div>
    </div>
  );
};

export default GaleriaCuerpoAgua;
