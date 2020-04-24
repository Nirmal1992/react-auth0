import React, { Component } from 'react';

class Courses extends Component {
  state = {
    courses: [],
    message: ''
  };

  componentDidMount() {
    fetch('/course', {
      headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` }
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Response was not ok');
      })
      .then((res) => this.setState({ courses: res.courses }))
      .catch((err) => this.setState({ message: err.message }));
  }

  render() {
    return (
      <div>
        <ul style={{ display: 'initial', color: 'red' }}>
          {this.state.courses.map((course) => (
            <li key={'' + course.id}>{course.title}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Courses;
