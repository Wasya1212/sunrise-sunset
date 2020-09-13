import React, { Component } from "react";

import SunriseComponent from "../components/Sunrise"
import PlaceComponent from "../components/Place";

import Place from "../libs/place";
import Sunrise from "../libs/sunrise";

export interface SunriseSunsetPageState {
  currentPlace?: Place
}

export default class SunriseSunsetPage extends Component<any, SunriseSunsetPageState> {
  constructor(props: any) {
    super(props);

    this.state = { };
  }

  private onPlaceChange = (place: Place): void => {
    this.setState({ currentPlace: place });
  }

  render() {
    return (
      <div>
        <div><PlaceComponent getCurrentPlaceOnLoad={true} onPlaceChange={this.onPlaceChange} /></div>
        <div><SunriseComponent place={this.state.currentPlace} /></div>
      </div>
    );
  }
}
