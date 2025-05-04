import { lolInstance } from "#src/apis";
import type { TVersion } from "#src/types";

export interface IVersionAPIResponse {
  versions: TVersion[];
}

export const getVersions = async () => {
  const versions = await lolInstance
    .get<IVersionAPIResponse>("api/versions.json")
    .json();

  return versions;
};
