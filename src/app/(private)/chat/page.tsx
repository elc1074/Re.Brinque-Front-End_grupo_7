import { Suspense } from "react";
import ClientChatPage from "./ClientChatPage";

export default function ChatPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground animate-pulse">
              Carregando chat...
            </p>
          </div>
        </div>
      }
    >
      <ClientChatPage />
    </Suspense>
  );
}
