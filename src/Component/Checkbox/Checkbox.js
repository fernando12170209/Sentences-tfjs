import React, { Component } from 'react';
import './Checkbox.css';
//https://stackoverflow.com/questions/29617200/how-to-make-checkboxes-rounded
class Checkbox extends Component{
    state={
        //flagCargar:true,
        //flagDescargar:false
    }
    changeFlagHandler=(opt)=>{
        /*
        const stateTemp={...this.state}
        stateTemp[opt]=!stateTemp[opt]

        this.setState(stateTemp)
        */
       //return to parent
       this.props.changeFlags(opt)
    }
    render(){
        return(
            <React.Fragment>
                <label class="container">Cargar
                    <input type="checkbox" checked={this.props.flags.flagCargar} onClick={()=>this.changeFlagHandler('flagCargar')} /*checked="checked"*/ />
                    <span class="checkmark"></span>
                </label>
                <label class="container">Descargar
                    <input type="checkbox" checked={this.props.flags.flagDescargar} onClick={()=>this.changeFlagHandler('flagDescargar')}/>
                    <span class="checkmark"></span>
                </label>

            </React.Fragment>
        );
    }
    
}
export default Checkbox;