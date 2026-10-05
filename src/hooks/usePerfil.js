import { useLocalStorage } from './useLocalStorage.js'

// Perfil del estudiante. Funciona como un inicio de sesión simulado (no hay backend).
export function usePerfil() {
  const [perfil, setPerfil] = useLocalStorage('perfil_unab', null)

  function guardarPerfil(datos) {
    setPerfil(datos)
  }

  return { perfil, guardarPerfil }
}
