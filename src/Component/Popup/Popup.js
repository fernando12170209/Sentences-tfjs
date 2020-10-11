import React from 'react';  
import './Popup.css';  

class Popup extends React.Component {
    state={
        closePopUp:false

    }
         
  render() {  
    console.log(this.props)
    return (
    <div className='popup'>  
               
        <div className='popup_contenido'>
            
            <div className="row">
                <div className="col-pop-90">
                </div>
                <div className="col-pop-10 alineacion-derecha">                
                    <button className="button-color" onClick={this.props.closePopup}> Cerrar </button>
                </div>   
            </div>

            <div className="row">
                <h1 className="titulo-center">{this.props.titulo}</h1>
            </div>              
            
            <div className="row">
                {this.props.contenido} 
            </div>
             
        </div>  
    </div>
     
);  
}  
}  

export default Popup;