// import {
//   setupIndexedDB,
//   addKey,
//   getKey,
//   deleteKey,
// } from "../utils/keyManagement";

// import { describe, expect, test, beforeAll } from "@jest/globals";
// //import { DoneCallback } from "@jest/types";
// //import { jest } from "jest";
// import * as jest from "jest";

// describe("IndexedDB operations", () => {
//   beforeAll((done/*: () => void*/) => {
//     setupIndexedDB();
//     // Wait for the database to be set up
//     setTimeout(() => {
//       done();
//     }, 1000);
//   });

//   test("addKey adds a key to the database", (done/*: () => void*/) => {
//     console.log("Adding key to the database");
//     addKey("walletAddress1", "cid1", "secretKey1");

//     setTimeout(() => {
//       const request = indexedDB.open("KeyDatabase", 1);
//       request.onsuccess = function (event) {
//         console.log("KeyDatabase opened successfully");
//         const db = (event.target as IDBOpenDBRequest).result;
//         const transaction = db.transaction(["keys"], "readonly");
//         const store = transaction.objectStore("keys");
//         console.log("Getting key from the store");
//         const getRequest = store.get(["walletAddress1", "cid1"]);

//         getRequest.onsuccess = function (event) {
//           const result = (event.target as IDBRequest).result;
//           console.log("Key added:", result);
//           try {
//             expect(result).toEqual({
//               walletAddress: "walletAddress1",
//               cid: "cid1",
//               secretKey: "secretKey1",
//             });
//             done();
//           } catch (error) {
//             console.error("Expectation failed:", error);
//             done(error);
//           }
//         };

//         getRequest.onerror = function (event) {
//           console.error(
//             "Error retrieving key:",
//             (event.target as IDBRequest).error
//           );
//           done(new Error("Failed to retrieve key"));
//         };

//       request.onerror = function (event) {
//         console.error(
//           "Database error:",
//           (event.target as IDBOpenDBRequest).error
//         );
//         done();
//       };
//     }, 1000);
//   }, 10000);

//   /*test("getKey retrieves a key from the database", (done: () => void) => {
//     getKey(1, (result) => {
//       console.log("Key retrieved:", result);
//       expect(result.key).toBe("testKey");
//       done();
//     });
//   });

//   test("deleteKey deletes a key from the database", (done: () => void) => {
//     deleteKey(1);

//     setTimeout(() => {
//       getKey(1, (result) => {
//         console.log("Key after deletion:", result);
//         expect(result).toBeUndefined();
//         done();
//       });
//     }, 1000);
//   });*/
// });

import {
  setupIndexedDB,
  addKey,
  getKey,
  deleteKey,
} from "../utils/keyManagement";

import { describe, expect, test, beforeAll } from "@jest/globals";

describe("IndexedDB operations", () => {
  beforeAll((done) => {
    setupIndexedDB();
    // Wait for the database to be set up
    setTimeout(() => {
      done();
    }, 1000);
  });

  test("addKey adds a key to the database", (done) => {
    addKey("walletAddress1", "cid1", "secretKey1");

    const request = indexedDB.open("KeyDatabase", 1);
    request.onsuccess = function (event) {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["keys"], "readonly");
      const store = transaction.objectStore("keys");
      const getRequest = store.get(["walletAddress1", "cid1"]);

      getRequest.onsuccess = function (event) {
        const result = (event.target as IDBRequest).result;
        console.log("Key added:", result);
        try {
          expect(result).toEqual({
            walletAddress: "walletAddress1",
            cid: "cid1",
            secretKey: "secretKey1",
          });
          done();
        } catch (error) {
          console.error("Expectation failed:", error);
          done();
        }
      };

      getRequest.onerror = function (event) {
        console.error(
          "Error retrieving key:",
          (event.target as IDBRequest).error
        );
        done();
      };
    };

    request.onerror = function (event) {
      console.error(
        "Database error:",
        (event.target as IDBOpenDBRequest).error
      );
      done(new Error("Database error"));
    };
  }, 10000);
});
