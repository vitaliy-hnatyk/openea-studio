import { ArchitectureRepository } from '../types/architecture';

const DB_NAME = 'openea-studio-db';
const DB_VERSION = 1;
const STORE_NAME = 'repositories';
const CURRENT_REPOSITORY_ID = 'current';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open IndexedDB'));
  });
}

function runTransaction<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDatabase().then((db) => new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = operation(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error('IndexedDB transaction failed'));
    };
  }));
}

export async function loadRepositoryFromIndexedDb(): Promise<ArchitectureRepository | null> {
  const result = await runTransaction<{ id: string; repository: ArchitectureRepository } | undefined>('readonly', (store) => store.get(CURRENT_REPOSITORY_ID));
  return result?.repository ?? null;
}

export async function saveRepositoryToIndexedDb(repository: ArchitectureRepository): Promise<void> {
  await runTransaction<IDBValidKey>('readwrite', (store) => store.put({ id: CURRENT_REPOSITORY_ID, repository, updatedAt: new Date().toISOString() }));
}

export async function clearRepositoryFromIndexedDb(): Promise<void> {
  await runTransaction<undefined>('readwrite', (store) => store.delete(CURRENT_REPOSITORY_ID));
}
