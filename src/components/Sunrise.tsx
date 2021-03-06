import React, { Component } from "react";

import Moment from "moment";

import Place from "../libs/place";
import SunriseController from "../libs/sunrise";

import "./Sunrise.scss";

export interface SunriseProperties {
  sunrise: boolean,
  times: (Date | string)[]
}

export function Sunrise(props: SunriseProperties) {
  return (
    <div id="sunrise-container" className={props.sunrise ? "sunrise" : "sunset"}>
      {
        props.sunrise
          ? <input type="radio" name="time" id="sunrise" checked />
          : <input type="radio" name="time" id="sunset" checked />
      }
      <div className="glow"></div>
      <div className="sky"></div>
      <div className="stars"></div>
      <div className="city">
        <div className="building">
          <div className="tower">
            <div className="windows"></div>
          </div>
          <div className="tower">
            <div className="windows"></div>
            <div className="ledge"></div>
          </div>
          <div className="tower">
            <div className="windows"></div>
          </div>
        </div>
        <div className="building">
          <div className="tower">
            <div className="windows"></div>
          </div>
          <div className="tower">
            <div className="windows"></div>
            <div className="ledge"></div>
          </div>
          <div className="tower">
            <div className="windows"></div>
            <div className="ledge"></div>
          </div>
        </div>
        <div className="building">
          <div className="tower">
            <div className="windows"></div>
          </div>
          <div className="tower">
            <div className="windows"></div>
            <div className="ledge"></div>
          </div>
          <div className="tower">
            <div className="windows"></div>
          </div>
        </div>
      </div>
      <div className="times">
        {
          props.times.map((time: Date | string) => (
            <div className="time">
              {
                typeof time == "string"
                  ? time
                  : Moment(time).format("h:mm")
            }</div>
          ))
        }
      </div>
      <div className="heavens">
        {
          props.sunrise
            ? <label htmlFor ="sunrise" className="sunrise" data-title="Sunrise"></label>
            : <label htmlFor ="sunset" className="sunset" data-title="Sunset"></label>
        }
      </div>
      <div className="clouds"></div>
    </div>
  );
}

export interface SunriseComponentState {
  sunrise?: Date,
  sunset?: Date
}

export interface SunriseComponentProps {
  place?: Place
}

export default class SunriseComponent extends Component<SunriseComponentProps, SunriseComponentState> {
  constructor(props: SunriseComponentProps) {
    super(props);

    this.state = {
      sunrise: undefined,
      sunset:  undefined
    };
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

  componentDidMount() {
    if (this.props.place) {
      SunriseController
        .getSunriseSunsetInfo(this.props.place.coordinates)
        .then(info => {
          this.setState({
            sunrise: info.sunrise,
            sunset:  info.sunset
          });
        });
    }
  }

  componentWillReceiveProps(newProps: SunriseComponentProps) {
    if (newProps.place) {
      SunriseController
        .getSunriseSunsetInfo(newProps.place.coordinates)
        .then(info => {
          this.setState({
            sunrise: info.sunrise,
            sunset:  info.sunset
          });
        });
    } else {
      this.setState({
        sunrise: undefined,
        sunset:  undefined
      });
    }
  }

  render() {
    if (!this.props.place) { return <div></div> }

    return (
      <div className="sunrise-info">
        <section className="sunrise-info__text-information">
          {this.props.place.address && <h2>{this.props.place.address}</h2>}
          <div className="sunrise-info__text-information__details">
            {
              this.props.place && (
                <div className="sunrise-info__text-information__details__row">
                  <span className="sunrise-info__text-information__details__cell">Coordinates</span>
                  <span className="sunrise-info__text-information__details__cell">
                    Lat: {this.props.place.coordinates.latitude.toFixed(5)} Lng: {this.props.place.coordinates.longitude.toFixed(5)}
                  </span>
                </div>
              )
            }
            {
              (this.state.sunrise || this.state.sunset) && (
                <div className="sunrise-info__text-information__details__row">
                  <span className="sunrise-info__text-information__details__cell">Current Date</span>
                  <span className="sunrise-info__text-information__details__cell">
                    {Moment(Date.now()).format("D MMMM YYYY [(]dddd[)]")}
                  </span>
                </div>
              )
            }
            {
              this.state.sunrise && (
                <div className="sunrise-info__text-information__details__row">
                  <span className="sunrise-info__text-information__details__cell">Sunrise at</span>
                  <span className="sunrise-info__text-information__details__cell">
                    {Moment(this.state.sunrise).format("HH:mm:ss a")}
                  </span>
                </div>
              )
            }
            {
              this.state.sunset && (
                <div className="sunrise-info__text-information__details__row">
                  <span className="sunrise-info__text-information__details__cell">Sunset at</span>
                  <span className="sunrise-info__text-information__details__cell">
                    {Moment(this.state.sunset).format("HH:mm:ss a")}
                  </span>
                </div>
              )
            }
          </div>
        </section>
        <div className="sunrise-info__visual-information">
          {this.state.sunrise && <Sunrise sunrise={true} times={this.formatDateToSunriseSunset(this.state.sunrise, 4, 20)} />}
          {this.state.sunset && <Sunrise sunrise={false} times={this.formatDateToSunriseSunset(this.state.sunset, 4, 20)} />}
        </div>
      </div>
    );
  }
}
