import { mkdirp } from 'mkdirp'
import { readFile, writeFile } from 'node:fs/promises'
import * as path from 'node:path'

export async function loadJSON(jsonPath: string) {
  return JSON.parse((await readFile(jsonPath)).toString())
}

export async function saveJSON(jsonPath: string, json: any) {
  await mkdirp(path.dirname(jsonPath))
  await writeFile(jsonPath, JSON.stringify(json, null, 2))
}
