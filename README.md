# 🌐 Hub de Recursos Humanos — Electronics México

Hub interno tipo PWA para empleados de Electronics México. Permite acceso rápido a herramientas internas (gym, suministros, vacaciones, préstamos, nómina, etc.) desde cualquier dispositivo.

## ✨ Características

- 🎯 **Dial dinámico** que se reconfigura según las filas del Google Sheet
- 📱 **PWA instalable** en celular, tablet o desktop
- ⚡ **Funciona offline** después de la primera carga
- 🔄 **Lee de Google Sheets** en tiempo real (sin necesidad de redeploy)
- 🎨 **Sidebars contextuales** con calendario, anuncios, accesos rápidos, cumpleaños
- 🌙 **Modo oscuro corporativo** con efectos de partículas y degradados

---

## 📁 Estructura del repo

```
HUB/
├── index.html                    # App principal
├── manifest.webmanifest          # Metadata PWA
├── service-worker.js             # Cache offline
├── logo-electronics.png          # Logo Electronics México
├── icon-192.png                  # Ícono Android
├── icon-512.png                  # Ícono Android HD
├── icon-192-maskable.png         # Ícono Android adaptable
├── icon-512-maskable.png         # Ícono Android adaptable HD
├── apple-touch-icon.png          # Ícono iOS home screen
├── favicon-32.png                # Favicon navegador
├── favicon-16.png                # Favicon navegador (pequeño)
├── Setup_Hub.gs                  # Script para Google Sheets (no se despliega)
└── README.md                     # Esta guía
```

---

## 🚀 Despliegue en GitHub Pages

### 1. Sube todos los archivos a la raíz del repo

Asegúrate de que el repo se llame **HUB** y todos los archivos estén en la raíz (NO dentro de subcarpetas).

### 2. Activa GitHub Pages

1. Ve a `https://github.com/v-w04/HUB/settings/pages`
2. En **Source**, selecciona: `Deploy from a branch`
3. En **Branch**, selecciona: `main` + carpeta `/ (root)`
4. Click **Save**
5. Espera 1-2 minutos al primer deploy

### 3. Accede al hub

```
https://v-w04.github.io/HUB/
```

---

## 📊 Conexión con Google Sheets

### Configuración inicial del Sheet (UNA SOLA VEZ)

1. Abre tu Google Sheet del Hub
2. Menú **Extensiones → Apps Script**
3. Borra el código por defecto y pega TODO el contenido de `Setup_Hub.gs`
4. Guarda (`Ctrl+S`), ponle nombre "Setup Hub"
5. Cierra la pestaña de Apps Script y **refresca el Sheet**
6. Verás un nuevo menú **🌐 Hub** en la barra superior
7. Click en **🌐 Hub → 🚀 Inicializar todas las hojas**
8. Autoriza permisos cuando te lo pida (es seguro, es tu propio script)

Esto crea/formatea automáticamente estas hojas con datos de ejemplo:

| Hoja | Para qué sirve |
|------|---------------|
| `HUB` | Módulos principales del dial (ya existía) |
| `CALENDARIO` | Eventos del sidebar izquierdo |
| `ANUNCIOS` | Avisos del sidebar izquierdo |
| `ACCESOS_RAPIDOS` | Links rápidos del sidebar izquierdo |
| `NOVEDADES` | Card del sidebar derecho |
| `CUMPLEANOS` | Cumpleañeros del mes (sidebar derecho) |

### CRÍTICO: Hacer el Sheet público

Para que el hub web pueda leer del Sheet:

1. En el Sheet, botón **Compartir** (esquina superior derecha)
2. Sección **Acceso general** → cambiar a **"Cualquier persona con el enlace"**
3. Rol: **Lector**
4. Botón **Listo**

Sin este paso el hub mostrará el indicador amarillo **"Modo offline"** y usará los datos de respaldo hardcodeados en lugar de los del Sheet.

---

## 🔄 Cómo actualizar el contenido

### Agregar/modificar un módulo del dial

Solo edita la hoja `HUB` en Google Sheets:
- Agregar fila → aparece nuevo slice automáticamente
- Borrar fila → desaparece el slice
- Modificar URL → el cambio se ve al refrescar

El layout del dial se recalcula solo (1 módulo = anillo completo, 6 módulos = hexagonal, 8 = octagonal, etc.).

### Actualizar el diseño / código

Cuando hagas cambios al `index.html` o demás archivos:

1. Edita el archivo en GitHub (o súbelo de nuevo)
2. **Importante:** abre `service-worker.js` y cambia la versión:
   ```javascript
   const CACHE_VERSION = 'v1.0.0';  // ← Cambia a v1.0.1, v1.1.0, etc.
   ```
   Esto fuerza a los celulares de los empleados a descargar la nueva versión.
3. Commit y push

---

## 📱 Instalar como app en el celular

### iPhone / iPad
1. Abre `https://v-w04.github.io/HUB/` en Safari
2. Botón **Compartir** (cuadrado con flecha arriba)
3. **"Añadir a pantalla de inicio"**

### Android
1. Abre la URL en Chrome
2. Menú (⋮) → **"Instalar app"** o **"Agregar a pantalla de inicio"**

### Windows / Mac
1. Abre la URL en Chrome o Edge
2. Ícono de instalación en la barra de direcciones (computadora con flecha)

---

## 🛠️ Stack técnico

- HTML/CSS/JS puros (sin frameworks)
- Font Awesome 6 (CDN)
- Google Sheets como CMS vía endpoint público gviz/csv
- Service Worker para PWA offline
- Sin backend propio ni API keys

---

## 🆘 Troubleshooting

**El hub muestra "Modo offline" amarillo**
→ El Sheet no está compartido como público. Ver sección "Hacer el Sheet público".

**No veo mis cambios después de editar el Sheet**
→ Refresca con `Ctrl+Shift+R` (hard reload), o presiona el botón 🔄 en el topbar.

**Después de actualizar `index.html` los usuarios siguen viendo la versión vieja**
→ Olvidaste subir la versión del `service-worker.js`. Edítalo, cambia `CACHE_VERSION` y haz commit.

**Los íconos no aparecen al instalar la PWA en el celular**
→ Verifica que los archivos `icon-*.png` estén subidos a la raíz del repo (no en subcarpetas).

---

**Versión:** v3.0
**Mantenedor:** Electronics México
