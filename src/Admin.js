import React, { Component } from 'react';

class Admin extends Component {
  state = {
    message: ''
  };

  componentDidMount() {
    fetch('/admin', {
      headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` }
    })
      .then((res) => {
        if (res.ok || res.status === 401) {
          return res.json();
        }
        throw new Error('Response was not ok');
      })
      .then((res) => this.setState({ message: res.message }))
      .catch((err) => this.setState({ message: err.message }));
  }

  render() {
    return <p>{this.state.message}</p>;
  }
}

export default Admin;
