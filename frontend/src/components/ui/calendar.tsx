import React from 'react';
import { CalendarProps } from '@/types/ui';

export const Calendar: React.FC<CalendarProps> = ({ className, ...props }) => {
  // Extrair apenas as props que são válidas para um div HTML
  const { mode, selected, onSelect, initialFocus, locale, ...divProps } = props;
  
  // Evitar warnings de variáveis não utilizadas
  void mode; void selected; void onSelect; void initialFocus; void locale;
  
  return (
    <div className={className} {...divProps}>Calendar Placeholder</div>
  );
};
