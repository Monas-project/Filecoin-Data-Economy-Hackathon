import {
  setupIndexedDB,
  addKey,
  getKey,
  deleteKey,
} from "../utils/keyManagement";

import { describe, expect, test, beforeAll } from "@jest/globals";
//import { DoneCallback } from "@jest/types";
//import { jest } from "jest";
import * as jest from "jest";

describe("IndexedDB operations", () => {
  beforeAll((done: () => void) => {
    setupIndexedDB();
    // Wait for the database to be set up
    setTimeout(() => {
      done();
    }, 1000);
  });

  test("addKey adds a key to the database", (done: () => void) => {
    addKey("testKey");

    setTimeout(() => {
      getKey(1, (result) => {
        expect(result.key).toBe("testKey");
        done();
      });
    }, 1000);
  });

  test("getKey retrieves a key from the database", (done: () => void) => {
    getKey(1, (result) => {
      expect(result.key).toBe("testKey");
      done();
    });
  });

  test("deleteKey deletes a key from the database", (done: () => void) => {
    deleteKey(1);

    setTimeout(() => {
      getKey(1, (result) => {
        expect(result).toBeUndefined();
        done();
      });
    }, 1000);
  });
});
