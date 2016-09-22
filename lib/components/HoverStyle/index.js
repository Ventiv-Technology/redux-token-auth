/**
 * Component that supports changing styles while hovering
 *
 * @flow
 */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react';

type PropTypes = {
  style: any;
  hoverStyle: any;
  children: Array<*>;
};

export default class HoverStyle extends React.Component {   // eslint-disable-line

  constructor(props : PropTypes) {
    super(props);

    this.state = {
      hovering: false,
    };

    const self : any = this;
    self.setHovering = this.setHovering.bind(this);
    self.unsetHovering = this.unsetHovering.bind(this);
  }

  state: {
    hovering: boolean;
  }

  setHovering() {
    this.setState({ hovering: true });
  }

  unsetHovering() {
    this.setState({ hovering: false });
  }

  render() {
    return (
      <div {...this.props} style={this.state.hovering ? this.props.hoverStyle : this.props.style} onMouseOver={this.setHovering} onMouseOut={this.unsetHovering}>
        {this.props.children}
      </div>
    );
  }

}
