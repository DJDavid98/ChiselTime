import useSWR from 'swr';
import type { MessageTemplateListDto } from '../../server/message-templates/dto/message-templates-list.dto';

export const useMessageTemplatesList = (userId: string) =>
  useSWR(
    `/message-templates/list/${userId}`,
    (key) =>
      fetch(key).then<MessageTemplateListDto>((r) =>
        r.ok ? r.json() : Promise.reject(r),
      ),
    { keepPreviousData: true },
  );
