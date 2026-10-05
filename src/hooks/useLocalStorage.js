import { useEffect, useState } from 'react'

// Igual que useState, pero el valor también se guarda en localStorage.
// valorInicial se usa solo si no hay nada guardado (puede ser una función).
export function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave)
      if (guardado !== null) return JSON.parse(guardado)
    } catch {
      // si lo guardado está dañado, usamos el valor inicial
    }
    return typeof valorInicial === 'function' ? valorInicial() : valorInicial
  })

  // cada vez que cambia el valor, lo guardamos
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor))
    } catch {
      // si el navegador no deja guardar, la app sigue funcionando igual
    }
  }, [clave, valor])

  return [valor, setValor]
}
