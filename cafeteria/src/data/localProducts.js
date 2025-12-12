export const localProducts = [
    { name: 'Espresso Doble', price: 3.50, desc: 'Shot intenso de nuestro blend de la casa. Rico y aromático.', imageUrl: 'https://i.pinimg.com/1200x/0a/d8/08/0ad808795de3888dfa76d6fe37ca9426.jpg', options: { Tamaño: ['Pequeño', 'Grande'], Leche: ['Entera', 'Desnatada', 'Avena'] } },
    { name: 'Latte', price: 4.90, desc: 'Con leche fresca y sirope de caramelo artesanal. Dulce y cremoso.', imageUrl: 'https://i.pinimg.com/1200x/aa/05/f7/aa05f7fa32d780474d0286ef16891ebb.jpg', options: { Sabor: ['Vainilla', 'Caramelo', 'Avellana'], Modo: ['Frio', 'Caliente'] } },
    { name: 'Muffin', price: 2.75, desc: 'Muffin con sabor a eleccion. Suave y esponjoso.', imageUrl: 'https://i.pinimg.com/736x/8d/84/17/8d841742802e3d38206671345c8a69ab.jpg', options: { Sabor: ['Chocolate', 'Vainilla', 'Marmolado'] } },
    { name: 'Chocotorta', price: 5.50, desc: 'Chocolinas, con dulce de leche y cacoa en polvo. El postre perfecto.', imageUrl: 'https://i.pinimg.com/1200x/66/b8/89/66b889e20f5668788a290fa33a9bc46a.jpg', options: {} },
    { name: 'Granizado de cafe', price: 6.00, desc: 'Especial para dias calurosos, fresco y con un tono intenso de cafe.', imageUrl: 'https://i.pinimg.com/1200x/74/50/82/745082a9f986bb7264045b5c48d117be.jpg', options: { Azucar: ['Con azucar', 'Sin azucar', 'Edulcorante'], Leche: ['Entera', 'Desnatada', 'Avena'] } },
    { name: 'Sándwich de Pollo', price: 6.95, desc: 'Pan artesanal, pollo, lechuga, tomates y aderezo a eleccion.', imageUrl: 'https://i.pinimg.com/1200x/c7/76/12/c77612b53e9c7d86c254e4b2b64c3289.jpg', options: { Aderezo: ['Mayonesa', 'Mostaza', 'Ketchup'] } },
    { name: 'Frappe', price: 5.50, desc: 'café con hielo cubierto de espuma elaborado a partir de nuestro mejor café.', imageUrl: 'https://i.pinimg.com/1200x/fb/82/32/fb8232610deb929841c2a0afc9972a36.jpg', options: { Azucar: ['Con azucar', 'Sin azucar', 'Edulcorante'], Leche: ['Entera', 'Desnatada', 'Avena'] } },
    { name: 'Cappuccino', price: 3.90, desc: 'Shot de cafe con leche cremada, especial para relajar.', imageUrl: 'https://i.pinimg.com/1200x/8e/5a/32/8e5a32b95bfe2bd29ad623aac466c2e5.jpg', options: { Azucar: ['Con azucar', 'Sin azucar', 'Edulcorante'], Leche: ['Entera', 'Desnatada', 'Avena'] } },
    { name: 'Medialuna', price: 2.00, desc: 'Medialuna tradicional, ideal para acompañar tu café de la mañana.', imageUrl: 'https://i.pinimg.com/1200x/8b/40/7c/8b407c37dbafc51dba37b07275fa0752.jpg', options: { Preparado: ['grasa', 'manteca'] } },
    { name: 'crossaint de jamon y queso', price: 3.50, desc: 'Croissant relleno de jamón y queso, perfecto para un desayuno completo.', imageUrl: 'https://i.pinimg.com/736x/c8/bb/44/c8bb4495a22b659140586209f632cd73.jpg', options: {} },
    { name: 'crossaint de dulce de leche', price: 3.75, desc: 'Croissant relleno de dulce de leche, una delicia dulce y cremosa.', imageUrl: 'https://i.pinimg.com/736x/45/ad/c8/45adc820424a506e36d75066d36b40dc.jpg', options: {} },
];

function convertProduct(p) {
  return {
    nombre: p.name,
    descripcion: p.desc,
    precio: p.price,
    imagen: p.imageUrl,
    options: p.options,
    activo: true,
    categoria: "",
    createdAt: new Date()
  };
}

export async function uploadProductsOnce() {
  const productsRef = collection(db, "products");
  const snapshot = await getDocs(productsRef);

  if (!snapshot.empty) {
    console.log("Los productos ya existen en Firestore");
    return;
  }

  console.log("Subiendo productos...");

  for (const p of localProducts) {
    await addDoc(productsRef, convertProduct(p));
  }
}