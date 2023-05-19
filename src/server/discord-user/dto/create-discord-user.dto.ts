import Joi from 'joi';

export const createDiscordUserSchema = Joi.object({
  id: Joi.string().regex(/^\d+$/, 'numeric').min(1),
  name: Joi.string().min(1).max(32),
  discriminator: Joi.string().regex(/^\d+$/, 'numeric').length(4),
  avatar: Joi.string().max(128).allow(null),
});

export class CreateDiscordUserDto {
  id: string;
  name: string;
  discriminator: string;
  avatar: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  scopes?: string | null;
}
