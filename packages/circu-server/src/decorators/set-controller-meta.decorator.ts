import { SetMetadata } from "@nestjs/common"

export const CONTROLLER_META = "CONTROLLER_META"

export const ControllerMeta = (...values: number[]) => SetMetadata(CONTROLLER_META, values)
