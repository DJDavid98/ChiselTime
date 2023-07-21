import { KnownSettings } from '../model/known-settings.enum';
import { isValidTimeZone } from '../../utils/timezone';
import { SettingTypes } from '../entities/user-setting.entity';

/**
 * Takes the raw user-supplied setting value and does validation &
 * optionally post-processing before running it through the type guards
 */
export const settingsParser: {
  [k in KnownSettings]: (value: unknown) => SettingTypes[k] | null;
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
};
