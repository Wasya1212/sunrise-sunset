import Axios from "axios";

import { getSunrise, getSunset } from 'sunrise-sunset-js';

export interface SunriseProperties {
  coordinates: Coordinates
}

export interface SunriseSunsetInfo {
  sunrise: Date,
  sunset: Date
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

  public static async getSunriseSunsetInfo(coordinates: Coordinates): Promise<SunriseSunsetInfo> {
    return Axios
      .get(`https://api.sunrise-sunset.org/json?lat=${coordinates.latitude}&lng=${coordinates.longitude}&date=today&formatted=0`)
      .then(results => {
        return {
          sunrise: new Date(results.data.results.sunrise),
          sunset: new Date(results.data.results.sunset)
        }
      })
      .then(result => {
        return result
      });
  }
}
