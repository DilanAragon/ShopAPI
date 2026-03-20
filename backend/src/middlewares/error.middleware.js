const errorMiddleware = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url} →`, err.message)

  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Recurso no encontrado' })
  }

  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'campo'
    return res.status(409).json({ message: `El ${field} ya está en uso` })
  }

  const status = err.status || 500
  const message = err.message || 'Error interno del servidor'

  res.status(status).json({ message })
}

module.exports = errorMiddleware