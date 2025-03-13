import { openDB } from 'idb';

const DB_NAME = 'pabellon-literario';
const STORE_LIBRARY = 'library';
const STORE_CHAPTERS = 'chapters'; 

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_LIBRARY)) {
        db.createObjectStore(STORE_LIBRARY, { keyPath: '_id' });
      }
      if (!db.objectStoreNames.contains(STORE_CHAPTERS)) {
        db.createObjectStore(STORE_CHAPTERS, { keyPath: 'chapterId' }); 
      }
    },
  });
}

export async function saveLibrary(books) {
  const db = await initDB();
  const tx = db.transaction(STORE_LIBRARY, 'readwrite');
  const store = tx.objectStore(STORE_LIBRARY);
  for (const book of books) {
    store.put(book);
  }
  await tx.done;
}

export async function getLibrary() {
  const db = await initDB();
  return db.getAll(STORE_LIBRARY);
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