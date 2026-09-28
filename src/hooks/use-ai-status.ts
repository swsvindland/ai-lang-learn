import { useEffect, useState } from 'react';

import { getAvailability, peekAvailability, subscribeAvailability, type LlmAvailability } from '@/lib/ai/llm';

export function useAiStatus(): LlmAvailability | null {
  const [status, setStatus] = useState(peekAvailability);
  useEffect(() => {
    const unsub = subscribeAvailability(setStatus);
    getAvailability().then(setStatus);
    return unsub;
  }, []);
  return status;
}
