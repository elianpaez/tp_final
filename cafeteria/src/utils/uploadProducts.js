import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { localProducts } from "../data/localProducts";

export async function uploadProductsOnce() {
    try {
        const snapshot = await getDocs(collection(db, "products"));

        if (!snapshot.empty) {
            console.log("✔️ Los productos ya existen en Firestore");
            return;
        }

        console.log("⬆️ Subiendo productos iniciales...");

        for (const p of localProducts) {
            await addDoc(collection(db, "products"), p);
        }

        console.log("🎉 Productos subidos correctamente");
    } catch (error) {
        console.error("❌ Error al subir productos:", error);
    }
}
