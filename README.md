# Mundialero ⚽

Seguí el Mundial 2026 con fixture completo, canales de TV para Argentina, filtros por país/día/canal, y favoritos persistidos.

## Stack

- **React 19** — con TypeScript estricto
- **Tailwind CSS 4** — estilos utilitarios
- **Zustand** — estado global con persistencia en localStorage
- **Vite** — build y dev server
- **React Router** — navegación client-side

## Scripts

```bash
pnpm dev       # desarrollo
pnpm build     # type-check + build producción
pnpm preview   # servidor de preview del build
```

## Funcionalidades

- **Fixture completo**: 104 partidos de fase de grupos con horarios en ARG (UTC-3)
- **Canales Argentina**: DSports, TyC Sports, Telefe, TVP, Disney+ — datos verificados contra Olé
- **Filtros**: por país, día y canal; combinables
- **Favoritos**: marcá partidos con ⭐, se persisten entre sesiones
- **Grupos**: tabla de posiciones con puntos, diferencia de gol, y destacados (top 2)

## Fuente de datos

Los horarios y canales están verificados contra la guía oficial de **Olé** para Argentina. Las sedes y equipos corresponden al Mundial 2026.
