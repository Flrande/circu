export enum ControllerOrModulePrefix {
  GLOBAL = 1,
  Auth,
  USER,
  DOC,
  FOLDER,
}

export type ExceptionCode = `${number}_${ControllerOrModulePrefix}`
