import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ButtonInteraction } from 'discord.js';
import { processCustomId } from '../../bot/utils/messaging';
import { updateTemplateButtonIdPrefix } from '../../common/modals';

export class IsTemplateUpdateButtonInteractionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const interaction = context.getArgByIndex(0) as ButtonInteraction;

    return processCustomId(interaction)[0] === updateTemplateButtonIdPrefix;
  }
}
