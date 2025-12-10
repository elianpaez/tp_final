import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddProduct() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");

  const [optionKey, setOptionKey] = useState("");
  const [optionValue, setOptionValue] = useState("");
  const [options, setOptions] = useState({});

  const handleAddOption = () => {
    if (!optionKey.trim() || !optionValue.trim()) return;

    const values = optionValue.split(",").map((v) => v.trim());

    setOptions({
      ...options,
      [optionKey]: values,
    });

    setOptionKey("");
    setOptionValue("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "products"), {
        nombre,
        precio: Number(precio),
        imagen,
        descripcion,
        categoria,
        options,
        activo: true,
        createdAt: new Date(),
      });

      alert("Producto agregado!");

      setNombre("");
      setPrecio("");
      setImagen("");
      setDescripcion("");
      setCategoria("");
      setOptions({});
    } catch (err) {
      console.log(err);
      alert("Error al agregar producto");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h2>Agregar Producto</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="number"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
      />

      <input
        type="text"
        placeholder="URL de imagen"
        value={imagen}
        onChange={(e) => setImagen(e.target.value)}
      />

      <input
        type="text"
        placeholder="Categoría"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      />

      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        style={{ width: "100%", height: 80 }}
      />

      <h3>Opciones dinámicas</h3>

      <input
        type="text"
        placeholder="Nombre de la opción (ej: Tamaño)"
        value={optionKey}
        onChange={(e) => setOptionKey(e.target.value)}
      />

      <input
        type="text"
        placeholder="Valores separados por coma (ej: Chico,Mediano,Grande)"
        value={optionValue}
        onChange={(e) => setOptionValue(e.target.value)}
      />

      <button type="button" onClick={handleAddOption}>
        Agregar opción
      </button>

      <ul>
        {Object.entries(options).map(([key, values]) => (
          <li key={key}>
            <strong>{key}:</strong> {values.join(", ")}
          </li>
        ))}
      </ul>

      <button type="submit" style={{ marginTop: 20 }}>
        Guardar
      </button>
    </form>
  );
}
