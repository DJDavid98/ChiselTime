import { KnownSettings } from '../model/known-settings.enum';
import { isValidTimeZone } from '../../utils/timezone';
import { SettingTypes } from '../entities/user-setting.entity';
import { ColumnOptions } from '../model/column-options.enum';
import { FormatOptions } from '../model/format-options.model';
import { Logger } from '@nestjs/common';

/**
 * Takes the raw user-supplied setting value and does validation &
 * optionally post-processing before running it through the type guards
 */
export const settingsParser: {
  [k in KnownSettings]: (
    value: unknown,
    logger: Logger,
  ) => SettingTypes[k] | null;
} = {
  [KnownSettings.timezone]: (value) => {
    if (typeof value !== 'string') return null;

    if (!isValidTimeZone(value)) {
      throw new Error('The provided timezone is invalid');
    }

    return value;
  },
  [KnownSettings.ephemeral]: (value) =>
    typeof value === 'boolean' ? value : null,
  [KnownSettings.header]: (value) =>
    typeof value === 'boolean' ? value : null,
  [KnownSettings.columns]: (value) =>
    typeof value === 'string' && ColumnOptions.hasOwnProperty(value)
      ? (value as ColumnOptions)
      : null,
  [KnownSettings.format]: (value) =>
    typeof value === 'string' && FormatOptions.hasOwnProperty(value)
      ? (value as FormatOptions)
      : null,
};
