import React, { Component } from "react";

import Moment from "moment";

import { getSunrise, getSunset } from 'sunrise-sunset-js';

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

export interface PlacesState {
  enteredAddress: string,
  address?: string,
  coordinates?: google.maps.LatLngLiteral,
  sunriseTime?: Date,
  sunsetTime?: Date
}

export interface PlacesProps {

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

export default class Places extends Component<PlacesProps, PlacesState> {
  constructor(props: PlacesProps) {
    super(props);

    this.state = {
      enteredAddress: ''
    };
  }

  private getSunset(coordinates: Coordinates): Date {
    return getSunset(coordinates.latitude, coordinates.longitude)
  }

  private getSunrise(coordinates: Coordinates): Date {
    return getSunrise(coordinates.latitude, coordinates.longitude)
  }

  private async getCurrentPositionInfo(): Promise<Coordinates> {
    return await new Promise<Coordinates>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        resolve(position.coords);
      });
    });
  }

  private async getAddressByCoordinates(latLng: google.maps.LatLngLiteral): Promise<string> {
    return await new Promise<string>((resolve, reject) => {
      new google.maps.Geocoder().geocode({ location: latLng }, (results) => {
        if (!results || results.length == 0) {
          reject(new Error("Any city was found!"));
        } else {
          resolve(results[0].formatted_address);
        }
      });
    });
  }

  private async getCoordinatesByAddress(address: string) {
    return getLatLng((await geocodeByAddress(address))[0]);
  }

  private async getSunriseAndSunset() {
    if (!this.state.address) return;

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({
          coordinates: latLng
        });
      })
      .catch(error => console.error('Error', error));
  }

  async componentDidMount() {
    const position: Coordinates = await this.getCurrentPositionInfo();
    const address = await this.getAddressByCoordinates(coordinatesToLatLngLiteral(position));

    this.setState({ address });
  }

  async componentDidUpdate(prevProps: PlacesProps, prevState: PlacesState) {
    if (this.state.address && this.state.address != prevState.address) {
      const coordinates = await this.getCoordinatesByAddress(this.state.address);
      const sunriseTime = await this.getSunrise(latLngLiteralToCoordinates(coordinates));
      const sunsetTime = await this.getSunset(latLngLiteralToCoordinates(coordinates));

      console.log("coordinates", coordinates)
      console.log("sunriseTime", sunriseTime)
      console.log("sunsetTime", sunsetTime)

      this.setState({ coordinates, sunriseTime, sunsetTime });
    }
  }

  handleChange = (address: string) => {
    this.setState({ enteredAddress: address });
  };

  handleSelect = (address: string) => {
    console.log("Current address is", address);
    this.setState({
      enteredAddress: '',
      address
    });
  };

  render() {
    return (
      <PlacesAutocomplete
        value={this.state.enteredAddress}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            {this.state.coordinates && <p>Latitude: {this.state.coordinates.lat} Longitude: {this.state.coordinates.lng}</p>}
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };

                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
            <div className="sunrise-sunset-container">
              {this.state.address && <h2>{this.state.address}</h2>}
              <h3>Current Date: {Moment(Date.now()).format("D MMMM YYYY [(]dddd[)]")}</h3>
              {this.state.sunriseTime && <p>Sunrise Time: {Moment(this.state.sunriseTime).format('h:mm:ss a')}</p>}
              {this.state.sunsetTime && <p>Sunset Time: {Moment(this.state.sunsetTime).format('h:mm:ss a')}</p>}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}
