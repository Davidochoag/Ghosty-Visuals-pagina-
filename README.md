# Ghostyvisual — Portafolio

Sitio estático (HTML + CSS + JS, sin frameworks ni build). Se publica igual que tu sitio actual: arrastrando la carpeta a Netlify.

Archivos: `index.html`, `styles.css`, `script.js`, `videos.json` y la carpeta `assets/` (ahí viven las dos versiones de tu logo). Al publicar, sube la carpeta completa — si falta `assets/`, el logo no va a cargar.

## Cómo agregar un video nuevo

Abre `videos.json` y agrega un objeto al final de la lista (no toques `index.html` ni `script.js`):

```json
{
  "id": "ID_DE_YOUTUBE",
  "title": "Título del proyecto",
  "description": "Una línea describiendo el trabajo",
  "category": "Interviews"
}
```

- **id**: la parte final de la URL del video, ej. en `youtube.com/watch?v=ABC123` el id es `ABC123`.
- **category**: debe ser exactamente una de estas seis: `Interviews`, `Corporativo`, `Gaming`, `Comercial`, `Artistas`, `Fútbol` (respeta mayúsculas y tildes).
- **featured** (opcional): pon `"featured": true` para que ese video aparezca como preview (con reproducción automática y en silencio) en el inicio de la página. Máximo 3 se muestran ahí — si marcas más de 3, solo se usan los primeros 3 que encuentre. Si marcas menos de 3, los espacios que faltan muestran un aviso de "Agrega texto" / "Agrega video" en vez de romperse.
- La miniatura se genera sola desde YouTube — no subas ninguna imagen.
- No olvides una coma `,` después del objeto anterior si no es el último de la lista.

Guarda el archivo y ya está: no hay que compilar nada.

## Cómo agregar o cambiar una habilidad

Al inicio de `script.js` está el arreglo `SKILLS`. Agrega o edita un nombre ahí (misma lógica: una línea, sin tocar el HTML).

## Publicar cambios en Netlify

- Si ya conectaste el sitio a un repositorio de GitHub: haz commit y push de los archivos que cambiaste (normalmente solo `videos.json`) y Netlify vuelve a publicar solo.
- Si publicas arrastrando la carpeta al panel de Netlify: vuelve a arrastrar la carpeta completa cada vez.

## Si más adelante quieres editar sin tocar código en absoluto

Cuando quieras una pantalla tipo "formulario" en vez de editar el JSON a mano, la opción más simple sobre Netlify es **Decap CMS** (antes "Netlify CMS"): es gratis, se conecta a tu repositorio de GitHub y te da una interfaz web para agregar/editar proyectos, y por dentro sigue guardando todo en un archivo de datos como este. No es necesario para que el sitio funcione hoy, es solo un paso opcional si con el tiempo prefieres no tocar el `.json` directamente.
