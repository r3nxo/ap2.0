# R$Q - Guía de Uso del Sistema de Validación de Filtros

## 📋 Índice

1. [Inicio Rápido](#inicio-rápido)
2. [Prevención de Duplicados](#prevención-de-duplicados)
3. [Validación de Condiciones](#validación-de-condiciones)
4. [Notificaciones](#notificaciones)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Inicio Rápido

### Flujo Recomendado

**PASO 1: Ve a Templates**
```
Dashboard → Filters → Templates
```

**PASO 2: Elige un Template**
- Busca en categorías: Goals, Shots, Cards, etc.
- Lee descripción y success rate

**PASO 3: Importa**
- Click en botón "Importar" 
- Sistema valida automáticamente

**PASO 4: Habilita Notificaciones (Opcional)**
- Si quieres alertas cuando matches filtro
- Sistema valida condiciones primero

---

## 🔐 Prevención de Duplicados

### ¿Qué es un Duplicado?

Un filtro es **duplicado** si:
- ✓ Tiene el MISMO nombre
- ✓ Tiene las MISMAS condiciones

### Evitarlo

#### ✅ PERMITIDO (no son duplicados)

| Nombre 1 | Nombre 2 | Condiciones | ¿Duplicado? |
|----------|----------|-------------|-----------|
| "Over 9.5 Corners" | "Over 9.5 Corners v2" | Igual | ❌ NO (nombres distintos) |
| "Over 9.5 Corners" | "Over 9.5 Corners" | Diferente | ❌ NO (condiciones distintas) |

#### ❌ NO PERMITIDO (son duplicados)

| Nombre | Condiciones | Acción |
|--------|-------------|--------|
| "Over 9.5 Corners" | min:10, team:total | ❌ BLOQUEADO |

### Si Ves Error de Duplicado

**Alert:**
```
⚠️ Ya existe un filtro con el nombre "Over 9.5 Corners"
Consejo: Puedes renombrar o cambiar sus condiciones
```

**Soluciones:**

**Opción A: Renombrar**
- Importa de nuevo como "Over 9.5 Corners - v2"
- ✅ Ahora es diferente

**Opción B: Cambiar Condiciones**
- Importa como "Over 8.5 Corners" (min: 9 en lugar de 10)
- ✅ Ahora es diferente

**Opción C: Usar Existente**
- Si ya tienes el filtro, úsalo directamente
- No necesitas importar duplicado

---

## ⚠️ Validación de Condiciones

### Reglas Automáticas

El sistema **rechaza** condiciones que:

### 1. Tienen Min > Max

```
INCORRECTO:
  Min corners: 10
  Max corners: 5
  ❌ ERROR: "min no puede ser mayor que max"

CORRECTO:
  Min corners: 5
  Max corners: 10
  ✅ OK
```

### 2. Valores Fuera de Rango

```
INCORRECTO:
  Possession: 150%
  ❌ ERROR: "Posesión debe estar 0-100"

CORRECTO:
  Possession: 60-75%
  ✅ OK
```

### 3. Team Invalid

```
INCORRECTO:
  Goals team: "other"
  ❌ ERROR: "team debe ser home/away/total"

CORRECTO:
  Goals team: "total"
  ✅ OK
```

### Mensaje de Error en Formulario

Si ves error rojo:
```
❌ Errores de validación:
  - Cornuri (total): min no puede ser > max
  - Cartonașe galbene: valor fuera de rango
```

**Acción:** Corrige los valores y guarda de nuevo

---

## 🔔 Notificaciones

### Requisitos para Activar

**Las notificaciones SOLO funcionan si:**

1. ✅ Tienes al menos UNA condición con valores
2. ✅ Checkbox "Enviar notificaciones" está marcado
3. ✅ El filtro NO es experimental
4. ✅ Navegador tiene permiso de notificaciones

### Condiciones "Completas"

Una condición está completa si tiene:
- Mínimo (ej: min: 5 corneres)
- **O** Máximo (ej: max: 15 corneres)
- **O** Ambos (ej: 5-10 corneres)

### Ejemplos

✅ **COMPLETO - Notificaciones ACTIVADAS:**
```
Filtro: "Over 9.5 Corners"
  Min: 10 corneres ← ✅ Tiene valor
  Notificaciones: ON
  Resultado: 🔔 ALERTAS ACTIVADAS
```

✅ **COMPLETO - Notificaciones ACTIVADAS:**
```
Filtro: "Corners Range"
  Min: 5, Max: 15 corneres ← ✅ Tiene valores
  Notificaciones: ON
  Resultado: 🔔 ALERTAS ACTIVADAS
```

❌ **INCOMPLETO - Notificaciones DESACTIVADAS:**
```
Filtro: "Sin Condiciones"
  (No defines min ni max) ← ❌ Vacío
  Notificaciones: ON (intent)
  Resultado: 🔕 NOTIFICACIONES DESACTIVADAS
  
Alert: "Las notificaciones requieren condiciones completas"
```

### Permiso del Navegador

**Primera vez:**
```
Browser: "¿Permitir notificaciones de R$Q?"
         [Allow] [Block]
```

**Si bloqueas:**
```
Settings → Notificaciones → R$Q → Allow
```

---

## 🧪 Templates Experimentales

### Qué Son

Templates marcados con 🧪 están siendo **testeados**.

### Comportamiento Especial

| Aspecto | Normal | Experimental |
|--------|--------|------------|
| **Notificaciones** | ✅ Activas por defecto | 🧪 Inactivas (debes activar) |
| **Monitoreo** | Sin tracking | Monitoreado para validar |
| **Avisos** | Sin avisos | "Esta es versión de prueba" |

### Importar Experimental

```
Usuario: Click "High Scoring Combo" (🧪)

Alert:
  🧪 Filtro experimental importado!
  Monitoreada para validar resultados.

Sistema:
  ✓ Importa sin notificaciones
  ✓ Tu monitorea resultados
  ✓ Si funciona bien → lo promociona
```

### Tus Resultados Importan

Si usas experimentales:
- Comparte feedback en Discord/Telegram
- Qué funcionó bien
- Qué mejorar
- Sugerencias nuevas

---

## 🛠️ Generar Filtro Manual

### Paso a Paso

**1. Abre Generador**
```
Dashboard → Filters → Create New
```

**2. Rellena Datos Básicos**
```
Nombre: "Mi Filtro Especial"
Descripción: "Para Champions League"
Activo: ON
```

**3. Agrega Condiciones**
```
Selecciona un tipo: Corners, Goals, Shots, etc.
Define Min/Max: ej. Min: 8, Max: 20
```

**4. Valida Automáticamente**
- Sistema verifica min <= max ✅
- Sistema verifica rangos realistas ✅

**5. Habilita Notificaciones (Opcional)**
```
IF condiciones completas:
  ✓ Puedes activar notificaciones
ELSE:
  ✗ Debe tener al menos 1 valor definido
```

**6. Guarda**
```
Click "Guardar"
✅ Filtro creado
```

---

## ❌ Troubleshooting

### Error: "Duplicate filter"

**Causa:** Ya existe filtro con mismo nombre y condiciones

**Solución:**
- Renombra el filtro
- O cambia las condiciones
- Intenta importar de nuevo

---

### Error: "Invalid filter conditions"

**Causa:** Alguna condición tiene error (min > max, etc.)

**Solución:**
- Lee los errores específicos
- Corrige valores
- Intenta de nuevo

---

### Error: "Notifications require complete conditions"

**Causa:** Intentas activar notificaciones sin condiciones

**Solución:**
- Define al menos min O max para una condición
- Ejemplo: Min corners: 8
- Entonces podrás activar notificaciones

---

### Notificaciones No Llegan

**Checklist:**

1. ¿Activó "Enviar notificaciones"?
   - ✅ Dashboard → Filters → Click filtro → Check "Notificaciones"

2. ¿Navegador tiene permiso?
   - ✅ Settings → Notificaciones → R$Q → Allow

3. ¿Tiene condiciones completas?
   - ✅ Verifica: min O max definidos

4. ¿Está en mute?
   - ✅ Check browser notification settings

5. ¿Pestaña activa?
   - ✅ Notificaciones llegan aunque R$Q no esté abierto

---

### Templates No Se Ven

**Solución:**
- Abre: http://localhost:3002/dashboard/filters/templates
- Presiona Ctrl+F5 (recarga forzada)
- Busca por categoría (dropdown superior)

---

## 📊 Dashboard de Filtros

### Información Disponible

Para cada filtro ves:
- Nombre y descripción
- Condiciones resumen
- Notificaciones: ON/OFF 🔔
- Status: Activo/Inactivo ✅/❌
- Botones: Edit, Delete, Toggle

### Editar Filtro

```
Click en filtro
↓
Modifica nombre/condiciones
↓
Guarda
```

**Nota:** Sistema valida igual que creación

### Eliminar Filtro

```
Click "Delete"
↓
Confirmación
↓
Filtro eliminado permanentemente
```

---

## 🎯 Tips & Tricks

### ✅ Mejores Prácticas

1. **Nombres Descriptivos**
   - ❌ "Filtro 1"
   - ✅ "Champions Over 9.5 Corners"

2. **Condiciones Específicas**
   - ❌ "Algo de goles"
   - ✅ "3-5 goles totales"

3. **Prueba Antes de Activar**
   - Crea filtro
   - Observa resultados 10-20 matches
   - Entonces activar notificaciones

4. **Valida Manualmente**
   - Si error raro, refreshca página
   - Abre DevTools (F12) → Console
   - Busca mensajes rojos

---

## 📞 Soporte

Problemas o preguntas:

- 💬 Discord: #r$q-support
- 📧 Email: support@rsq.app
- 🐛 Bug Report: GitHub Issues

---

**Última actualización:** 2026-01-08  
**Versión:** 1.0
