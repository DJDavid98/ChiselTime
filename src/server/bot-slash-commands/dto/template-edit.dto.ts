import { TextInputValue } from '@discord-nestjs/core';
import {
  templateInputId,
  timezoneInputId,
  updateFrequencyInputId,
} from '../../common/modals';

export class TemplateEditDto {
  @TextInputValue(templateInputId)
  body: string;

  @TextInputValue(timezoneInputId)
  timezone: string;

  @TextInputValue(updateFrequencyInputId)
  updateFrequency: string;
}
