const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-svh bg-gradient-to-b from-background to-muted/50 text-foreground p-4">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    <p className="mt-4 text-muted-foreground">퀴즈를 불러오는 중...</p>
  </div>
);

export default LoadingSpinner;
