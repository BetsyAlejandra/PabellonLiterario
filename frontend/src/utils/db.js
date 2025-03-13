import { openDB } from 'idb';

const DB_NAME = 'pabellon-literario';
const STORE_LIBRARY = 'library';
const STORE_CHAPTERS = 'chapters';

async function deleteOldDB() {
  await indexedDB.deleteDatabase(DB_NAME);
  console.log("🗑️ Base de datos eliminada. Se creará una nueva.");
}

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("pabellon-literario", 2);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Verifica si ya existe antes de crear
      if (!db.objectStoreNames.contains("library")) {
        db.createObjectStore("library", { keyPath: "_id" });
      }
      if (!db.objectStoreNames.contains("chapters")) {
        db.createObjectStore("chapters", { keyPath: "chapterId", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject("Error al abrir IndexedDB:", event.target.error);
    };
  });
};



export async function saveLibrary(books) {
  const db = await initDB();
  if (!db) {
    console.error("❌ No se pudo inicializar IndexedDB.");
    return;
  }

  if (!db.objectStoreNames.contains(STORE_LIBRARY)) {
    console.error("🚨 Store 'library' no encontrada en IndexedDB.");
    return;
  }

  const tx = db.transaction(STORE_LIBRARY, 'readwrite');
  const store = tx.objectStore(STORE_LIBRARY);

  console.log("💾 Guardando en IndexedDB:", books);

  for (const book of books) {
    await store.put(book);
  }

  await tx.done;
}


export async function getLibrary() {
  const db = await initDB();
  if (!db) {
    console.error("❌ No se pudo inicializar IndexedDB.");
    return [];
  }

  const tx = db.transaction(STORE_LIBRARY, 'readonly');
  const store = tx.objectStore(STORE_LIBRARY);
  const library = await store.getAll();

  console.log("📂 Recuperando biblioteca de IndexedDB:", library);
  return library;
}

export const saveChapters = async (chapters) => {
  try {
      const db = await initDB();
      const tx = db.transaction("chapters", "readwrite");
      const store = tx.objectStore("chapters");

      for (const chapter of chapters) {
          store.put(chapter);
      }

      await tx.complete;
      console.log("✅ Capítulos guardados en IndexedDB");
  } catch (error) {
      console.error("❌ Error guardando capítulos en IndexedDB:", error);
  }
};


export async function getChapter(chapterId) {
  const db = await initDB();
  const chapter = await db.get(STORE_CHAPTERS, chapterId);
  if (!chapter) {
    console.warn(`⚠️ Capítulo ${chapterId} no encontrado en IndexedDB.`);
  }
  return chapter;
}