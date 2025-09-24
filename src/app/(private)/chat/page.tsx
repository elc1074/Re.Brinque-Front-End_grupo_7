import { Suspense } from 'react';
import ClientChatPage from './ClientChatPage';

export default function ChatPageWrapper() {
  return (
    <Suspense fallback={<div>Carregando chat...</div>}>
      <ClientChatPage />
    </Suspense>
  );
}
