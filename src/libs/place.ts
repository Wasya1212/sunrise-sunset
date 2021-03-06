import {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

export interface PlaceProperties {
  address: string,
  coordinates: Coordinates
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

export function coordinatesToLatLngLiteral(coordinates: Coordinates): google.maps.LatLngLiteral {
  return {
    lat: coordinates.latitude,
    lng: coordinates.longitude
  };
}

export default class Place implements PlaceProperties {
  public address: string;
  public coordinates: Coordinates

  constructor(properties: PlaceProperties) {
    this.address = properties.address;
    this.coordinates = properties.coordinates;
  }

  public async setNewAddress(newAddress: string): Promise<Place> {
    this.address = newAddress;
    this.coordinates = await Place.getCoordinatesByAddress(newAddress);

    return this;
  }

  public static async setNewAddress(newAddress: string): Promise<Place> {
    return await this.setNewAddress(newAddress);
  }

  public static async getCoordinatesByAddress(address: string): Promise<Coordinates> {
    return latLngLiteralToCoordinates(await getLatLng((await geocodeByAddress(address))[0]));
  }

  public static getCurrentPositionInfo(): Promise<Coordinates> {
    return new Promise<Coordinates>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        resolve(position.coords);
      }, reject , { timeout:10000 });
    });
  }

  public static async getAddressByCoordinates(coordinates: Coordinates): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
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
}
