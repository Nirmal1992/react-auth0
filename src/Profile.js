import React, { Component } from 'react';

class Profile extends Component {
  state = {
    profile: null,
    error: ''
  };

  componentDidMount() {
    this.getProfileData();
  }

  getProfileData() {
    this.props.auth.getProfile((profile, error) =>
      this.setState({ profile, error })
    );
  }

  render() {
    const { profile, error } = this.state;
    if (error) {
      return <div>Error occured: {error.error}</div>;
    }

    if (!profile) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h1 className='heading'>Profile</h1>
        <h2>{profile.nickname}</h2>
        <img
          src={profile.picture}
          style={{ width: 100, height: 100 }}
          alt='Profile pic'
        />
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    );
  }
}

export default Profile;
