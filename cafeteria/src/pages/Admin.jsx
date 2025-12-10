import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Admin() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(lista);
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Panel Admin</h1>

      {products.length === 0 ? (
        <p>No hay productos cargados.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                width: 250,
                padding: 15,
                border: "1px solid #ccc",
                borderRadius: 8,
                background: "#f8f8f8",
              }}
            >
              {p.imagen && (
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  style={{ width: "100%", height: 150, objectFit: "cover" }}
                />
              )}

              <h3>{p.nombre}</h3>
              <p>${p.precio}</p>
              <p>{p.categoria}</p>
              <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>{p.descripcion}</p>

              {p.options && Object.keys(p.options).length > 0 && (
                <div>
                  {Object.entries(p.options).map(([key, values]) => (
                    <p key={key}>
                      <strong>{key}:</strong> {values.join(", ")}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
