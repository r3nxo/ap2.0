# 🔧 API Testing - cURL Examples

## Authenticated Requests

### Setup Auth

```bash
# 1. Get user token from localStorage
# Open browser DevTools → Application → localStorage
# Copy value de "rsq_user"

# OR login via API first:
curl -X POST http://localhost:3002/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "fullName": "Test User",
    "email": "test@example.com"
  }'
```

---

## Test 1: Create Valid Filter

```bash
curl -X POST http://localhost:3002/api/filters/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID_HERE",
    "name": "Test Filter Valid",
    "description": "Testing validation system",
    "conditions": {
      "corners": {
        "min": 5,
        "max": 15,
        "team": "total"
      },
      "match_time": {
        "min": 1,
        "max": 90
      }
    },
    "is_active": true,
    "notification_enabled": true,
    "telegram_enabled": false
  }'

# Expected Response: 200 OK
```

---

## Test 2: Duplicate Filter

```bash
# First, create a filter (use Test 1)
# Then try to create the EXACT SAME filter:

curl -X POST http://localhost:3002/api/filters/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID_HERE",
    "name": "Test Filter Valid",        ← Same name
    "description": "Testing validation system",
    "conditions": {
      "corners": {
        "min": 5,        ← Same conditions
        "max": 15,
        "team": "total"
      },
      "match_time": {
        "min": 1,
        "max": 90
      }
    },
    "is_active": true,
    "notification_enabled": true,
    "telegram_enabled": false
  }'

# Expected Response: 409 Conflict
# Body: {
#   "error": "Duplicate filter",
#   "message": "Ya existe un filtro...",
#   "existingFilterId": "xxx"
# }
```

---

## Test 3: Invalid Conditions (Min > Max)

```bash
curl -X POST http://localhost:3002/api/filters/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID_HERE",
    "name": "Invalid Min Max",
    "description": "Should fail",
    "conditions": {
      "corners": {
        "min": 20,        ← MIN
        "max": 10,        ← MAX (20 > 10 = ERROR)
        "team": "total"
      }
    },
    "is_active": true,
    "notification_enabled": false,
    "telegram_enabled": false
  }'

# Expected Response: 400 Bad Request
# Body: {
#   "error": "Invalid filter conditions",
#   "details": [
#     "Corners: min (20) no puede ser mayor que max (10)"
#   ],
#   "warnings": []
# }
```

---

## Test 4: Notifications Without Complete Conditions

```bash
curl -X POST http://localhost:3002/api/filters/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID_HERE",
    "name": "Empty Conditions",
    "description": "No conditions defined",
    "conditions": {},        ← EMPTY
    "is_active": true,
    "notification_enabled": true,   ← Trying to enable
    "telegram_enabled": false
  }'

# Expected Response: 400 Bad Request
# Body: {
#   "error": "Las notificaciones requieren condiciones completas",
#   "details": [
#     "Define al menos un valor (min o max) para una condición"
#   ]
# }
```

---

## Test 5: Valid With Notifications

```bash
curl -X POST http://localhost:3002/api/filters/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID_HERE",
    "name": "With Notifications",
    "description": "Has complete conditions",
    "conditions": {
      "corners": {
        "min": 8     ← At least one value
      }
    },
    "is_active": true,
    "notification_enabled": true,    ← Now allowed
    "telegram_enabled": false
  }'

# Expected Response: 200 OK
# Body: {
#   "data": {
#     "id": "new-filter-id",
#     "name": "With Notifications",
#     "conditions": {...},
#     "notification_enabled": true,   ← ✅ Enabled
#     ...
#   },
#   "error": null
# }
```

---

## Test 6: All Validation Errors

```bash
curl -X POST http://localhost:3002/api/filters/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID_HERE",
    "name": "Multiple Errors",
    "description": "Should have multiple errors",
    "conditions": {
      "corners": {
        "min": 10,
        "max": 5,        ← Error 1: min > max
        "team": "invalid"  ← Error 2: invalid team
      },
      "possession": {
        "min": 0,
        "max": 150       ← Error 3: max > 100
      }
    },
    "is_active": true,
    "notification_enabled": true,
    "telegram_enabled": false
  }'

# Expected Response: 400 Bad Request
# Body: {
#   "error": "Invalid filter conditions",
#   "details": [
#     "Corners: min (10) no puede ser mayor que max (5)",
#     "Corners team inválido: invalid",
#     "Possession max debe estar entre 0-100"
#   ],
#   "warnings": []
# }
```

---

## Test 7: Same Name, Different Conditions (ALLOWED)

```bash
# Create first filter
curl -X POST http://localhost:3002/api/filters/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID_HERE",
    "name": "Test Filter",
    "conditions": {
      "corners": { "min": 5, "max": 15 }
    },
    "is_active": true,
    "notification_enabled": false,
    "telegram_enabled": false
  }'

# Then create with SAME name but DIFFERENT conditions
curl -X POST http://localhost:3002/api/filters/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID_HERE",
    "name": "Test Filter",     ← Same name
    "conditions": {
      "goals": { "min": 3, "max": 8 }   ← Different conditions
    },
    "is_active": true,
    "notification_enabled": false,
    "telegram_enabled": false
  }'

# Expected Response: 200 OK ✅
# BOTH filters saved (different conditions)
```

---

## Test 8: Different Name, Same Conditions (ALLOWED)

```bash
# Create first filter
curl -X POST http://localhost:3002/api/filters/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID_HERE",
    "name": "Original",
    "conditions": {
      "corners": { "min": 5, "max": 15 }
    },
    "is_active": true,
    "notification_enabled": false,
    "telegram_enabled": false
  }'

# Then create with DIFFERENT name but SAME conditions
curl -X POST http://localhost:3002/api/filters/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID_HERE",
    "name": "Original v2",    ← Different name
    "conditions": {
      "corners": { "min": 5, "max": 15 }  ← Same conditions
    },
    "is_active": true,
    "notification_enabled": false,
    "telegram_enabled": false
  }'

# Expected Response: 200 OK ✅
# BOTH filters saved (different names)
```

---

## Batch Testing Script

Save as `test-filters.sh`:

```bash
#!/bin/bash

USER_ID="your-user-id-here"
BASE_URL="http://localhost:3002"

echo "🧪 Filter Validation System Tests\n"

# Test 1: Valid filter
echo "Test 1: Valid filter..."
curl -X POST $BASE_URL/api/filters/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "'$USER_ID'",
    "name": "Test 1 Valid",
    "conditions": {"corners": {"min": 5, "max": 15}},
    "is_active": true,
    "notification_enabled": false,
    "telegram_enabled": false
  }' | jq '.error'

# Test 2: Duplicate
echo "\nTest 2: Duplicate..."
curl -X POST $BASE_URL/api/filters/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "'$USER_ID'",
    "name": "Test 1 Valid",
    "conditions": {"corners": {"min": 5, "max": 15}},
    "is_active": true,
    "notification_enabled": false,
    "telegram_enabled": false
  }' | jq '.error'

# Test 3: Invalid (min > max)
echo "\nTest 3: Invalid (min > max)..."
curl -X POST $BASE_URL/api/filters/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "'$USER_ID'",
    "name": "Test 3 Invalid",
    "conditions": {"corners": {"min": 20, "max": 10}},
    "is_active": true,
    "notification_enabled": false,
    "telegram_enabled": false
  }' | jq '.details[0]'

echo "\n✅ Tests complete"
```

**Usage:**

```bash
chmod +x test-filters.sh
./test-filters.sh
```

---

## PowerShell Script

Save as `test-filters.ps1`:

```powershell
$USER_ID = "your-user-id-here"
$BASE_URL = "http://localhost:3002"

Write-Host "🧪 Filter Validation Tests" -ForegroundColor Cyan

# Test 1: Valid
Write-Host "`nTest 1: Valid Filter..."
$response = Invoke-WebRequest -Uri "$BASE_URL/api/filters/create" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body (@{
    user_id = $USER_ID
    name = "Test 1 Valid"
    conditions = @{corners = @{min = 5; max = 15}}
    is_active = $true
    notification_enabled = $false
  } | ConvertTo-Json)

$response.Content | ConvertFrom-Json | Select-Object error

# Test 2: Duplicate
Write-Host "`nTest 2: Duplicate Filter..."
$response2 = Invoke-WebRequest -Uri "$BASE_URL/api/filters/create" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body (@{
    user_id = $USER_ID
    name = "Test 1 Valid"
    conditions = @{corners = @{min = 5; max = 15}}
    is_active = $true
    notification_enabled = $false
  } | ConvertTo-Json)

$response2.Content | ConvertFrom-Json | Select-Object error

Write-Host "`n✅ Tests complete" -ForegroundColor Green
```

**Usage:**

```powershell
.\test-filters.ps1
```

---

## Monitoring Logs

En terminal del servidor (npm run dev):

```
📝 API /filters/create: Creating filter for user: uuid
✅ All validations passed
✅ Filter created successfully: filter-id
```

O en caso de error:

```
⚠️ Duplicate filter detected: ...
❌ API returns 409 Conflict
```

---

## Tips

1. **Get your User ID:**
   - Open DevTools (F12)
   - Application → localStorage
   - Look for `rsq_user`
   - Copy the `id` field

2. **Pretty print JSON:**
   - Add `| jq .` (Linux/Mac)
   - Add `| ConvertFrom-Json` (PowerShell)

3. **Save responses:**
   - Add `> response.json` (bash)
   - Redirect output en PowerShell

4. **Test multiple users:**
   - Change `USER_ID` variable
   - Run tests again

---

**Created:** 2026-01-08  
**Format:** cURL/PowerShell/Bash  
**Status:** Ready for testing ✅
