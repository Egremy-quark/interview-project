"use client";
import { useState } from "react";
// import ModalWrapper from "../../Layout/ModalWrapper";
import { useProductStore } from "@/app/lib/userProductStore";
import ModalWrapper from "../../Layout/ModalWrapper";
// import ModalWrapper from "@/app/Layout/ModalWrapper";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  refreshProducts: () => void;
}

interface Translation {
  language: string;
  description: string;
}

interface ProductFormState {
  id: string;
  price: number;
  translations: Translation[];
}

const CreateProductForm: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  refreshProducts,
}) => {
  const { addProduct } = useProductStore(); // Usamos la función addProduct de la store
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formState, setFormState] = useState<ProductFormState>({
    id: "",
    price: 0,
    translations: [{ language: "", description: "" }],
  });

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState({
      ...formState,
      [id]: id === "price" ? Number(value) : value,
    });
  };

  // Manejar cambios en las traducciones
  const handleTranslationChange = (
    index: number,
    field: keyof Translation,
    value: string
  ) => {
    const updatedTranslations = [...formState.translations];
    updatedTranslations[index][field] = value;
    setFormState({
      ...formState,
      translations: updatedTranslations,
    });
  };

  // Añadir una nueva traducción
  const addTranslation = () => {
    setFormState({
      ...formState,
      translations: [
        ...formState.translations,
        { language: "", description: "" },
      ],
    });
  };

  // Enviar formulario, delegando a la store
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Llamamos a la función de la store para añadir el producto
      await addProduct(formState.id, formState.price, formState.translations);

      onClose(); // Cerrar el modal si el producto se creó correctamente
      refreshProducts(); // Actualizar la lista de productos
      setFormState({} as ProductFormState); // Limpiar el formulario
    } catch (error) {
      console.error("Error al crear el producto:", error);
      setError("Hubo un problema al crear el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl mb-4">Crear Producto</h1>
        <form onSubmit={handleSubmit}>
          {/* Campo para el ID */}
          <div className="mb-4">
            <label htmlFor="id" className="block text-gray-700">
              ID del Producto
            </label>
            <input
              type="text"
              id="id"
              value={formState.id}
              onChange={handleChange}
              required
              className="border rounded w-full py-2 px-3"
            />
          </div>

          {/* Campo para el precio */}
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700">
              Precio
            </label>
            <input
              type="number"
              id="price"
              value={formState.price}
              onChange={handleChange}
              required
              className="border rounded w-full py-2 px-3"
            />
          </div>

          {/* Traducciones */}
          <div className="mb-4">
            <label className="block text-gray-700">Traducciones</label>
            {formState?.translations?.map((translation, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  placeholder="Idioma"
                  value={translation.language}
                  onChange={(e) =>
                    handleTranslationChange(index, "language", e.target.value)
                  }
                  required
                  className="border rounded w-full py-2 px-3 mb-2"
                />
                <input
                  type="text"
                  placeholder="Descripción"
                  value={translation.description}
                  onChange={(e) =>
                    handleTranslationChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  required
                  className="border rounded w-full py-2 px-3"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addTranslation}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Añadir Traducción
            </button>
          </div>

          {/* Botón para enviar */}
          <div className="mb-4">
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Producto"}
            </button>
          </div>

          {/* Mostrar errores */}
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </ModalWrapper>
  );
};

export default CreateProductForm;