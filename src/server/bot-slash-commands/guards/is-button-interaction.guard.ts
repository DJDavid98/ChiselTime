import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Interaction, InteractionType } from 'discord.js';

export class IsButtonInteractionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const interaction = context.getArgByIndex(0) as Interaction;

    return (
      interaction.type === InteractionType.MessageComponent &&
      interaction.isButton()
    );
  }
}
