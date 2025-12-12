// src/components/ProductoForm.jsx

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";


const inputStyle = {
  padding: "10px 15px",
  margin: "8px 0",
  border: "1px solid #444", 
  borderRadius: "5px",
  backgroundColor: "#2e2e2e", 
  color: "#fff",
  width: "100%",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s",
  fontWeight: "bold",
};

export default function ProductoForm({ productoEditando, onSaved }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [options, setOptions] = useState({});

  const [optionKey, setOptionKey] = useState("");
  const [optionValue, setOptionValue] = useState("");

  useEffect(() => {
    
    if (productoEditando) {
      setName(productoEditando.name || "");
      setPrice(productoEditando.price || "");
      setImageUrl(productoEditando.imageUrl || "");
      setDesc(productoEditando.desc || "");
      setCategory(productoEditando.category || "");
      setOptions(productoEditando.options || {});
    } else {
      setName("");
      setPrice("");
      setImageUrl("");
      setDesc("");
      setCategory("");
      setOptions({});
    }
  }, [productoEditando]);

  const addOption = () => {
    if (!optionKey || !optionValue) return;

    const values = optionValue.split(",").map((v) => v.trim());

    setOptions({ ...options, [optionKey]: values });

    setOptionKey("");
    setOptionValue("");
  };

  const submit = async (e) => {
    e.preventDefault();

    if (productoEditando) {
      await updateDoc(doc(db, "products", productoEditando.id), {
        name,
        price: Number(price),
        imageUrl,
        desc,
        category,
        options,
      });

      alert("Producto actualizado");
    } else {
      await addDoc(collection(db, "products"), {
        name,
        price: Number(price),
        imageUrl,
        desc,
        category,
        options,
        activo: true,
        createdAt: new Date(),
      });

      alert("Producto agregado");
    }

    onSaved();
  };

  const mainButtonStyle = {
    ...buttonStyle,
    backgroundColor: productoEditando ? "#E4A11B" : "#A0522D", 
    color: "#fff",
    marginTop: "20px",
    width: "100%",
  };

  const addOptionButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6B4226", 
    color: "#fff",
    marginLeft: "10px",
  };

  return (
    <form
      onSubmit={submit}
      style={{
        marginBottom: 30,
        backgroundColor: "rgba(28, 28, 28, 0.8)", 
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
      }}
    >
      <h2 style={{ color: "#E4A11B", borderBottom: "2px solid #333", paddingBottom: "10px" }}>
        {productoEditando ? "✏️ Editar Producto" : "✨ Agregar Producto"}
      </h2>

      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" required />
        <input style={inputStyle} type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Precio (ej: 3.50)" step="0.01" required />
        <input style={inputStyle} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Imagen URL" />
        <input style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categoría" required />
      </div>

      <textarea
        style={{ ...inputStyle, minHeight: "80px", gridColumn: "span 2" }}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Descripción (opcional)"
      />

      {/* Opciones */}
      <h3 style={{ color: "#E4A11B", borderTop: "1px dashed #333", paddingTop: "15px", marginTop: "15px" }}>
        Opciones (Tamaños, Sabores)
      </h3>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          style={{ ...inputStyle, margin: 0 }}
          placeholder="Nombre opción (Ej: Tamaño)"
          value={optionKey}
          onChange={(e) => setOptionKey(e.target.value)}
        />
        <input
          style={{ ...inputStyle, margin: 0 }}
          placeholder="Valores separados por coma (Ej: Chico, Mediano, Grande)"
          value={optionValue}
          onChange={(e) => setOptionValue(e.target.value)}
        />
        <button type="button" onClick={addOption} style={addOptionButtonStyle}>
          ➕ Agregar Opción
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
        {Object.entries(options).map(([k, v]) => (
          <li key={k} style={{
            backgroundColor: "#2e2e2e",
            padding: "8px",
            borderRadius: "5px",
            marginBottom: "5px",
            color: "#ccc"
          }}>
            <b style={{ color: "#fff" }}>{k}:</b> {v.join(", ")}
          </li>
        ))}
      </ul>

      <button type="submit" style={mainButtonStyle}>
        {productoEditando ? "💾 Guardar Cambios" : "✅ Guardar Nuevo Producto"}
      </button>
    </form>
  );
}