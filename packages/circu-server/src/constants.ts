export const corsOrigins: string[] = ["https://localhost:5000"]
if (process.env.CLIENT_URL) {
  corsOrigins.push(process.env.CLIENT_URL)
}
if (process.env.PRIVATE_PLAYGROUND_URL) {
  corsOrigins.push(process.env.PRIVATE_PLAYGROUND_URL)
}
