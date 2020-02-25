import React, { Component } from 'react'
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';

// API key here from Clarifai.
const app = new Clarifai.App({
  apiKey: 'a4547bc895db42f0874614febda0adb0'
 });
const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 1000
      }
    }
  }
}

export class App extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: [],
      route: 'signin',
      hasSignIn: false
    }
  }



 determineFaceLocation = (data) => {
 const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
 const image = document.getElementById('inputimage');
 const width = Number(image.width);
 const height = Number(image.height);

 return {
  leftCol: clarifaiFace.left_col * width,
  topRow: clarifaiFace.top_row * height,
  rightCol: width - (clarifaiFace.right_col * width),
  bottomRow: height - (clarifaiFace.bottom_row * height)
}
  }
  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL,
     this.state.input)
     .then(response => this.displayFaceBox(this.determineFaceLocation(response)) )
      .catch(err => console.log(err));
  
  }
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({hasSignIn: false})
    } else if (route === 'home') {
      this.setState({hasSignIn: true})
    }
    this.setState({route: route});
  }
  render() {

    const { hasSignIn,imageUrl,box,route } = this.state;

    return (
      <div className="App">
      <Particles className='particles'
              params={particlesOptions}
              
      />
      <Navigation hasSignIn={hasSignIn} onRouteChange={this.onRouteChange}/>
      { this.state.route === 'home' ?
      <div>
       <Logo/>
       <Rank/>
      <ImageLinkForm 
      onInputChange={this.onInputChange} 
      onButtonSubmit={this.onButtonSubmit}
      />
      <FaceRecognition box={box} imageUrl={imageUrl}/>
      </div>
      : (
        route === 'signin'
        ? <Signin onRouteChange={this.onRouteChange}/>
        :<Register onRouteChange={this.onRouteChange}/>
      )

      }

      </div>
    );
  }
}


export default App;
