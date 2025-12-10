import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditarProducto() {
  const { id } = useParams();

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [options, setOptions] = useState({});

  const [optionKey, setOptionKey] = useState("");
  const [optionValue, setOptionValue] = useState("");

  const cargarProducto = async () => {
    const ref = doc(db, "products", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const p = snap.data();
      setNombre(p.nombre);
      setPrecio(p.precio);
      setImagen(p.imagen);
      setDescripcion(p.descripcion);
      setCategoria(p.categoria);
      setOptions(p.options || {});
    }
  };

  useEffect(() => {
    cargarProducto();
  }, []);

  const guardarCambios = async (e) => {
    e.preventDefault();

    const ref = doc(db, "products", id);

    await updateDoc(ref, {
      nombre,
      precio: Number(precio),
      imagen,
      descripcion,
      categoria,
      options,
    });

    alert("Producto actualizado");
  };

  const agregarOpcion = () => {
    if (!optionKey.trim() || !optionValue.trim()) return;
    const values = optionValue.split(",").map((v) => v.trim());

    setOptions({
      ...options,
      [optionKey]: values,
    });

    setOptionKey("");
    setOptionValue("");
  };

  const borrarOpcion = (key) => {
    const copia = { ...options };
    delete copia[key];
    setOptions(copia);
  };

  return (
    <form onSubmit={guardarCambios} style={{ padding: 20 }}>
      <h2>Editar Producto</h2>

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
        placeholder="Nombre de la opción"
        value={optionKey}
        onChange={(e) => setOptionKey(e.target.value)}
      />

      <input
        type="text"
        placeholder="Valores separados por coma"
        value={optionValue}
        onChange={(e) => setOptionValue(e.target.value)}
      />

      <button type="button" onClick={agregarOpcion}>
        Agregar opción
      </button>

      <ul>
        {Object.entries(options).map(([key, values]) => (
          <li key={key}>
            <strong>{key}:</strong> {values.join(", ")}{" "}
            <button type="button" onClick={() => borrarOpcion(key)}>
              X
            </button>
          </li>
        ))}
      </ul>

      <button type="submit" style={{ marginTop: 20 }}>
        Guardar cambios
      </button>
    </form>
  );
}
