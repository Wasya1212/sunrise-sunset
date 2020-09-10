import React, { Component } from "react";

import Places from "../libs/places";

export default class SunriseComponent extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <section>
        <form>
          <Places />
        </form>
      </section>
    );
  }
}
