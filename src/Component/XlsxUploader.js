import React, { Component } from 'react';

import * as XLSX from 'xlsx';

class XlsxUploader extends Component {
    handleInputChange=(e)=>{   
        e.preventDefault();
        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            let readedData = XLSX.read(data, {type: 'binary'});
            const wsname = readedData.SheetNames[0];
            const ws = readedData.Sheets[wsname];
    
            /* Convert array to json*/
            const dataParse = XLSX.utils.sheet_to_json(ws, {header:1});
            console.log(dataParse)
            //setFileUploaded(dataParse);
        };
        reader.readAsBinaryString(f)
        /*
        console.log(file)
        const target=event.target
        const value=event.value
        const name=event.name
        const this2=this
        console.log(value)
        //this.setState({[name]:value})
        let hojas=[]
        console.log(target)
        if(name==='file'){
            console.log('oli')
            let reader = new FileReader()
            reader.readAsArrayBuffer(target.files[0])
            reader.onloadend=(e)=>{
                var data=new Uint8Array(e.target.result);
                var worbook=XLSX.read(data,{tipe:'array'});

                worbook.SheetNames.forEach(function(SheetName){
                    //Mi objeto
                    var XL_row_object=XLSX.utils.sheet_to_row_object_array(worbook.Sheets[SheetName]);

                    hojas.push({
                        data:XL_row_object,
                        SheetName
                    })
                    console.log(hojas)
                    this2.setState({
                        selectedFileDocument:target.files[0],
                        hojas
                    })
                })
            }
        }
        */

    }
    render(){
        
        return(
            <React.Fragment>
                <input
                required
                type="file"
                name="file"
                id="file"
                onChange={(event)=>this.handleInputChange(event)}
                placeholder="Archivo Excel"
                /> 

                
            </React.Fragment>

        );
    }

}
export default  XlsxUploader;