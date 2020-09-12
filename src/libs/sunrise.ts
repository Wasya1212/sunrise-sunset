import { getSunrise, getSunset } from 'sunrise-sunset-js';

import {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

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

  public static getCurrentPositionInfo(): Promise<Coordinates> {
    return new Promise<Coordinates>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        resolve(position.coords);
      }, reject , { timeout:10000 });
    });
  }

  public static getAddressByCoordinates(coordinates: Coordinates): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      new google.maps.Geocoder().geocode({
        location: {
          lat: coordinates.latitude,
          lng: coordinates.longitude
        }
      }, (results) => {
        if (!results || results.length === 0) {
          reject(new Error("Any city was found!"));
        } else {
          resolve(results[0].formatted_address);
        }
      });
    });
  }

  public static async getCoordinatesByAddress(address: string): Promise<Coordinates> {
    return latLngLiteralToCoordinates(await getLatLng((await geocodeByAddress(address))[0]));
  }
}

export function latLngLiteralToCoordinates(latLng: google.maps.LatLngLiteral): Coordinates {
  return {
    latitude: latLng.lat,
    longitude: latLng.lng,
    heading: 0,
    speed: 0,
    altitudeAccuracy: 0,
    accuracy: 0,
    altitude: 0
  };
}
