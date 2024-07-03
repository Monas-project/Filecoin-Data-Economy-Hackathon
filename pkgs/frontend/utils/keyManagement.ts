export function setupIndexedDB() {
  const request = indexedDB.open("KeyDatabase", 1);

  request.onupgradeneeded = function (event) {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    if (!db.objectStoreNames.contains("keys")) {
      db.createObjectStore("keys", { keyPath: "id", autoIncrement: true });
    }
  };
  request.onerror = function (event) {
    const target = event.target as IDBOpenDBRequest;
    console.error("Database error", target.error);
  };
  request.onsuccess = function (event) {
    console.log("Database opened successfully");
  };
}

/*
Add key operation
引数
- key: string
*/
export function addKey(key: string) {
  const request = indexedDB.open("KeyDatabase", 1);

  request.onsuccess = function (event) {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    const transaction = db.transaction(["keys"], "readwrite");
    const store = transaction.objectStore("keys");
    store.add({ key: key }); // store key

    transaction.oncomplete = function () {
      console.log("Key added successfully");
    };

    transaction.onerror = function (event) {
      const target = event.target as IDBRequest;
      console.error("Transaction error:", target.error);
    };
  };

  request.onerror = function (event) {
    const target = event.target as IDBRequest;
    console.error("Database error:", target.error);
  };
}

/*
Call key operation
引数
- id: number
return
- key: string?
*/
export function getKey(id: number, callback: (result: any) => void) {
  const request = indexedDB.open("KeyDatabase", 1);

  request.onsuccess = function (event) {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    const transaction = db.transaction(["keys"], "readonly");
    const store = transaction.objectStore("keys");
    const keyRequest = store.get(id);

    keyRequest.onsuccess = function (event) {
      const target = event.target as IDBRequest;
      callback(target.result);
    };
    keyRequest.onerror = function (event) {
      console.error("key retrieval error:", target.error);
    };
  };
  request.onerror = function (event) {
    const target = event.target as IDBRequest;
    console.error("Database error:", target.error);
  };
}

/*
Delete key operation
引数
- id: number
*/
export function deleteKey(id: number) {
  const request = indexedDB.open("KeyDatabase", 1);

  request.onsuccess = function (event) {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    const transaction = db.transaction(["keys"], "readwrite");
    const store = transaction.objectStore("keys");
    store.delete(id);

    transaction.oncomplete = function () {
      console.log("Key deleted successfully");
    };
    transaction.onerror = function (event) {
      const target = event.target as IDBOpenDBRequest;
      console.error("Transaction error:", target.error);
    };
  };
  request.onerror = function (event) {
    const target = event.target as IDBOpenDBRequest;
    console.error("Database error:", target.error);
  };
}

setupIndexedDB();
