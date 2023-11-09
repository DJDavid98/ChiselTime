import React, { FC, useMemo } from 'react';
import { useMessageTemplatesList } from '../../hooks/useUserTemplates';
import { LoadingIndicator } from '../common/LoadingIndicator';
import styles from '../../scss/Templates.module.scss';
import { TemplateDisplay } from './TemplateDisplay';

interface TemplatesProps {
  userId: string;
  maxCount: number;
}

export const Templates: FC<TemplatesProps> = ({ userId, maxCount }) => {
  const templateData = useMessageTemplatesList(userId);
  const templateCounter = useMemo(() => {
    if (!templateData.data) return null;

    return ` (${templateData.data.templates.length}/${maxCount})`;
  }, [maxCount, templateData.data]);

  if (templateData.isLoading) return <LoadingIndicator size={128} />;

  return (
    <div className={styles.layout}>
      <h2>Your Templates{templateCounter}</h2>
      <p className={styles.lead}>
        This is where you will find your message templates created via the
        &ldquo;Create Template&rdquo; context menu command of the ChiselTime
        Discord bot.
        <br />
        <a href="/auth/add-bot">Add the bot to your server</a> to start creating
        templates.
        <br />
        <br />
        The maximum number of templates you can have at a time is currently
        limited to 1 for each account.
      </p>
      {templateData.error ? (
        <p className={styles.error}>
          Failed to load templates ({String(templateData.error.status)})
        </p>
      ) : templateData.data.templates.length === 0 ? (
        <p className={styles.info}>You don&lsquo;t have any templates yet.</p>
      ) : (
        <ol className={styles.list}>
          {templateData.data.templates.map((t) => (
            <TemplateDisplay key={t.id} template={t} />
          ))}
        </ol>
      )}
    </div>
  );
};
