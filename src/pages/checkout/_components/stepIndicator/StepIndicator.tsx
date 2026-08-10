import { STEPS } from "../../constants/Steps";
import { useCurrentStep } from "../../hooks/useCurrentStep";
import { StepConnector } from "./_components/stepConnector/StepConnector";
import { StepIndicatorItem } from "./_components/stepIndicatorItem/StepIndicatorItem";

export function StepIndicator() {
  const current = useCurrentStep();

  return (
    <div className="w-full flex items-center justify-center px-2 sm:px-4 py-4 sm:py-6 overflow-x-auto">
      <div className="flex items-center gap-0">
        {STEPS.map((step, i) => {
          const done = step.id < current;
          const active = step.id === current;

          return (
            <div key={step.id} className="flex items-center">
              <StepIndicatorItem step={step} done={done} active={active} />
              {i < STEPS.length - 1 && <StepConnector filled={done} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}