import React, { Component } from "react";

import PlacesAutocomplete from "react-places-autocomplete";

import Place from "../libs/place";

export interface PlacesState {
  enteredAddress: string,
  place?: Place
}

export interface PlacesProps {
  onPlaceChange?: (place: Place) => void
}

export type PlaceType = typeof Place;

export default class Places extends Component<PlacesProps, PlacesState> {
  constructor(props: PlacesProps) {
    super(props);

    this.state = {
      enteredAddress: '',
      place: undefined
    };
  }

  handleChange = (address: string) => {
    this.setState({ enteredAddress: address });
  };

  handleSelect = async (address: string) => {
    this.setState({
      enteredAddress: '',
      place: this.state.place
        ? await this.state.place.setNewAddress(address)
        : new Place({ address, coordinates: await Place.getCoordinatesByAddress(address) })
    });

    if (this.props.onPlaceChange && this.state.place) {
      this.props.onPlaceChange(this.state.place);
    }
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
                      key: (): string => `gsip${new Date()}`
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}