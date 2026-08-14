export const getWeatherEmoji = (weatherCode: number, isDay: boolean): string => {
  if (weatherCode === 0) {
    return isDay ? '☀️' : '🌙';
  }

  if (weatherCode === 1 || weatherCode === 2) {
    return isDay ? '🌤️' : '🌙';
  }

  if (weatherCode === 3) {
    return '☁️';
  }

  if ([45, 48].includes(weatherCode)) {
    return '🌫️';
  }

  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return '🌦️';
  }

  if ([61, 63, 65, 66, 67].includes(weatherCode)) {
    return '🌧️';
  }

  if ([71, 73, 75, 77].includes(weatherCode)) {
    return '❄️';
  }

  if ([80, 81, 82].includes(weatherCode)) {
    return '🌧️';
  }

  if ([85, 86].includes(weatherCode)) {
    return '🌨️';
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return '⛈️';
  }

  return isDay ? '🌤️' : '🌙';
};

export const getCurrentWeatherEmoji = (): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=weather_code,is_day`;

          const response = await fetch(url);

          if (!response.ok) {
            resolve(null);
            return;
          }

          const data = await response.json();

          if (
            typeof data?.current?.weather_code !== 'number' ||
            typeof data?.current?.is_day !== 'number'
          ) {
            resolve(null);
            return;
          }

          const emoji = getWeatherEmoji(
            data.current.weather_code,
            data.current.is_day === 1
          );

          resolve(emoji);
        } catch (error) {
          console.error('Failed to load weather:', error);
          resolve(null);
        }
      },
      () => {
        // Location permission denied or unavailable.
        // Continue without showing weather.
        resolve(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 15 * 60 * 1000,
      }
    );
  });
};