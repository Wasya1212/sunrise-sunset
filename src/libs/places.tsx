import React, { Component } from "react";

import Moment from "moment";

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

import { Sunrise } from "../components/Sunrise";

import SunriseController from "./sunrise";

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

  private async getCoordinatesByAddress(address: string) {
    return getLatLng((await geocodeByAddress(address))[0]);
  }

  private formatDateToSunriseSunset(date?: Date, iterations: number = 5, minutesStep: number = 5): string[] {
    if (!date) return [];
    return [
      Moment(date).format("HH:mm"),
      ...(new Array(iterations - 1).fill(date)).map((d, index) => (
        Moment(d).add((index + 1) * minutesStep, 'minutes').format("HH:mm")
      ))
    ];
  }

  async componentDidMount() {
    const position = await SunriseController.getCurrentPositionInfo();
    const address = await SunriseController.getAddressByCoordinates(position);

    this.setState({ address });
  }

  async componentDidUpdate(prevProps: PlacesProps, prevState: PlacesState) {
    if (this.state.address && this.state.address != prevState.address) {
      const coordinates = await this.getCoordinatesByAddress(this.state.address);

      const sunriseTime = SunriseController.getSunrise(latLngLiteralToCoordinates(coordinates));
      const sunsetTime = SunriseController.getSunset(latLngLiteralToCoordinates(coordinates));

      this.setState({ coordinates, sunriseTime, sunsetTime });
    }
  }

  handleChange = (address: string) => {
    this.setState({ enteredAddress: address });
  };

  handleSelect = (address: string) => {
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
              {this.state.sunriseTime && <Sunrise sunrise={true} times={this.formatDateToSunriseSunset(this.state.sunriseTime, 4, 20)} />}
              {this.state.sunsetTime && <Sunrise sunrise={false} times={this.formatDateToSunriseSunset(this.state.sunsetTime, 4, 20)} />}
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
