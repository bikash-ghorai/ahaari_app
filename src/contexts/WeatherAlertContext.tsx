import React from 'react';

type WeatherAlertContextValue = {
  isBadWeather: boolean;
  isVisible: boolean;
  show: () => void;
  hide: () => void;
};

const WeatherAlertContext = React.createContext<WeatherAlertContextValue | undefined>(undefined);

export const WeatherAlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const isBadWeather = true;

  const show = React.useCallback(() => {
    if (isBadWeather) {
      setIsVisible(true);
    }
  }, [isBadWeather]);

  const hide = React.useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <WeatherAlertContext.Provider value={{ isBadWeather, isVisible, show, hide }}>
      {children}
    </WeatherAlertContext.Provider>
  );
};

export const useWeatherAlert = () => {
  const context = React.useContext(WeatherAlertContext);
  if (!context) {
    throw new Error('useWeatherAlert must be used within WeatherAlertProvider');
  }
  return context;
};
