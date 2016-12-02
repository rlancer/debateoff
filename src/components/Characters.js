import React, {Component} from 'react';
const characters = [{key: 'larryasbernie', path: 'LarryAsBernie.png', splitPoint: 10}];

class Characters extends Component {
  
  render() {
    return <div style={{border: 'solid 1px #eee'}}>
      {characters.map(char => <img src={`/characters/${char.path}`} key={char.key} ref={c => char.ref = c}/>)}
    </div>
  }
}

export default Characters;
