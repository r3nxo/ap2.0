// ============================================
// R$Q - FILTER VALIDATION ENGINE
// ============================================
// Validación de filtros: duplicados, condiciones contradictorias, etc.

import type { FilterConditions, Filter } from '@/lib/supabase';

// ============================================
// TYPES
// ============================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingFilter?: Filter;
  reason?: string;
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Verifica si las condiciones del filtro son válidas y no contradictorias
 */
export function validateFilterConditions(conditions: FilterConditions): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!conditions || Object.keys(conditions).length === 0) {
    errors.push('El filtro debe tener al menos una condición');
    return { isValid: false, errors, warnings };
  }

  // ============================================
  // VALIDACIÓN: CORNERS
  // ============================================
  if (conditions.corners) {
    const { min, max, team } = conditions.corners;

    // Validar que min <= max
    if (min !== undefined && max !== undefined && min > max) {
      errors.push(`Corners: min (${min}) no puede ser mayor que max (${max})`);
    }

    // Validar rangos realistas (0-30)
    if (min !== undefined && min < 0) errors.push('Corners min no puede ser negativo');
    if (max !== undefined && max > 30) warnings.push('Corners max (${max}) es muy alto');

    // Validar team
    if (team && !['home', 'away', 'total'].includes(team)) {
      errors.push(`Corners team inválido: ${team}`);
    }
  }

  // ============================================
  // VALIDACIÓN: GOALS
  // ============================================
  if (conditions.goals) {
    const { min, max, team } = conditions.goals;

    if (min !== undefined && max !== undefined && min > max) {
      errors.push(`Goals: min (${min}) no puede ser mayor que max (${max})`);
    }

    if (min !== undefined && min < 0) errors.push('Goals min no puede ser negativo');
    if (max !== undefined && max > 15) warnings.push(`Goals max (${max}) es muy alto`);

    if (team && !['home', 'away', 'total'].includes(team)) {
      errors.push(`Goals team inválido: ${team}`);
    }
  }

  // ============================================
  // VALIDACIÓN: SHOTS
  // ============================================
  if (conditions.shots_on_target) {
    const { min, max } = conditions.shots_on_target;

    if (min !== undefined && max !== undefined && min > max) {
      errors.push(`Shots on target: min (${min}) no puede ser mayor que max (${max})`);
    }

    if (min !== undefined && min < 0) errors.push('Shots on target min no puede ser negativo');
  }

  if (conditions.shots_off_target) {
    const { min, max } = conditions.shots_off_target;

    if (min !== undefined && max !== undefined && min > max) {
      errors.push(`Shots off target: min (${min}) no puede ser mayor que max (${max})`);
    }

    if (min !== undefined && min < 0) errors.push('Shots off target min no puede ser negativo');
  }

  if (conditions.total_shots) {
    const { min, max } = conditions.total_shots;

    if (min !== undefined && max !== undefined && min > max) {
      errors.push(`Total shots: min (${min}) no puede ser mayor que max (${max})`);
    }

    if (min !== undefined && min < 0) errors.push('Total shots min no puede ser negativo');
  }

  // ============================================
  // VALIDACIÓN: DANGEROUS ATTACKS
  // ============================================
  if (conditions.dangerous_attacks) {
    const { min, max } = conditions.dangerous_attacks;

    if (min !== undefined && max !== undefined && min > max) {
      errors.push(`Dangerous attacks: min (${min}) no puede ser mayor que max (${max})`);
    }

    if (min !== undefined && min < 0) errors.push('Dangerous attacks min no puede ser negativo');
  }

  // ============================================
  // VALIDACIÓN: CARDS
  // ============================================
  if (conditions.yellow_cards) {
    const { min, max } = conditions.yellow_cards;

    if (min !== undefined && max !== undefined && min > max) {
      errors.push(`Yellow cards: min (${min}) no puede ser mayor que max (${max})`);
    }

    if (min !== undefined && min < 0) errors.push('Yellow cards min no puede ser negativo');
    if (max !== undefined && max > 10) warnings.push(`Yellow cards max (${max}) es muy alto`);
  }

  if (conditions.red_cards) {
    const { min, max } = conditions.red_cards;

    if (min !== undefined && max !== undefined && min > max) {
      errors.push(`Red cards: min (${min}) no puede ser mayor que max (${max})`);
    }

    if (min !== undefined && min < 0) errors.push('Red cards min no puede ser negativo');
    if (max !== undefined && max > 5) warnings.push(`Red cards max (${max}) es muy alto`);
  }

  // ============================================
  // VALIDACIÓN: POSSESSION
  // ============================================
  if (conditions.possession) {
    const { min, max } = conditions.possession;

    if (min !== undefined && max !== undefined && min > max) {
      errors.push(`Possession: min (${min}) no puede ser mayor que max (${max})`);
    }

    if (min !== undefined && (min < 0 || min > 100)) {
      errors.push('Possession min debe estar entre 0-100');
    }

    if (max !== undefined && (max < 0 || max > 100)) {
      errors.push('Possession max debe estar entre 0-100');
    }
  }

  // ============================================
  // VALIDACIÓN: MATCH TIME
  // ============================================
  if (conditions.match_time) {
    const { min, max } = conditions.match_time;

    if (min !== undefined && max !== undefined && min > max) {
      errors.push(`Match time: min (${min}) no puede ser mayor que max (${max})`);
    }

    if (min !== undefined && (min < 0 || min > 120)) {
      errors.push('Match time min debe estar entre 0-120');
    }

    if (max !== undefined && (max < 0 || max > 120)) {
      errors.push('Match time max debe estar entre 0-120');
    }
  }

  // ============================================
  // VALIDACIÓN: ODDS
  // ============================================
  if (conditions.odds) {
    const { min, max } = conditions.odds;

    if (min !== undefined && max !== undefined && min > max) {
      errors.push(`Odds: min (${min}) no puede ser mayor que max (${max})`);
    }

    if (min !== undefined && min < 0.5) {
      warnings.push(`Odds min (${min}) es muy bajo`);
    }
  }

  // ============================================
  // VALIDACIÓN: CONDICIONES CONTRADICTORIAS
  // ============================================

  // Validación: total_shots vs shots_on_target + shots_off_target
  if (conditions.total_shots && (conditions.shots_on_target || conditions.shots_off_target)) {
    const totalMin = conditions.total_shots.min || 0;
    const onTargetMax = conditions.shots_on_target?.max || Infinity;
    const offTargetMax = conditions.shots_off_target?.max || Infinity;

    if (totalMin > onTargetMax + offTargetMax) {
      errors.push(
        'Condición contradictoria: total_shots min es mayor que shots_on_target + shots_off_target máximo'
      );
    }
  }

  // Validación: corners duplicadas
  if (conditions.corners) {
    const minOccurrences = (conditions.corners.min !== undefined ? 1 : 0);
    const maxOccurrences = (conditions.corners.max !== undefined ? 1 : 0);

    if (conditions.corners.min !== undefined &&
        conditions.corners.max !== undefined &&
        conditions.corners.min === conditions.corners.max) {
      warnings.push('Corners tiene rango fijo (min = max)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Verifica si un filtro es duplicado de un existente
 * Considera duplicados si:
 * - Nombre exacto igual
 * - Condiciones idénticas
 */
export function checkDuplicate(
  newFilter: { name: string; conditions: FilterConditions },
  existingFilters: Filter[]
): DuplicateCheckResult {
  
  for (const existing of existingFilters) {
    // Checklist de duplicación (en orden de importancia):
    // 1. Mismo nombre
    // 2. Mismas condiciones

    const sameNameAndConditions =
      existing.name.toLowerCase() === newFilter.name.toLowerCase() &&
      JSON.stringify(existing.conditions) === JSON.stringify(newFilter.conditions);

    if (sameNameAndConditions) {
      return {
        isDuplicate: true,
        existingFilter: existing,
        reason: `Filtro duplicado: "${existing.name}" con condiciones idénticas`,
      };
    }

    // Validación más suave: mismo nombre pero condiciones diferentes
    const sameName = existing.name.toLowerCase() === newFilter.name.toLowerCase();
    if (sameName) {
      return {
        isDuplicate: true,
        existingFilter: existing,
        reason: `Ya existe un filtro con el nombre "${existing.name}". Por favor cambia el nombre.`,
      };
    }
  }

  return { isDuplicate: false };
}

/**
 * Verifica si las condiciones son completas (no vacías)
 * para permitir activar notificaciones
 */
export function areConditionsComplete(conditions: FilterConditions): boolean {
  if (!conditions || Object.keys(conditions).length === 0) {
    return false;
  }

  // Al menos una condición debe tener valores definidos
  const hasValues =
    (conditions.corners?.min !== undefined || conditions.corners?.max !== undefined) ||
    (conditions.goals?.min !== undefined || conditions.goals?.max !== undefined) ||
    (conditions.shots_on_target?.min !== undefined || conditions.shots_on_target?.max !== undefined) ||
    (conditions.yellow_cards?.min !== undefined || conditions.yellow_cards?.max !== undefined) ||
    (conditions.dangerous_attacks?.min !== undefined || conditions.dangerous_attacks?.max !== undefined) ||
    (conditions.match_time?.min !== undefined || conditions.match_time?.max !== undefined) ||
    (conditions.odds?.min !== undefined || conditions.odds?.max !== undefined) ||
    (conditions.possession?.min !== undefined || conditions.possession?.max !== undefined) ||
    (conditions.red_cards?.min !== undefined || conditions.red_cards?.max !== undefined) ||
    (conditions.shots_off_target?.min !== undefined || conditions.shots_off_target?.max !== undefined) ||
    (conditions.total_shots?.min !== undefined || conditions.total_shots?.max !== undefined);

  return hasValues;
}

/**
 * Obtiene un resumen legible de las condiciones del filtro
 */
export function getConditionsSummary(conditions: FilterConditions): string[] {
  const summary: string[] = [];

  if (conditions.goals?.min !== undefined) {
    summary.push(`Minimo ${conditions.goals.min} goles`);
  }
  if (conditions.goals?.max !== undefined) {
    summary.push(`Máximo ${conditions.goals.max} goles`);
  }

  if (conditions.corners?.min !== undefined) {
    summary.push(`Minimo ${conditions.corners.min} corneres`);
  }
  if (conditions.corners?.max !== undefined) {
    summary.push(`Máximo ${conditions.corners.max} corneres`);
  }

  if (conditions.shots_on_target?.min !== undefined) {
    summary.push(`Minimo ${conditions.shots_on_target.min} tiros a puerta`);
  }

  if (conditions.yellow_cards?.min !== undefined) {
    summary.push(`Minimo ${conditions.yellow_cards.min} tarjetas amarillas`);
  }

  if (conditions.match_time?.min !== undefined && conditions.match_time?.max !== undefined) {
    summary.push(`Entre minuto ${conditions.match_time.min}' y ${conditions.match_time.max}'`);
  }

  return summary;
}
