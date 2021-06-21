import React, { Component } from "react";

class Timer extends Component {
  constructor() {
    super();
    //this.timer is initialized in the constructor
    //and attr. ref is then added to a specific JSX element in this case, section (line 42 in render())
    //once the timer component mounts, it is possible to access the DOM node, section using the associated ref attr. 
    //to access the DOM using this.timer, we need to write this.timer followed by current (console.log(this.timer.current))
    this.timer = React.createRef();
    this.state = {
      time: 0,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16)
    };
  }

  //Your code here

  //Below, initializes an interval
  //The interval is set based on the prop updateInterval, 
  //If you look at App, you can see that this is a state value that is being set using the Controls comp 
  //and updating a method updateIntervalSetting
  //this allows us to mount multiple Timers that tick at different intervals
  //Each Timer component is keeping track of its own time using the state, value time. 
  
  
  //The major cause for CDU is to allow for 'post-processing action and manupulate the DOM outside of using JSX
  //example: using CDU to scroll to the bottom of a chatroom window every time a new message is received
  componentDidMount() {
    this.interval = setInterval(
      //this.clockTick called from the set interval, handles updating time, incremeting it by the updateInterval
      this.clockTick,
      this.props.updateInterval * 1000
    );
    //console.log(this.timer.current) 
    //=> <section class="Timer" style="background: rgb(158, 57, 245);"><h1>24</h1><button>Stop</button><aside class="logText"></aside><small>X</small></section>
    //console.log(this.timer.current.style.background)
    //=> rgb(85, 121, 8)
    //With this.timer.current.style we can access and modify style properties
    //We can already modify the style of our Timer comp. using state(the background color is set by state)
    //Using a ref in component DidUpdate to change style properties will override any styling set in the render(), but won't set state
  }

  //Deliverable: calls ComponentDidUpdate
  componentDidUpdate(){
    //use the provided ref to manipulate the DOM node to visually confirm
    this.timer.current.style.color = "#" + Math.floor(Math.random() * 16777215).toString(16)
    //this will change the font color randomly 
    //CDU will fire every time the component updates
  }

  //Devliverable: calls shouldComponentUpdate 
  //Usually we want Rct to ahndle its updating. Although comp updatating may happen 
  //nearly constantly on a Rct app, it is usually imperceptible to the user
  //there are cases where you may want to limit how often a component updates
  //or control what triggers an update. For this we have SCU
  //SCU fires just before a comp. commits to updating. 
  //if true is returned from the method, the comp will update. 
  //every time Apps state changes, it causes its timer children to update, we can intercept and stop this from happening 
  //SCU takes two args. (the next props and state from potential update)
  //This is to say, when a comp is ABOUT to update, it calls SCU passing in the new props and state. 
  //Whatever the return value is will determine if the comp. continues with the update process
  //b/c up this, from within SCU we have access to both the current props and state 
  //accessible with this.state and this.props, and the NEXT props and state 
  //represented as nextProps and nextState 
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.time === nextState.time){
      return false
    }
    return true
  }
  //Above, in regards to Timer comp. updating, we only need to update when this.state.time changes

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { time, color, logText } = this.state;
    return (
      <section className="Timer" style={{ background: color }} ref={this.timer}>
        <h1>{time}</h1>
        <button onClick={this.stopClock}>Stop</button>
        <aside className="logText">{logText}</aside>
        <small onClick={this.handleClose}>X</small>
      </section>
    );
  }
  

  clockTick = () => {
    this.setState(prevState => ({
      time: prevState.time + this.props.updateInterval
    }));
  };

  stopClock = () => {
    clearInterval(this.interval);
    this.setState({ className: "hidden" });
  };

  // for the 'x' button,
  handleClose = () => {
    this.props.removeTimer(this.props.id);
  };
}

//Bonus - Pure Comp. 
// Pure Comps, do not implement shouldComponentUpdate 
//instead, they automatically do a comparison of current and next props and state, only updates if it registers a change 
//The only change that registers for our Timer comp, is change in this.state.time. 
//instead of including the shouldComponentUpdate method 
//we can include 
// import React, { PureComponent } from 'react';
//And it gets an instant easy reduction in unnessary updates


export default Timer;
