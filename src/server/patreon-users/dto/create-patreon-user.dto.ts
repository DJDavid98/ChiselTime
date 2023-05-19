import Joi from 'joi';

export const createPatreonUserSchema = Joi.object({
  id: Joi.string().required(),
  attributes: Joi.object({
    full_name: Joi.string().optional().allow(null),
    social_connections: Joi.object({
      discord: Joi.object({
        user_id: Joi.string(),
      }).allow(null),
    }),
    image_url: Joi.string().optional().allow(null),
    url: Joi.string(),
    vanity: Joi.string().optional().allow(null),
  }).required(),
});

interface PatreonUserAttributes {
  full_name?: string | null;
  social_connections: {
    discord: { user_id: string } | null;
  };
  image_url: string;
  url: string;
  vanity?: string | null;
}

export class CreatePatreonUserDto {
  id: string;
  attributes: PatreonUserAttributes;
  accessToken?: string | null;
  refreshToken?: string | null;
  scopes?: string | null;

  public static getName(attributes: PatreonUserAttributes): string {
    return (
      attributes.vanity ||
      attributes.full_name ||
      (attributes.url.split('/').pop() as string)
    );
  }
}
