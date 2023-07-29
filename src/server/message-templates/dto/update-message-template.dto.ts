export class UpdateMessageTemplateDto {
  body?: string;
  updateFrequency?: string;
  timezone?: string | null;
  lastEditedAt?: Date | null;
}
