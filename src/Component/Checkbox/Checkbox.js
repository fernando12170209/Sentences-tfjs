import React, { Component } from 'react';
import './Checkbox.css';
//https://stackoverflow.com/questions/29617200/how-to-make-checkboxes-rounded
class Checkbox extends Component{
    state={

    }
    render(){
        return(
            <React.Fragment>
                <label class="container">Cargar
                    <input type="checkbox" /*checked="checked"*/ />
                    <span class="checkmark"></span>
                </label>
                <label class="container">Descargar
                    <input type="checkbox" />
                    <span class="checkmark"></span>
                </label>

            </React.Fragment>
        );
    }
    
}
export default Checkbox;