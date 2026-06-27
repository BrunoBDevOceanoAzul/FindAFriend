import { app } from './app'

const PORT = Number(process.env.PORT) || 3334

app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/docs`)
})