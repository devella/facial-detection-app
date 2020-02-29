import React, { Component } from 'react'
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';


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
 
const firstStage = {
  
    input: '',
    imageUrl: '',
    box: [],
    route: 'signin',
    hasSignIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: '' 
    }
  }


export class App extends Component {
  constructor() {
    super();
    this.state = firstStage;
  }
  updateUser = (info) => {
    this.setState({user: {
      id: info.id,
      name: info.name,
      email: info.email,
      entries: info.entries,
      joined: info.joined 

    }})
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
    fetch('https://nameless-cliffs-04369.herokuapp.com/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
         })
         .then(response => response.json())
    
     .then(response => {
       if (response) {
         fetch('https://nameless-cliffs-04369.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
         })
         .then(response => response.json())
         .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
           })
           .catch(console.log)
       }
       this.displayFaceBox(this.determineFaceLocation(response)) 
        })
      .catch(err => console.log(err));
  }
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(firstStage)
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
       <Rank name={this.state.user.name} entries={this.state.user.entries}/>
      <ImageLinkForm 
      onInputChange={this.onInputChange} 
      onButtonSubmit={this.onButtonSubmit}
      />
      <FaceRecognition box={box} imageUrl={imageUrl}/>
      </div>
      : (
        route === 'signin'
        ? <Signin updateUser={this.updateUser} onRouteChange={this.onRouteChange}/>
        :<Register updateUser={this.updateUser} onRouteChange={this.onRouteChange}/>
      )

      }

      </div>
    );
  }
}


export default App;
