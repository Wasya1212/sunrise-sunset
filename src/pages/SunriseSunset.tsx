import React, { Component } from "react";

import SunriseComponent from "../components/Sunrise"
import PlaceComponent from "../components/Place";
import MapComponent from "../components/Map";

import Place, {
  latLngLiteralToCoordinates
} from "../libs/place";

import "./SunriseSunset.scss";

export interface SunriseSunsetPageState {
  currentPlace: Place
}

export default class SunriseSunsetPage extends Component<any, SunriseSunsetPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentPlace: new Place({
        address: "",
        coordinates: latLngLiteralToCoordinates({ lat: 0, lng: 0 })
      })
    };
  }

  private onPlaceChange = (place: Place): void => {
    this.setState({ currentPlace: place });
  }

  private onMapClick = async (clickedCoordinates: Coordinates) => {
    this.setState({
      currentPlace: new Place({
        address: await Place.getAddressByCoordinates(clickedCoordinates),
        coordinates: clickedCoordinates
      })
    });
  }

  render() {
    return (
      <div>
        <div><PlaceComponent getCurrentPlaceOnLoad={true} onPlaceChange={this.onPlaceChange} /></div>
        <div><SunriseComponent place={this.state.currentPlace} /></div>
        <div>
          <MapComponent
            address={this.state.currentPlace.address}
            coordinates={this.state.currentPlace.coordinates}
            onClick={this.onMapClick}
          />
        </div>
      </div>
    );
  }
}
