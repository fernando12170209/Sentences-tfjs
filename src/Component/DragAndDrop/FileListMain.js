import React, { Component } from 'react'
import DragAndDrop from './DragAndDrop'
import * as XLSX from 'xlsx';
class FileListMain extends Component {
    state = {
        files: [
            'Arrastra aquí tu archivo'

        //'Coquito ABC.pdf',
        ]
    }
    handleDrop = (files) => {
        //Set empty files names
        let fileList = []
        
        
        for (var i = 0; i < files.length; i++) 
        {
            if (!files[i].name) return
            //add new element and its names
            fileList.push(files[i].name)
            //this.setState({files: files[0].name})
            
        }
        //List elemnts
        this.setState({files: fileList})
        //this.setState({files: files[0].name})
        
    }
    //CARGAR EXCEL AL APLICATIVO
    handleInputChange=(e)=>{   
        //Cargar data de Excel al aplicativo emplea saveDataHandler()
        var Banco2={
            data:[],
            /*data:[
                {index:0,
                fecha:"",
                cargo:0,
                abono:0,
                descripcion:"",
                usedFlag:0,
                loadingbancodata:false,
                selected:false
            }
            ],*/
        }
        var Caja2={
            data:[],
            /*data:[
                {index:0,
                fecha:"",
                cargo:0,
                abono:0,
                descripcion:"",
                usedFlag:0,
                loadingcajadata:false,
                selected:false
    }
            ],*/
        }
        e.preventDefault();
        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            let readedData = XLSX.read(data, {type: 'binary'});
            //Caja
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];
    
            /* Convert array to json*/
            const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});

            //Bancos
            const wsname2 = readedData.SheetNames[1];
            const ws2 = readedData.Sheets[wsname2];
    
            /* Convert array to json*/
            const dataParse2 = XLSX.utils.sheet_to_json(ws2, {header:1});
            
            
            var Caja={
                fecha:[],
                cargo:[],
                abono:[],
                descripcion:[]

            }
            var Banco={
                fecha:[],
                cargo:[],
                abono:[],
                descripcion:[]
            }
            
            for(var i=2;i<dataParse.length;i++ ){
                const temp={
                    id:i-2,
                    fecha:(dataParse[i][0]),
                    cargo:(dataParse[i][1]),
                    abono:(dataParse[i][2]),
                    descripcion:(dataParse[i][3]),
                    showOptions:false,
                    loadingcajadata:false,
                    selected:false,
                    idmatch:-1,
                    idmatchAbono:-1,
                    idmatchCargo:-1,
                    usedFlag:false,
                    usedFlagCargo:false,
                    usedFlagAbono:false,
                    typeAbono:'none',
                    typeCargo:'none'
                }
                Caja2.data.push(temp)
                Caja.fecha.push(dataParse[i][0])
                Caja.cargo.push(dataParse[i][1])
                Caja.abono.push(dataParse[i][2])
                Caja.descripcion.push(dataParse[i][3])
            }

            for(var j=2;j<dataParse2.length;j++ ){
                const temp={
                    id:j-2,
                    fecha:(dataParse2[j][0]),
                    cargo:(dataParse2[j][1]),
                    abono:(dataParse2[j][2]),
                    descripcion:(dataParse2[j][3]),
                    loadingbancodata:false,
                    showOptions:false,
                    selected:false,
                    idmatch:-1,
                    idmatchAbono:-1,
                    idmatchCargo:-1,
                    usedFlag:false,
                    usedFlagCargo:false,
                    usedFlagAbono:false,
                    typeAbono:'none',
                    typeCargo:'none'
                }
                Banco2.data.push(temp)
                Banco.fecha.push(dataParse2[j][0])
                Banco.cargo.push(dataParse2[j][1])
                Banco.abono.push(dataParse2[j][2])
                Banco.descripcion.push(dataParse2[j][3])
            }

            //console.log('Caja',Caja)
            

            //console.log('Banco',Banco)
            

            //Secion similar al App.js
            /*
            const inputByUser=Caja.abono
            var arrayFlag=[]
            arrayFlag.length=inputByUser.length
            console.log('arrayFlag',arrayFlag)
            
            const proposedSum=590
            console.log('proposedSum',proposedSum)
            const resultado= SubsetSum(inputByUser,arrayFlag,proposedSum)
            console.log('resultadoexcel',resultado)
            */

           



            
            
            //setFileUploaded(dataParse);
        };
        reader.readAsBinaryString(f)

        reader.onloadend=()=>{
            this.saveDataHandler(Caja2,Banco2)
        }
        

            

        
        
    }
    render() {
        /*
        var nuevo_array = arr.map(function callback(currentValue, index, array) {
            // Elemento devuelto de nuevo_array
        }[, thisArg])
        */
        return (
        <React.Fragment>
        <DragAndDrop handleDrop={this.handleDrop}  >
            <div style={{height: 20, width: 800}} onClick={()=>this.fileInput.click()}>
                <input
                    required
                    type="file"
                    style={{display:'none', height: 70, width: 800}} 
                    name="file"
                    id="file"
                    key="file"
                    onChange={(event)=>this.handleInputChange(event)}
                    ref={fileInput=>this.fileInput=fileInput}
                    placeholder="Archivo Excel"
                />
                {this.state.files.map((file,index) =>
                    <div key={index} >{file}</div>
                )}
            </div>
            
        </DragAndDrop>
        
        
        </React.Fragment>
        )
  }
}
export default FileListMain