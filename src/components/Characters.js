import React from 'react';
import Component from './Component'


export default class Characters extends Component {
  
  selectCharacter = (char) =>
    this.logic.setSelfCharacter(char);
  
  render() {
    return <div style={{border: 'solid 1px #eee'}}>
      {this.logic.characters.map(char => <img style={{cursor: 'pointer'}} onClick={() => this.selectCharacter(char)} width={char.width} src={`/characters/${char.path}`} key={char.key} ref={c => char.ref = c}/>)}
    </div>
  }
}