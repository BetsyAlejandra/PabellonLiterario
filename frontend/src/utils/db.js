import { openDB } from 'idb';

const DB_NAME = 'pabellon-literario';
const STORE_LIBRARY = 'library';
const STORE_CHAPTERS = 'chapters';

export async function initDB() {
  try {
    console.log("🔄 Iniciando IndexedDB...");
    const db = await openDB(DB_NAME, 2, {
      upgrade(db, oldVersion) {
        console.log(`📦 DB upgrade de ${oldVersion} a 2`);

        if (!db.objectStoreNames.contains(STORE_LIBRARY)) {
          console.log("📚 Creando store 'library'");
          db.createObjectStore(STORE_LIBRARY, { keyPath: '_id' });
        } else {
          console.log("✅ Store 'library' ya existe en IndexedDB.");
        }

        if (!db.objectStoreNames.contains(STORE_CHAPTERS)) {
          console.log("📖 Creando store 'chapters'");
          db.createObjectStore(STORE_CHAPTERS, { keyPath: 'chapterId' });
        } else {
          console.log("✅ Store 'chapters' ya existe en IndexedDB.");
        }

        console.log("📜 Stores en IndexedDB:", db.objectStoreNames);
      },
    });

    console.log("✅ IndexedDB inicializado con éxito.");
    return db;
  } catch (error) {
    console.error("❌ Error al inicializar IndexedDB:", error);
  }
}

export async function saveLibrary(books) {
  const db = await initDB();
  if (!db) {
    console.error("❌ No se pudo inicializar IndexedDB.");
    return;
  }

  const tx = db.transaction(STORE_LIBRARY, 'readwrite');
  const store = tx.objectStore(STORE_LIBRARY);

  console.log("💾 Guardando en IndexedDB:", books);

  for (const book of books) {
    await store.put(book);
  }

  await tx.done;
  console.log("✅ Biblioteca guardada en IndexedDB.");
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

export async function saveChapters(chapters) {
  const db = await initDB();
  const tx = db.transaction(STORE_CHAPTERS, 'readwrite');
  const store = tx.objectStore(STORE_CHAPTERS);
  for (const chapter of chapters) {
    store.put(chapter);
  }
  await tx.done;
}


export async function getChapter(chapterId) {
  const db = await initDB();
  const chapter = await db.get(STORE_CHAPTERS, chapterId);
  if (!chapter) {
    console.warn(`⚠️ Capítulo ${chapterId} no encontrado en IndexedDB.`);
  }
  return chapter;
}