import type { MessageTemplateDto } from '../../../server/message-templates/dto/message-templates-list.dto';
import { FC, useMemo } from 'react';
import styles from '../../scss/TemplateDisplay.module.scss';
import { getReadableInterval } from '../../utils/get-readable-interval';

export const TemplateDisplay: FC<{ template: MessageTemplateDto }> = ({
  template,
}) => {
  const lastEditTs = useMemo(() => {
    if (!template.lastEditedAt) return false;
    return new Date(template.lastEditedAt).toLocaleString();
  }, [template.lastEditedAt]);
  const readableUpdateFrequency = useMemo(
    () => getReadableInterval(template.updateFrequency),
    [template.updateFrequency],
  );
  return (
    <li className={styles.template}>
      <div className={styles.meta}>
        <p className={styles.metadata}>
          <strong>ID:</strong> <code className={styles.id}>{template.id}</code>
        </p>
        <p className={styles.metadata}>
          <strong>Update frequency:</strong> {readableUpdateFrequency}
        </p>
        <p className={styles.metadata}>
          <strong>Timezone:</strong> {template.timezone}
        </p>
        <p className={styles.metadata}>
          <strong>Last update:</strong> {lastEditTs || <em>unknown</em>}
        </p>
      </div>
      <div className={styles.body}>{template.body}</div>
    </li>
  );
};
