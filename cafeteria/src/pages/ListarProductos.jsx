import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function ListarProductos() {
  const [productos, setProductos] = useState([]);

  const cargarProductos = async () => {
    const snap = await getDocs(collection(db, "products"));
    const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setProductos(lista);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const borrarProducto = async (id) => {
    if (!confirm("¿Seguro que quieres borrar este producto?")) return;

    await deleteDoc(doc(db, "products", id));
    cargarProductos();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Productos</h2>

      {productos.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 12,
            borderRadius: 8,
          }}
        >
          <h3>{p.nombre}</h3>
          <p>Precio: ${p.precio}</p>
          <p>Categoría: {p.categoria}</p>

          {p.imagen && (
            <img
              src={p.imagen}
              alt=""
              style={{ width: 100, borderRadius: 6, marginBottom: 10 }}
            />
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <Link to={`/admin/editar-producto/${p.id}`}>
              <button>Editar</button>
            </Link>

            <button onClick={() => borrarProducto(p.id)}>Borrar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
