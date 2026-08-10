interface StepConnectorProps {
  filled: boolean;
}

export function StepConnector({ filled }: StepConnectorProps) {
  return (
    <div className="w-6 sm:w-24 md:w-32 lg:w-48 h-0.5 mb-5 mx-1.5 sm:mx-2 rounded-full overflow-hidden bg-blue-100 flex-shrink-0">
      <div
        className="h-full bg-blue-800 rounded-full transition-all duration-500"
        style={{ width: filled ? "100%" : "0%" }}
      />
    </div>
  );
}