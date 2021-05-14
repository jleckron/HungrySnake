import React, { Component } from 'react'
import Display from './components/Display'
import './App.css'

class App extends Component {
  render(){
    return (
      <div className="App">
        <div>
          <h3>Can you beat the hungry snake?</h3>
        </div>
        <Display/>
      </div>
    );
  }
}

export default App;