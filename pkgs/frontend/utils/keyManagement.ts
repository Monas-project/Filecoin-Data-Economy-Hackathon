export function setupIndexedDB() {
  const request = indexedDB.open("KeyDatabase", 1);

  request.onupgradeneeded = function (event) {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    if (!db.objectStoreNames.contains("keys")) {
      db.createObjectStore("keys", { keyPath: ["walletAddress", "cid"] });
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
export function addKey(walletAddress: string, cid: string, secretKey: string) {
  const request = indexedDB.open("KeyDatabase", 1);

  request.onsuccess = function (event) {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    const transaction = db.transaction(["keys"], "readwrite");
    const store = transaction.objectStore("keys");

    const getRequest = store.get([walletAddress, cid]);

    getRequest.onsuccess = function (event) {
      const result = (event.target as IDBRequest).result;

      if (result) {
        console.log("Record already exists, skipping addition:", result);
        return;
      }
      const addRequest = store.add({
        walletAddress: walletAddress,
        cid: cid,
        secretKey: secretKey,
      });

      addRequest.onsuccess = function () {
        console.log("Key added successfully");
      };

      addRequest.onerror = function (event) {
        const target = event.target as IDBRequest;
        console.error("Add request error:", target.error);
      };
    };

    getRequest.onerror = function (event) {
      const target = event.target as IDBRequest;
      console.error("Get request error:", target.error);
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
export function getKey(
  walletAddress: string,
  cid: string,
  callback: (result: any) => void
) {
  const request = indexedDB.open("KeyDatabase", 1);

  request.onsuccess = function (event) {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    const transaction = db.transaction(["keys"], "readonly");
    const store = transaction.objectStore("keys");
    const keyRequest = store.get([walletAddress, cid]);

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
export function deleteKey(walletAddress: string, cid: string) {
  const request = indexedDB.open("KeyDatabase", 1);

  request.onsuccess = function (event) {
    const target = event.target as IDBOpenDBRequest;
    const db = target.result;
    const transaction = db.transaction(["keys"], "readwrite");
    const store = transaction.objectStore("keys");
    store.delete([walletAddress, cid]);

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
