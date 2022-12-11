export enum ControllerPrefix {
  GLOBAL = 1,
  USER,
  DOC,
  FOLDER,
}

export type ExceptionCode = `${number}_${ControllerPrefix}`
