# 🧪 Testing Guide - Filter Validation System

## Quick Test (5 minutos)

### Test 1: Importar Template Normal

```
1. Abre: http://localhost:3002/login
2. Login con usuario
3. Ve a: Dashboard → Filters → Templates
4. Busca: "Over 9.5 Corners" (production template)
5. Click: Importar
6. Resultado esperado: ✅ Alert "Filtru importat cu succes!"
```

---

### Test 2: Detectar Duplicado

```
1. Ve a: Dashboard → Filters → Templates
2. Intenta importar: "Over 9.5 Corners" de nuevo
3. Resultado esperado: ❌ Alert "Ya existe un filtro..."
4. Solución: Click "Crear nuevo" y renombra a "Over 9.5 Corners v2"
```

---

### Test 3: Condición Contradictoria

```
1. Ve a: Dashboard → Filters → Create New
2. Nombre: "Test Contradiction"
3. Enable: Corners
4. Min: 10
5. Max: 5  ← Debe ser > 10
6. Click: Guardar
7. Resultado esperado: ❌ Error rojo "min no puede ser > max"
```

---

### Test 4: Notificaciones Incompletas

```
1. Ve a: Dashboard → Filters → Create New
2. Nombre: "Empty"
3. Enable: Corners
4. (No definas min ni max)
5. Enable: "Enviar notificaciones"
6. Click: Guardar
7. Resultado esperado: ❌ Error "Condiciones incompletas"
```

---

### Test 5: Notificaciones Completas

```
1. Ve a: Dashboard → Filters → Create New
2. Nombre: "With Notifications"
3. Enable: Corners
4. Min: 8  ← Valores definidos
5. Enable: "Enviar notificaciones"
6. Click: Guardar
7. Resultado esperado: ✅ Éxito - Filtro guardado con notificaciones
```

---

### Test 6: Template Experimental

```
1. Ve a: Dashboard → Filters → Templates
2. Filtra por: "Experimental"
3. Importa: "High Scoring Combo" (🧪)
4. Resultado esperado: 
   - ✅ Alert con warning "🧪 Versión de prueba"
   - ✅ Filtro guardado
   - ❌ Notificaciones NO activadas (por defecto)
5. Verifica: Dashboard → Filters → Click filtro
   - Notificaciones: OFF (puedes activar manualmente)
```

---

## Console Testing

Abre DevTools (F12) y busca estos logs:

### Éxito Esperado

```
📝 API /filters/create: Creating filter for user: uuid
✅ All validations passed
📖 API /filters/create: Creating filter for user: uuid
✅ Filter created successfully: filter-id
```

### Error de Duplicado

```
📝 API /filters/create: Creating filter for user: uuid
⚠️ Duplicate filter detected: Ya existe un filtro...
❌ API returns 409 Conflict
```

### Error de Validación

```
📝 API /filters/create: Creating filter for user: uuid
⚠️ Invalid filter conditions: ["min (10) no puede ser > max (5)"]
❌ API returns 400 Bad Request
```

---

## Network Testing (DevTools Network Tab)

### Success (200)

```
POST /api/filters/create
Status: 200 OK
Response:
{
  "data": {
    "id": "...",
    "name": "My Filter",
    ...
  },
  "error": null
}
```

### Duplicate (409)

```
POST /api/filters/create
Status: 409 Conflict
Response:
{
  "error": "Duplicate filter",
  "message": "Ya existe...",
  "existingFilterId": "..."
}
```

### Validation Error (400)

```
POST /api/filters/create
Status: 400 Bad Request
Response:
{
  "error": "Invalid filter conditions",
  "details": ["Corners: min (10) > max (5)"],
  "warnings": [...]
}
```

---

## Testing Checklist

### Duplicados

- [ ] ✅ Importar template normal funciona
- [ ] ✅ Detecta duplicado (mismo nombre + condiciones)
- [ ] ✅ Permite mismo nombre con condiciones diferentes
- [ ] ✅ Permite mismo nombre si usuario renombra
- [ ] ✅ Error message es claro

### Validaciones

- [ ] ✅ Rechaza min > max en corners
- [ ] ✅ Rechaza min > max en goals
- [ ] ✅ Rechaza min > max en shots
- [ ] ✅ Rechaza posesión > 100%
- [ ] ✅ Rechaza tiempo > 120 minutos
- [ ] ✅ Detecta 2+ errores (multiple errors)

### Notificaciones

- [ ] ✅ Notificaciones require condiciones completas
- [ ] ✅ Permite notificaciones con min definido
- [ ] ✅ Permite notificaciones con max definido
- [ ] ✅ Permite notificaciones con ambos definidos
- [ ] ✅ Rechaza notificaciones sin valores
- [ ] ✅ Templates experimentales sin notificaciones por defecto

### UI/UX

- [ ] ✅ Errores muestran en color rojo
- [ ] ✅ Success alerts dicen qué pasó
- [ ] ✅ Warnings son claros
- [ ] ✅ User puede entender qué corregir
- [ ] ✅ Links a documentación funcionan

---

## Edge Cases

### Test: Mismo Template Importado 3 Veces

```
1. Importa "Over 9.5 Corners"
   ✅ Success
2. Intenta importar de nuevo
   ❌ Duplicate
3. Renombra a "Over 9.5 Corners 2"
   ✅ Success
4. Intenta importar nombre original
   ❌ Duplicate
5. Intenta con condiciones diferentes (min: 9)
   ✅ Success
```

### Test: Valores Extremos

```
Corners: min 0, max 999
❌ Error: "max (999) es muy alto" (WARNING)

Possession: 0-100
✅ OK

Match Time: 0-200
❌ Error: "max (200) inválido (esperado 0-120)"
```

### Test: Condiciones Vacías

```
1. Crea filtro sin seleccionar condiciones
2. Click Guardar
3. Resultado: ❌ Error "Debe seleccionar condición"
```

---

## Performance Testing

### Duplicado Check Speed

```
Usuario: Importa template
↓
Sistema busca duplicados en BD
↓
Tiempo esperado: < 1 segundo
↓
Si > 3 segundos: ⚠️ Check DB indexes
```

### Validación Speed

```
Validar 10+ condiciones
Tiempo esperado: < 100ms
↓
Frontend + Backend juntos: < 2 segundos total
```

---

## Regression Testing

Después de cambios, verificar que:

- [ ] Filtros antiguos todavía funcionan
- [ ] Notificaciones de filtros existentes funcionan
- [ ] No hay cambios en schema
- [ ] API backwards compatible
- [ ] No cambian endpoints

---

## Bug Report Template

Si encuentras bug:

```
**Título:** [BUG] Descripción

**Pasos para reproducir:**
1. ...
2. ...
3. ...

**Resultado esperado:**
...

**Resultado actual:**
...

**Logs (Console):**
(Pega error aquí)

**Browser:** Chrome/Firefox/Safari + version
```

---

## Success Criteria

✅ **Sistema listo cuando:**
- Todos los tests pasan
- No hay regresiones
- Performance OK
- UX clara
- Documentación completa

---

**Testing Date:** 2026-01-08  
**Build Version:** Latest  
**Status:** Ready for Testing ✅
