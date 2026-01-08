# Filter Validation System - R$Q

## Overview

Sistema completo de validación de filtros para prevenir duplicados, condiciones contradictorias y notificaciones incompletas.

---

## 1. ✅ VALIDACIÓN DE DUPLICADOS

### ¿Cómo Funciona?

Cuando intentas crear/importar un filtro, el sistema verifica:

1. **Mismo nombre**: Si ya existe un filtro con el mismo nombre
2. **Mismas condiciones**: Si las condiciones son idénticas a uno existente
3. **Status HTTP**: Retorna `409 Conflict` si detecta duplicado

### Comportamiento

```
Usuario intenta importar "Over 9.5 Corners"
        ↓
Sistema busca en BD filtros del usuario
        ↓
Encuentra filtro existente con MISMO NOMBRE y CONDICIONES
        ↓
Devuelve error 409: "Duplicate filter"
        ↓
Usuario ve alert: "Ya existe un filtro con ese nombre"
```

### Códigos de Error API

| Status | Motivo | Acción |
|--------|--------|--------|
| 409 | Filtro duplicado | Cambiar nombre o condiciones |
| 400 | Condiciones inválidas | Revisar validaciones |
| 401 | Usuario no autenticado | Reloguearse |

### En el Frontend

**lib/supabase.ts** - Función `createFilter()`:

```typescript
if (response.status === 409) {
  return { 
    data: null, 
    error: 'Duplicate filter - no puedes importar el mismo filtro' 
  };
}
```

**app/dashboard/filters/templates/page.tsx** - Manejador:

```typescript
if (error && error.includes('Duplicate filter')) {
  alert(`⚠️ ${error}\n\nConsejo: Cambiar nombre o condiciones`);
}
```

---

## 2. ⚠️ VALIDACIÓN DE CONDICIONES CONTRADICTORIAS

### Validaciones Automáticas

Sistema valida automáticamente:

| Condición | Validación | Ejemplo |
|-----------|-----------|---------|
| **Min > Max** | ❌ min no puede ser > max | min: 10, max: 5 → ERROR |
| **Rangos Realistas** | Warnings para valores extremos | corners max: 50 → WARNING |
| **Tipos Válidos** | Team solo: home/away/total | team: "other" → ERROR |
| **Números Válidos** | Posesión 0-100%, tiempo 0-120' | possession: 150% → ERROR |

### En el Backend

**lib/filter-validation.ts** - Función `validateFilterConditions()`:

```typescript
export function validateFilterConditions(conditions: FilterConditions): ValidationResult {
  // Verifica cada condición
  if (min !== undefined && max !== undefined && min > max) {
    errors.push(`Corners: min (${min}) no puede ser > max (${max})`);
  }
  
  return { isValid: errors.length === 0, errors, warnings };
}
```

### En el Frontend (Generador)

**app/dashboard/filters/new/page.tsx** - Validación antes de guardar:

```typescript
const validationErrors: string[] = [];

if (cornersEnabled && corners.total_min > corners.total_max) {
  validationErrors.push('Cornuri: min no puede ser > max');
}

if (validationErrors.length > 0) {
  setError(`❌ Errores de validación:\n${validationErrors.join('\n')}`);
  return;
}
```

---

## 3. 🔔 NOTIFICACIONES CON CONDICIONES COMPLETAS

### Requisito: Condiciones No Vacías

Las notificaciones SOLO se activan si:

1. Al menos UNA condición tiene valores definidos (min o max)
2. El filtro NO es experimental
3. Usuario ha activado notificaciones explícitamente

### Validación

**lib/filter-validation.ts** - Función `areConditionsComplete()`:

```typescript
export function areConditionsComplete(conditions: FilterConditions): boolean {
  // Al menos una condición debe tener valores
  const hasValues =
    (conditions.corners?.min !== undefined || conditions.corners?.max) ||
    (conditions.goals?.min !== undefined || conditions.goals?.max) ||
    // ... más condiciones
    (conditions.match_time?.min !== undefined || conditions.match_time?.max);
  
  return hasValues;
}
```

### En API de Creación

**app/api/filters/create/route.ts**:

```typescript
const conditionsComplete = areConditionsComplete(conditions);
if (!conditionsComplete && notification_enabled) {
  return NextResponse.json(
    { 
      error: 'Las notificaciones requieren condiciones completas',
      details: ['Define al menos un valor (min o max)']
    },
    { status: 400 }
  );
}

// Guardar con notificaciones desactivadas si condiciones incompletas
notification_enabled: notification_enabled && conditionsComplete,
```

### Flujo de Usuario

```
Usuario crea filtro "Corners"
Usuario activa: "Enviar notificaciones"

Generador de filtros:
  ✓ Define "min: 5" para corners
  ✓ Condiciones completas ✅
  
Sistema:
  ✓ Guarda con notifications_enabled = true
  ✓ Cuando meci match filtro → ENVÍA NOTIFICACIÓN 🔔
```

---

## 4. 🧪 TEMPLATES EXPERIMENTALES

Algunos templates vienen marcados como `experimental: true`.

### Comportamiento Especial

| Aspecto | Producción | Experimental |
|--------|-----------|--------------|
| **Notificaciones** | ✅ Activadas por defecto | ❌ Desactivadas por defecto |
| **Advertencia** | Sin avisos | "🧪 Esta es una versión de testeo" |
| **Seguimiento** | Sin tracking | Monitoreado para validar |
| **Categoría** | corners, goals, etc | "experimental" |

### Importar Template Experimental

```
Usuario: Click en "High Scoring Combo" (experimental)
      ↓
Sistema detecta: experimental: true
      ↓
Importa con: notification_enabled = false
      ↓
Alert: "🧪 Monitoreada para validar resultados"
```

---

## 5. 📊 SISTEMA DE VALIDACIÓN COMPLETO

### Pipeline de Validación (Backend)

```
POST /api/filters/create
         ↓
[1] Validar user_id (JWT)
         ↓
[2] Validar condiciones (min/max/type)
         ↓
[3] Validar condiciones completas (para notificaciones)
         ↓
[4] Buscar duplicados en BD
         ↓
[5] Si OK → Guardar ✅
     Si ERROR → Devolver error (400/409)
```

### Pipeline de Validación (Frontend)

```
Usuario llena formulario de filtro
         ↓
[1] Verificar nombre no vacío
         ↓
[2] Verificar al menos una condición
         ↓
[3] Validar min <= max en cada condición
         ↓
[4] Validar sin condiciones contradictorias
         ↓
[5] Si OK → POST /api/filters/create
     Si ERROR → Mostrar alertas
```

---

## 6. 🚀 CASOS DE USO PRÁCTICOS

### Caso 1: Importar Template Duplicado

```
Usuario: Importa "Over 9.5 Corners"
         (Ya existe con mismas condiciones)
         
Sistema:
  ❌ Detecta duplicado
  ❌ Devuelve: 409 Conflict
  ❌ Alert: "Ya existe un filtro con ese nombre"
  
Solución:
  ✓ Renombra a "Over 9.5 Corners - Segunda vez"
  ✓ O cambia min de 10 a 11
  ✓ Intenta de nuevo ✅
```

### Caso 2: Condición Contradictoria

```
Usuario: Crea filtro manual
  Min corners: 10
  Max corners: 5
  
Al guardar:
  ❌ ERROR: "Cornuri: min (10) no puede ser > max (5)"
  
Usuario corrige:
  Min: 5
  Max: 10
  ✅ SAVED!
```

### Caso 3: Notificaciones Incompletas

```
Usuario: Crea filtro y activa notificaciones
  (Pero NO define ninguna condición)
  
Sistema:
  ❌ ERROR: "Las notificaciones requieren condiciones"
  
Usuario:
  Define "Min corners: 8"
  Guarda de nuevo
  ✅ Notificaciones ahora ACTIVAS
```

### Caso 4: Template Experimental

```
Usuario: Importa "High Scoring Combo" (experimental)

Sistema:
  🧪 Detecta experimental: true
  🧪 Desactiva notificaciones por defecto
  🧪 Avisa: "Monitoreada para validar resultados"
  
Usuario:
  Monitorea resultados en 50+ matches
  Si funciona bien → promociona a producción
  Si no → abandona
```

---

## 7. 📁 ARCHIVOS INVOLUCRADOS

### Validación

- **lib/filter-validation.ts** - Lógica principal (NUEVO)
- **app/api/filters/create/route.ts** - Validación backend
- **app/dashboard/filters/new/page.tsx** - Validación frontend

### Notificaciones

- **lib/notifications.ts** - Sistema de notificaciones
- **lib/supabase.ts** - Gestión de notificaciones en BD

### Importación de Templates

- **app/dashboard/filters/templates/page.tsx** - UI de importación
- **lib/filter-templates.ts** - Definición de templates

---

## 8. 🎯 PRÓXIMOS PASOS

- [ ] Agregar tracking de resultados de templates experimentales
- [ ] Dashboard para monitorear performance de filtros
- [ ] Sistema de sugerencias automáticas basado en datos históricos
- [ ] Notificaciones por Telegram cuando filtro matchea
- [ ] Export/Import de filtros entre usuarios

---

**Creado:** 2026-01-08  
**Status:** ✅ Implementado y Testeable
