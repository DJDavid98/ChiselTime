import { CanActivate, ExecutionContext } from '@nestjs/common';
import { processCustomId } from '../../bot/utils/messaging';
import { editTemplateModalIdPrefix } from '../../common/modals';

export class IsTemplateEditModalInteractionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const interaction = context.getArgByIndex(0);

    return processCustomId(interaction)[0] === editTemplateModalIdPrefix;
  }
}
