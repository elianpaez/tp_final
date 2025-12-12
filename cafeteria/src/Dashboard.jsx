// src/pages/AdminDashboard.jsx

import { useState } from "react";
import ProductosLista from "./components/ProductosLista.jsx";
import ProductoForm from "./components/ProductoForm.jsx";


const backgroundImageUrl = "https://i.pinimg.com/736x/8d/ee/9b/8dee9b22a306f5a1f85f4dfed5e8c75d.jpg";

export default function AdminDashboard() {
  const [recargar, setRecargar] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const actualizar = () => {
    setRecargar(!recargar);
    setProductoEditando(null);
  };

  return (
    <div style={{
        padding: 40,
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover", 
        backgroundAttachment: "fixed", 
        backgroundPosition: "center",

        color: "#f5f5f5", 
        fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ color: "#E4A11B", marginBottom: "30px", fontSize: "2.5em", textShadow: "1px 1px 3px #000" }}>
        ☕ Panel de Administración
      </h1>

      <ProductoForm
        productoEditando={productoEditando}
        onSaved={actualizar}
      />

      <hr style={{ margin: "40px 0", border: "0", borderTop: "1px solid #333" }} />

      <ProductosLista
        recargar={recargar}
        onEditar={(p) => setProductoEditando(p)}
      />
    </div>
  );
}