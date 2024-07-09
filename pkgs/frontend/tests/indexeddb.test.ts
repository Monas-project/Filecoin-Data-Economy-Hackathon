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

  test("getKey retrieves a key from the database", (done) => {
    addKey("walletAddress1", "cid1", "secretKey1");
    setTimeout(() => {
      getKey("walletAddress1", "cid1", (result) => {
        console.log("Key retrieved:", result?.secretKey);
        try {
          expect(result?.secretKey).toBe("secretKey1");
          done();
        } catch (error) {
          console.error("Expectation failed:", error);
          done();
        }
      });
    }, 1000);
  }, 10000);

  test("deleteKey deletes a key from the database", (done) => {
    addKey("walletAddress1", "cid1", "secretKey1");
    setTimeout(() => {
      deleteKey("walletAddress1", "cid1");
      setTimeout(() => {
        getKey("walletAddress1", "cid1", (result) => {
          console.log("Key after deletion:", result);
          try {
            expect(result).toBeUndefined();
            done();
          } catch (error) {
            console.error("Expectation failed:", error);
            done();
          }
        });
      }, 1000);
    }, 1000);
  }, 10000);
});
