export interface SliderArrowsProps {
  onPrev: () => void;
  onNext: () => void;
}

export interface SliderDotsProps {
  count: number;
  current: number;
  onSelect: (index: number) => void;
}
