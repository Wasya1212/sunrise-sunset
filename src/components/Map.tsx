import React, { Component } from "react";
import mapboxgl from 'mapbox-gl';

import { latLngLiteralToCoordinates } from "../libs/place";

import Data from "../data";

import "./Map.scss";

mapboxgl.accessToken = Data.mapbox.accessToken;

export interface MapProps {
  address?: string,
  coordinates: Coordinates,
  onClick?: (c: Coordinates) => void
}

export interface MapState {
  selectedCoordinates: Coordinates
}

export default class Map extends Component<MapProps, MapState> {
  private mapContainer: React.RefObject<HTMLDivElement>;
  private _map?: mapboxgl.Map;

  state: MapState = {
    selectedCoordinates: this.props.coordinates
  };

  constructor(props: MapProps) {
    super(props);
    this.mapContainer = React.createRef<HTMLDivElement>();
  }

  componentDidUpdate(prevProps: MapProps, prevState: MapState): void {
    if (this._map) {
      this.addMarker(this.props.coordinates);
    }
  }

  private addMarker(coordinates: Coordinates): void {
    if (!this._map) return;

    if (this._map.getLayer('point')) {
      this._map.removeLayer('point').removeSource('point');
    }

    this._map.addSource('point', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [ coordinates.longitude, coordinates.latitude ]
          },
          'properties': {
            'title': this.props.address || 'Selected Position'
          }
        }]
      }
    });

    this._map.addLayer({
      'id': 'point',
      'type': 'symbol',
      'source': 'point',
      'layout': {
        'icon-anchor': 'bottom',
        'icon-image': 'custom-marker',
        'text-field': ['get', 'title'],
        'text-font': [
          'Open Sans Semibold',
          'Arial Unicode MS Bold'
        ],
        'text-offset': [0, 0.25],
        'text-anchor': 'top'
      }
    });
  }

  shouldComponentUpdate(): boolean {
    return true;
  }

  componentWillReceiveProps(nextProps: MapProps) {
    if (this.props != nextProps && this._map) {
      this._map.flyTo({
        center: [
          nextProps.coordinates.longitude,
          nextProps.coordinates.latitude
        ],
        zoom: 4
      });
    }
  }

  componentDidMount(): void {
    this._map = new mapboxgl.Map({
      container: "map-container",
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.props.coordinates.longitude, this.props.coordinates.latitude],
      zoom: 1
    });

    this._map.on("load", () => {
      if (!this._map) return;

      this._map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (error: any, image: any) => {
        if (!this._map) return;

        this._map.addImage('custom-marker', image);
      });
    });

    this._map.on("click", (e: any) => {
      const clickedCoordinates: Coordinates = latLngLiteralToCoordinates(e.lngLat.wrap());

      try {
        this.setState({
          selectedCoordinates: clickedCoordinates
        });

        if (this.props.onClick) {
          this.props.onClick(clickedCoordinates);
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  render(): JSX.Element {
    return (
      <div id="map-container" ref={this.mapContainer}></div>
    );
  }
}
