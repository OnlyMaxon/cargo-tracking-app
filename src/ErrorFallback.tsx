import { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import { Warning, ArrowClockwise } from "@phosphor-icons/react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  if (import.meta.env.DEV) throw error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <Alert variant="destructive" className="mb-6 shadow-lg">
          <Warning size={20} weight="bold" />
          <AlertTitle>Произошла ошибка</AlertTitle>
          <AlertDescription>
            Что-то пошло не так при работе приложения. Попробуйте перезагрузить страницу или обратитесь в поддержку.
          </AlertDescription>
        </Alert>
        
        <div className="bg-card border rounded-lg p-4 mb-6 shadow-sm">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Детали ошибки:</h3>
          <pre className="text-xs text-destructive bg-muted/50 p-3 rounded border overflow-auto max-h-32 font-mono">
            {error.message}
          </pre>
        </div>
        
        <Button 
          onClick={resetErrorBoundary} 
          className="w-full"
          size="lg"
        >
          <ArrowClockwise size={20} weight="bold" className="mr-2" />
          Попробовать снова
        </Button>
      </div>
    </div>
  );
}
