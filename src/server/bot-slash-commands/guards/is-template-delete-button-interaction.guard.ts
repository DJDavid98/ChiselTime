import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ButtonInteraction } from 'discord.js';
import { processCustomId } from '../../bot/utils/messaging';
import { deleteTemplateButtonIdPrefix } from '../../common/modals';

export class IsTemplateDeleteButtonInteractionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const interaction = context.getArgByIndex(0) as ButtonInteraction;

    return processCustomId(interaction)[0] === deleteTemplateButtonIdPrefix;
  }
}
