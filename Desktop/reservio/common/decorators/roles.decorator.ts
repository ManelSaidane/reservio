import { SetMetadata } from '@nestjs/common';

// Clé utilisée pour stocker les rôles dans les métadonnées
export const ROLES_KEY = 'roles';

// Décorateur personnalisé pour définir les rôles sur les routes
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
