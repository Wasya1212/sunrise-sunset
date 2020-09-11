import React, { Component } from "react";

import Moment from "moment";

import Places from "../libs/places";

import "./Sunrise.scss";

export interface SunriseComponentProps {
  sunrise: boolean,
  times: Date[]
}

export function Sunrise(props: SunriseComponentProps) {
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
          props.times.map((time: Date) => (
            <div className="time">{Moment(time).format("h:mm")}</div>
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
  sunrise?: Date[],
  sunset?: Date[]
}

export default class SunriseComponent extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }



  render() {
    return (
      <section>
        <form>
          <Places />
          <section>
            <Sunrise sunrise={true} times={[new Date(), new Date(), new Date(), new Date(), new Date()]} />
            <Sunrise sunrise={false} times={[new Date(), new Date(), new Date(), new Date(), new Date()]} />
          </section>
        </form>
      </section>
    );
  }
}
