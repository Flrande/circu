export const corsOrigins: string[] = []
if (process.env.CLIENT_URL) {
  corsOrigins.push(process.env.CLIENT_URL)
}
if (process.env.PRIVATE_PLAYGROUND_URL) {
  corsOrigins.push(process.env.PRIVATE_PLAYGROUND_URL)
}
