import { handleError } from "../../lib/errors/e";
import { Preference, PreferenceInterface } from "./interface";
import { MongoPreferenceStore } from "./mongo";

const store = new MongoPreferenceStore();

export class CypherpostPreferences implements PreferenceInterface {
  async initialize(owner: string): Promise<boolean | Error> {
    try {
      const preference = {
        owner,
        cypher_json: "NotYetSet",
        last_updated: Date.now()
      };
      return store.createOne(preference);
    }
    catch (e) {
      return handleError(e);
    }
  }
  find(owner: string): Promise<Error | Preference> {
    return store.readOne(owner);
  }
  update(owner: string, cypher_json: string): Promise<boolean | Error> {
    return store.updateOne(owner, cypher_json);
  }
  remove(owner: string): Promise<boolean | Error> {
    return store.removeOne(owner)
  }

}