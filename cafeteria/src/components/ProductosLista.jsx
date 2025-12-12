// src/components/ProductosLista.jsx

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";


const buttonStyle = {
    padding: "8px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
    fontSize: "0.9em"
};

export default function ProductosLista({ recargar, onEditar }) {
    const [productos, setProductos] = useState([]);

    const cargar = async () => {
        const snap = await getDocs(collection(db, "products"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProductos(data);
    };

    useEffect(() => {
        cargar();
    }, [recargar]);

    const borrar = async (id) => {
        if (!confirm("¿Borrar producto?")) return;
        await deleteDoc(doc(db, "products", id));
        cargar();
    };

    const editButtonStyle = {
        ...buttonStyle,
        backgroundColor: "#E4A11B", 
        color: "#1c1c1c",
    };

    const deleteButtonStyle = {
        ...buttonStyle,
        backgroundColor: "#A0522D", 
        color: "#fff",
    };

    return (
        <div>
            <h2 style={{ color: "#E4A11B" }}>📋 Productos Existentes</h2>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
                gap: "20px",
                marginTop: "20px"
            }}>
                {productos.map((p) => (
                  <div key={p.id} style={{
                    backgroundColor: "rgba(28, 28, 28, 0.8)", 
                    padding: 15,
                    borderRadius: 12,
                    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.4)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    border: "1px solid #333",
                  }}>
                        {p.imageUrl && (
                            <img
                                src={p.imageUrl}
                                alt={p.name}
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    marginBottom: "10px"
                                }}
                            />
                        )}
                        <div style={{ flexGrow: 1 }}>
                            <h3 style={{ margin: 0, color: "#fff" }}>{p.name}</h3>
                            <p style={{ margin: "5px 0", color: "#E4A11B", fontWeight: "bold", fontSize: "1.2em" }}>
                                ${p.price}
                            </p>
                            <p style={{ margin: "0", color: "#aaa", fontSize: "0.9em" }}>
                                Categoría: <span style={{ color: "#ccc" }}>{p.category}</span>
                            </p>
                        </div>


                        <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
                            <button onClick={() => onEditar(p)} style={editButtonStyle}>
                                ✏️ Editar
                            </button>
                            <button onClick={() => borrar(p.id)} style={deleteButtonStyle}>
                                🗑️ Borrar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}