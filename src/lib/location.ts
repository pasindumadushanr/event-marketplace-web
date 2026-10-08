export type Coordinates = { latitude: number; longitude: number };

export function currentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation)
      return reject(
        new Error(
          "Location is unavailable in this browser. Please search by city instead.",
        ),
      );
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      (error) =>
        reject(
          new Error(
            error.code === 1
              ? "Location permission was denied. You can still search by city."
              : "Your location could not be found. Please try again or search by city.",
          ),
        ),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  });
}
