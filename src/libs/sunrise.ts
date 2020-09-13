import { getSunrise, getSunset } from 'sunrise-sunset-js';

export interface SunriseProperties {
  coordinates: Coordinates
}

export default class Sunrise implements SunriseProperties {
  coordinates: Coordinates;

  constructor(properties: SunriseProperties) {
    this.coordinates = properties.coordinates;
  }

  public getSunset(coordinates: Coordinates): Date {
    return Sunrise.getSunset(coordinates);
  }

  public getSunrise(coordinates: Coordinates): Date {
    return Sunrise.getSunrise(coordinates);
  }

  public static getSunset(coordinates: Coordinates): Date {
    return getSunset(coordinates.latitude, coordinates.longitude)
  }

  public static getSunrise(coordinates: Coordinates): Date {
    return getSunrise(coordinates.latitude, coordinates.longitude)
  }
}
