import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from './roles.decorator';

export const Guest = () => SetMetadata(ROLES_KEY, ['GUEST', 'ADMIN']);
