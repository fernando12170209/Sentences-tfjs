import React, { Component } from 'react';
import './Table.css';
import Popup from './Popup/Popup'
import Popupflotante from './Popup/Popup_flotante'


//Para determinar que grupo de valores suman X
//import SubsetSum from './SumSubset';
import SubSetSum2 from './SubSetSum/SubSetSum2';

import DragAndDrop from './DragAndDrop/DragAndDrop';
import Checkbox from './Checkbox/Checkbox';

import excelFile from '../files/BoucheoCajaBanco.xlsx';

import {FaFileExcel} from 'react-icons/fa'
//Icons
import { AiOutlineCloseCircle } from "react-icons/ai";
//npm i xlsx
import * as XLSX from 'xlsx';
//npm i file-saver
import * as FileSaver from 'file-saver';
class XlsxUploaderV3 extends Component {
    state={

        opcion:0,
        showPopup:false,
        showPopupFloat:false,

        flagsCheckbox:{
            flagCargar:true,
            flagDescargar:false
        },

        showOptions:false,
        showtable:false,
        dataBanco:{
            data:[{id:1,fecha:"",cargo:"",abono:"",descripcion:"",showOptions:false,loadingbancodata:false,selected:false,usedFlag:false,usedFlagAbono:false,usedFlagCargo:false,idmatch:0,idmatchAbono:0,idmatchCargo:0,typeAbono:'none',typeCargo:'none'}],
        },
        dataCaja:{
            data:[{id:1,fecha:"",cargo:"",abono:"",descripcion:"",showOptions:false,loadingcajadata:false,selected:false,usedFlag:false,usedFlagAbono:false,usedFlagCargo:false,idmatch:0,idmatchAbono:0,idmatchCargo:0,typeAbono:'none',typeCargo:'none'}],
        },

        idCajaSelect:0,
        idBancoSelect:0,
        parametro:"",//abono , cargo
        listOptions:{
            flag:false,
            optionSelected:1,//1:Caja 2:Banco
            listdata:[{id:1,fecha:"",cargo:"",abono:"",descripcion:"",showOptions:false,loadingcajadata:false,selected:false,usedFlag:false,usedFlagAbono:false,usedFlagCargo:false,idmatch:0,idmatchAbono:0,idmatchCargo:0,typeAbono:'none',typeCargo:'none'}],
        },
        positionPopup:'right' //Popup show 'right': when caja is clicked ELSE 'left'
        
    }
    toggleMultiCheckbox=(opt)=>{
        
        const stateTemp={...this.state}
        for(var temp in stateTemp.flagsCheckbox){
            stateTemp.flagsCheckbox[temp]=false
        }
        stateTemp.flagsCheckbox[opt]=!stateTemp.flagsCheckbox[opt]

        this.setState(stateTemp)

        if(this.state.flagsCheckbox.flagDescargar){
            this.btnDownloadHandler()
        }
        
    }
    descargarTablas=(csvData, fileName)=>{

        console.log(csvData)

        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        //utf-8 caracteres especiales o 1252 ASCI en SQL
    
        //formato csv, excel cae en redunancia al separar los campos por espacios
        const wsCaja = XLSX.utils.json_to_sheet(csvData.caja);
        const wsBanco = XLSX.utils.json_to_sheet(csvData.banco);
        //nombre por default en Hoja
        const wb = { Sheets: { 'Caja': wsCaja,'Banco':wsBanco }, SheetNames: ['Caja','Banco'] };
        //Tamaño de buffer en promedio de navegadores "2Gb"
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        //Save como csv
        FileSaver.saveAs(data, fileName + fileExtension);

    }
    btnDownloadHandler=()=>{
        this.toggleMultiCheckbox('flagCargar')
        const fileData={
            fileName:"ConciliacionCajaBanco_Results",
            data:{
                caja:[{id:1,descripcion:"uno"},{id:2,descripcion:"dos"},{id:3,descripcion:"tres"}],
                banco:[{id:1,descripcion:"cuatro"},{id:2,descripcion:"cinco"},{id:3,descripcion:"seis"}]
            }
        }
        this.descargarTablas(fileData.data,fileData.fileName)
    }
    //Funcion de apoyo 
    yyyymmdd=(dateIn)=> {
        var yyyy = dateIn.getFullYear();
        var mm = dateIn.getMonth()+1; // getMonth() is zero-based
        var dd  = dateIn.getDate();
        return String(yyyy +"/"+ mm +"/" + dd); // Leading zeros for mm and dd
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
        //console.log(f)
        if(f.type==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

        
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
                //console.log(dataParse[i][0])
                let myDate = new Date(( (dataParse[i][0]) - (25567 + 1))*86400*1000)
                const temp={
                    id:i-2,
                    fecha:myDate.toLocaleDateString(),
                    //fecha:this.yyyymmdd(myDate),
                    // fecha:(dataParse[i][0]),
                    cargo:(dataParse[i][1]===undefined?0:dataParse[i][1]),
                    abono:(dataParse[i][2]===undefined?0:dataParse[i][2]),
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
                // 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug")             
                // 2. Convert to milliseconds.
                //Excel to date javascript
                //Ref:https://gist.github.com/christopherscott/2782634
                let myDate = new Date(( (dataParse2[j][0]) - (25567 + 1))*86400*1000)
                const temp={
                    id:j-2,
                    fecha:myDate.toLocaleDateString(),
                    //fecha:(dataParse2[j][0]),
                    cargo:(dataParse2[j][1]===undefined?0:dataParse2[j][1]),
                    abono:(dataParse2[j][2]===undefined?0:dataParse2[j][2]),
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
        }else{
            alert('Seleccione un archivo Excel')
        }
        
    }

    //Grabar los datos en las variables para las tablas Caja y Banco
    saveDataHandler=(Caja2,Banco2)=>{
        //console.log('Caja2',Caja2)
        //console.log('Banco2',Banco2)
        /*
        const dataCaja = {...this.state.dataCaja}
        dataCaja.data=Caja2.data
        const dataBanco = {...this.state.dataBanco}
        dataBanco.data=Banco2.data
        
        this.setState({dataCaja:dataCaja})
        this.setState({dataBanco:dataBanco})
        */
        this.setState({dataCaja:Caja2})
        this.setState({dataBanco:Banco2})
        this.setState({showtable:true})

    }
    
    // When the user clicks on the button, scroll to the top of the document
    topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
    togglePopup() {  
        //Cerrar PopUp
        this.setState({  
             showPopup: !this.state.showPopup  
        });  
    }
    dibujartabla(){
        return(
        <React.Fragment>
            <strong className="ROW">Instrucciones</strong>
            <div className="row text-justify">1.- Descargar la plantilla Excel</div>
            <div className="row text-justify">2.- Ingrese la información registrada en su contabilidad de las operaciones bancarias en la hoja Caja Columna B:D (Col A y E son optativos).</div>
            <div className="row text-justify">3.- Ingrese la información de estado de cuenta bancaria en la hoja Bancos Columna B:D (Col A y E son optativos).</div>
            <div className="row text-justify">4.- No es necesario que Reserve la primera fila tanto la información contable como la de bancos para colocar los saldos</div>
            <div className="row text-justify">5.- Verifique que en la información contable la operaciones tengan fecha de operación, en la información bancaria todas lista operaciones deben tener N° de operación y fecha de la misma. De no cumplirse lo anterior, el sistema procesara los registros que cumplan....</div>
            <div className="row text-justify">6.- Preferentemente inicie por la información Contable, presione click  en las celdas que contengan importe (ya sea un cargo o abono) e inicie la validación, se abrirá una ventana donde debe seleccionar la operación a la que corresponde de acuerdo al extracto Bancario, las operaciones que se van validando se mostraran con un simbolo @, y las que que faltan asociar apareceran como #</div>
            <div className="row text-justify">7.- De ser el caso, aparecerá una ventana para indicar la razón por la cual una operación no figura en el extracto Bancario, en esta sección se puede elegir las opciones 1 y 2.</div>
            <div className="row text-justify">8.- Si ya termino con la información contable, pase la información del extracto bancario y ubique aquellas operaciones que no tienen el check, haga doble click sobre los importes e indique la razón  por la cual no estan registradas en la contabilidad seleccionando entre las opciones 3 y 4</div>
            <div className="row text-justify">9.- Verifique las columnas F y M todas deberían tener una anotación, si ya se verificó esto presione "PROCESAR" para terminar la validación, revise la hoja "Anexo y Resumen</div>
            <div className="row text-justify">10.- Descargar los resultados a Excel</div>
        </React.Fragment>
        
        )
    } 
       
    loadingdata(opcion,data){
        //Mostra mensaje en la fila selecciona mientras se busca la suma solucion
        if(opcion===1){
            //Caja
            const inputsUpdated = {...this.state.dataCaja}
            //console.log(inputsUpdated.data[data.id*1].loadingcajadata)
            inputsUpdated.data[data.id*1].loadingcajadata=inputsUpdated.data[data.id*1].loadingcajadata===false?true:false//!(childData.showData);
            this.setState({dataCaja:inputsUpdated})
        }else{
            //Banco
            const inputsUpdated = {...this.state.dataBanco}
            //console.log(inputsUpdated.data[data.id*1].loadingbancodata)
            inputsUpdated.data[data.id*1].loadingbancodata=inputsUpdated.data[data.id*1].loadingbancodata===false?true:false//!(childData.showData);
            this.setState({dataBanco:inputsUpdated})
        }
    }

    //CERAR POPUP
    togglePopupFlotante() {  
        //Cerrar PopUp
        this.setState({  
             showPopupFloat: !this.state.showPopupFloat  
        });  
    }
    //BUSCAR OPCION DE POPUP
    handleObjectChange(e,data,opcion ){
        //opcion=1 Caja , opcion=2 Banco

        this.setState({opcion:opcion})
        //console.log('data selecionada en fila',data)

        //Top scroll
        //this.topFunction()
        //muestra popup
        //this.togglePopup()

        //show options below raw Caja/Banco Selected en tabla
        const j=data.id*1

        //Edge no reconoce {...this.state}
        //https://stackoverflow.com/questions/53631949/why-ie-11-display-blank-page-rendering-react-app

        //{...this.state}(asigno una copia) vs this.state(objeto real, estoy ediatndo sobre el state verdadero de la aplicacion)
        //https://stackoverflow.com/questions/58572536/difference-between-this-state-and-this-state
        
        //https://stackoverflow.com/questions/43756211/best-way-to-polyfill-es6-features-in-react-app-that-uses-create-react-app
        if(opcion*1===1){
            this.setState({idCajaSelect:data.id})

            const inputsUpdated = {...this.state}
            const input=inputsUpdated['dataCaja']
            //console.log(input.data[j].showOptions)
            input.data[j].showOptions=input.data[j].showOptions===false?true:false//!(childData.showData);
            this.setState({dataCaja:input})
        }else{
            this.setState({idBancoSelect:data.id})

            const inputsUpdated = {...this.state.dataBanco}
            //console.log(inputsUpdated.data[j].showOptions)
            inputsUpdated.data[j].showOptions=inputsUpdated.data[j].showOptions===false?true:false//!(childData.showData);
            this.setState({dataBanco:inputsUpdated})

        }
        
    }    
    async procesarData(e,data,opcion,tipo){

        
        e.preventDefault()
        
        
        //opcion=1 Caja , opcion=2 Banco
        //tipo="cargo" tipo="abono" 
        //Mientas se procesa mostrar mensaje de espera
        this.loadingdata(opcion,data)
        
        //var inputByUser=[]
        var arrayFlag=[]

        var inputByUser2=[]
        //CAJA
        if(opcion*1===1){            
            if(tipo==='cargo'){
                
                for(var i=0;i<this.state.dataBanco.data.length;i++ ){
                    if(this.state.dataBanco.data[i].usedFlagAbono===false){
                        //Evitar considerar montos iguales a cero
                        
                        if(this.state.dataBanco.data[i].abono*1!==0){
                            let objeto={id:this.state.dataBanco.data[i].id,valor:this.state.dataBanco.data[i].abono}
                            //inputByUser.push(this.state.dataBanco.data[i].abono)
                            inputByUser2.push(objeto)
                        }else{
                            //inputByUser.push(0.0001)
                        }
                        
                        //inputByUser.push(this.state.dataBanco.data[i].abono)
                        
                    }
                    
                }                
                //var arrayFlag=[0,0,0,0,0,0,0,0,0,0]
                //Define un array de valores de tamaño igual a inputByUser
                
                //arrayFlag.length=inputByUser.length
                //inicializamos 'arrayFlag' con 0: no se considera y 1 se considera
                //arrayFlag.fill(0)                              
                const proposedSum=data.cargo   
                //console.log('inputByUser',inputByUser.length)             
                //const resultado= await SubsetSum(inputByUser,arrayFlag,proposedSum).then(this.loadingdata(opcion,data))
                //console.log('resultado',resultado)
                console.log('inputByUser2',inputByUser2)
                arrayFlag.length=inputByUser2.length
                arrayFlag.fill(0) 
                const resultado2=await SubSetSum2(inputByUser2,arrayFlag,proposedSum).then(this.loadingdata(opcion,data))
                console.log('resultado',resultado2)

                this.returnListSolutions2(inputByUser2,resultado2,1,'abono')
                

            }else{
                //this.setState({loadingcajadata:true})
                for(var j=0;j<this.state.dataBanco.data.length;j++ ){
                    if(this.state.dataBanco.data[j].usedFlagCargo===false){
                        //Evitar considerar montos iguales a cero
                        
                        if(this.state.dataBanco.data[j].cargo*1!==0){
                            let objeto={id:this.state.dataBanco.data[j].id,valor:this.state.dataBanco.data[j].cargo}
                            //inputByUser.push(this.state.dataBanco.data[j].cargo)
                            inputByUser2.push(objeto)
                        }else{
                            //inputByUser.push(0.0001)
                        }
                        
                        //inputByUser.push(this.state.dataBanco.data[j].cargo)
                        
                    }
                    
                }                
                //var arrayFlag=[0,0,0,0,0,0,0,0,0,0]
                //Define un array de valores de tamaño igual a inputByUser
                
                //arrayFlag.length=inputByUser.length
                //inicializamos 'arrayFlag' con 0: no se considera y 1 se considera
                //arrayFlag.fill(0) 
                //console.log('inputByUser',inputByUser.length)                             
                const proposedSum=data.abono
                //const resultado= await SubsetSum(inputByUser,arrayFlag,proposedSum).then(this.loadingdata(opcion,data))
                //console.log('resultado',resultado)
                console.log('inputByUser2',inputByUser2)
                arrayFlag.length=inputByUser2.length
                arrayFlag.fill(0) 
                const resultado2=await SubSetSum2(inputByUser2,arrayFlag,proposedSum).then(this.loadingdata(opcion,data))
                console.log('resultado',resultado2)

                this.returnListSolutions2(inputByUser2,resultado2,1,'cargo')

            }

            
        }else{
            //BANCO
            
            if(tipo==='cargo'){
                for(var m=0;m<this.state.dataCaja.data.length;m++ ){
                    if(this.state.dataCaja.data[m].usedFlagAbono===false){
                        //Evitar considerar montos iguales a cero
                        
                        if(this.state.dataCaja.data[m].abono*1!==0){
                            let objeto={id:this.state.dataCaja.data[m].id,valor:this.state.dataCaja.data[m].abono}
                            //inputByUser.push(this.state.dataCaja.data[m].abono)
                            inputByUser2.push(objeto)
                        }else{
                            //inputByUser.push(0.0001)
                        }
                        
                        //inputByUser.push(this.state.dataCaja.data[m].abono)
                        
                    }
                    
                }                
                //var arrayFlag=[0,0,0,0,0,0,0,0,0,0]
                //Define un array de valores de tamaño igual a inputByUser
                //Arrayflag=new Array(inputByUser.length)
                //arrayFlag.length=inputByUser.length
                //inicializamos 'arrayFlag' con 0: no se considera y 1 se considera
                //arrayFlag.fill(0)      
                //console.log('inputByUser',inputByUser.length)          
                const proposedSum=data.cargo                
                //const resultado= await SubsetSum(inputByUser,arrayFlag,proposedSum).then(this.loadingdata(opcion,data))
                //console.log('resultado',resultado)
                arrayFlag.length=inputByUser2.length
                arrayFlag.fill(0)
                console.log('BANCO','cargo','inputByUser2',inputByUser2)
                const resultado2= await SubSetSum2(inputByUser2,arrayFlag,proposedSum).then(this.loadingdata(opcion,data))
                console.log('resultado',resultado2)
                
                this.returnListSolutions2(inputByUser2,resultado2,2,'abono')

            }else{
                //this.setState({loadingbancodata:true})

                for(var n=0;n<this.state.dataCaja.data.length;n++ ){
                    if(this.state.dataCaja.data[n].usedFlagCargo===false){
                        //Evitar considerar montos iguales a cero
                        
                        if(this.state.dataCaja.data[n].cargo*1!==0){
                            let objeto={id:this.state.dataCaja.data[n].id,valor:this.state.dataCaja.data[n].cargo}
                            //inputByUser.push(this.state.dataCaja.data[n].cargo)
                            inputByUser2.push(objeto)
                        }else{
                            //inputByUser.push(0.0001)
                        }
                        
                        //inputByUser.push(this.state.dataCaja.data[n].cargo)
                        
                    }
                    
                }                
                //var arrayFlag=[0,0,0,0,0,0,0,0,0,0]
                //Define un array de valores de tamaño igual a inputByUser
                
                //arrayFlag.length=inputByUser.length
                //inicializamos 'arrayFlag' con 0: no se considera y 1 se considera
                //arrayFlag.fill(0)      
                //console.log('inputByUser',inputByUser.length)      
                const proposedSum=data.abono
                //console.log('inputByUser',inputByUser)
                
                //const resultado= await SubsetSum(inputByUser,arrayFlag,proposedSum).then(this.loadingdata(opcion,data))
                //console.log('resultado',resultado)
                arrayFlag.length=inputByUser2.length
                arrayFlag.fill(0)
                console.log('BANCO','abono','inputByUser2',inputByUser2)
                const resultado2= await SubSetSum2(inputByUser2,arrayFlag,proposedSum).then(this.loadingdata(opcion,data))
                console.log('resultado',resultado2)
                
                this.returnListSolutions2(inputByUser2,resultado2,2,'cargo')
            }
        }

        

        //this.setState({showPopupFloat:false})

    }
    returnListSolutions(inputByUser,resultado,opcion,parametro){
        
        //opcion=1 Caja , opcion=2 Banco
        //parametro='abono' , parametro='cargo' 
        const p=parametro
        this.setState({parametro:p})
        //console.log('parametro',parametro)
        //console.log('opcion,opcion)

        //alert(opcion===1?"Buscar en Banco ":"Buscar en Caja ",this.state.parametro)
        //resultado=[{0,0,0,1},{0,1,1,0},{1,1,0,0}] Todas las formas en la que los valores suman
        //inputByUser=[{id:1,valor:},{id:2,valor:},{id:3,valor:},{id:4,valor:}]
        if(opcion===1){
            if(resultado.length>0){
                //Hay Resultados
                //iterar entre la lista de opciones
                //const dataBancotemp={...this.state.dataBanco}
                var dataBancotempOptions=[]
                const dataBancotempData= {...this.state.dataBanco.data.filter(a=>parametro==='abono'?a.usedFlagAbono===false:a.usedFlagCargo===false)}
                //console.log('dataBancotempData',dataBancotempData)
                for(var opt=0;opt<=resultado.length;opt++){
                    //Iterar entre la posiciones de la opcion
                    //console.log(resultado[opt])
                    var result=[]
                    for( var pos=0;pos<resultado[opt].length;pos++){
                        //console.log(opt)
                        if(resultado[opt][pos]===1){
                            //dataBancotempData[pos].selected=true
                            dataBancotempData[inputByUser[pos].id].selected=true                            
                            //console.log(dataBancotempData[pos])
                            //result.push(dataBancotempData[pos])
                            result.push(dataBancotempData[inputByUser[pos].id])
                        }
                    }
                    //Result. index devuleve la posicion de la lista de opciones
                    result.index=opt
                    //Show listoption by index
                    result.flag=false
                    dataBancotempOptions.push(result)
                }
                //console.log(dataBancotempOptions)

                const listOptions={...this.state.listOptions}
                listOptions.flag=true
                listOptions.listdata=dataBancotempOptions
                listOptions.optionSelected=opcion
                this.setState({listOptions:listOptions})
                this.setState({showPopupFloat:true})
                this.setState({positionPopup:'left'})

                //console.log('listOptions',listOptions)
                
            }else{
                //No hay resultados
                //console.log('No hay resultados')

                alert('No hay resultados que mostrar')
            }

        }
        else{
            if(resultado.length>0){
                //Hay Resultados
                //iterar entre la lista de opciones
                //const dataBancotemp={...this.state.dataBanco}
                var dataCajatempOptions=[]
                const dataCajatempData= {...this.state.dataCaja.data.filter(a=>parametro==='abono'?a.usedFlagAbono===false:a.usedFlagCargo===false)}
                console.log('dataCajatempData',dataCajatempData)
                for(var opts=0;opts<=resultado.length;opts++){
                    //Iterar entre la posiciones de la opcion
                    console.log('-->',resultado)
                    var results=[]
                    for( var poss=0;poss<resultado[opts].length;poss++){
                        //console.log(opt)
                        if(resultado[opts][poss]===1){
                            //dataCajatempData[poss].selected=true
                            dataCajatempData[inputByUser[poss].id].selected=true  
                            //console.log(dataBancotempData[pos])
                            //results.push(dataCajatempData[poss])
                            results.push(dataCajatempData[inputByUser[poss].id])
                        }
                    }
                    //Result. index devuleve la posicion de la lista de opciones
                    results.index=opts
                    //Show listoption by index
                    results.flag=false
                    dataCajatempOptions.push(results)
                }
                //console.log(dataCajatempOptions)
                const listOptions={...this.state.listOptions}
                listOptions.flag=true
                listOptions.listdata=dataCajatempOptions
                listOptions.optionSelected=opcion
                this.setState({listOptions:listOptions})
                this.setState({showPopupFloat:true})
                this.setState({positionPopup:'right'})           
            }else{
                //No hay resultados
                alert('No hay resultados que mostrar')
            }
        }

        

    }

    returnListSolutions2(inputByUser,resultado_,opcion,parametro){
        
        //opcion=1 Caja , opcion=2 Banco
        //parametro='abono' , parametro='cargo' 
        const p=parametro
        this.setState({parametro:p})
        //console.log('parametro',parametro)
        //console.log('opcion,opcion)
        const resultado=[...resultado_]
        const r=[...resultado_]
        const numOpciones=r.length
        console.log('resultado',resultado)
        console.log('resultado.length',resultado.length)
        //alert(opcion===1?"Buscar en Banco ":"Buscar en Caja ",this.state.parametro)
        //resultado=[{0,0,0,1},{0,1,1,0},{1,1,0,0}] Todas las formas en la que los valores suman
        //inputByUser=[{id:1,valor:},{id:2,valor:},{id:3,valor:},{id:4,valor:}]
        if(opcion===1){
            if(numOpciones>0){
                //Hay Resultados
                //iterar entre la lista de opciones
                //const dataBancotemp={...this.state.dataBanco}
                var dataBancotempOptions=[]
                const dataBancotempData= {...this.state.dataBanco.data.filter(a=>parametro==='abono'?a.usedFlagAbono===false && a.abono!==0:a.usedFlagCargo===false && a.cargo!==0)}
                //console.log('dataBancotempData',dataBancotempData)
                let largo=0
                for(var temp in dataBancotempData){
                    console.log(temp)
                    largo+=1
                }
                for(var opt=0;opt<resultado.length;opt++){
                    //Iterar entre la posiciones de la opcion
                    //console.log(resultado[opt])
                    var result=[]
                    for( var pos=0;pos<resultado[opt].length;pos++){
                        //console.log(opt)
                        if((resultado[opt][pos])*1===1*1){
                            for(var m=0;m<largo;m++){
                                if(dataBancotempData[m].id===inputByUser[pos].id)
                                {                                    
                                    dataBancotempData[m].selected=true
                                    result.push(dataBancotempData[m])
                                }
                            }
                        }
                    }
                    //Result. index devuleve la posicion de la lista de opciones
                    result.index=opt
                    //Show listoption by index
                    result.flag=false
                    dataBancotempOptions.push(result)
                }
                //console.log(dataBancotempOptions)

                const listOptions={...this.state.listOptions}
                listOptions.flag=true
                listOptions.listdata=dataBancotempOptions
                listOptions.optionSelected=opcion
                this.setState({listOptions:listOptions})
                this.setState({showPopupFloat:true})
                this.setState({positionPopup:'left'})

                //console.log('listOptions',listOptions)
                
            }else{
                //No hay resultados
                //console.log('No hay resultados')

                alert('No hay resultados que mostrar')
            }

        }
        else{
            if(numOpciones>0){
                //Hay Resultados
                //iterar entre la lista de opciones
                //const dataBancotemp={...this.state.dataBanco}
                var dataCajatempOptions=[]
                const dataCajatempData= {...this.state.dataCaja.data.filter(a=>parametro==='abono'?a.usedFlagAbono===false && a.abono!==0 :a.usedFlagCargo===false && a.cargo!==0 )}
                //console.log('dataCajatempData',dataCajatempData)
                //console.log('resultado.length',resultado.length)
                
                let largo=0
                for(var temp2 in dataCajatempData){
                    console.log(temp2)
                    largo+=1
                }
                
                for(var opts=0;opts<numOpciones;opts++){
                    //Iterar entre la posiciones de la opcion
                    //console.log('-->',opts)
                    //console.log('<->',{...resultado})
                    //console.log('inputByUser',inputByUser)
                    var results=[]
                    for( var poss=0;poss<inputByUser.length;poss++){
                        if((resultado[opts][poss])*1===1*1){
                            for(var j=0;j<largo;j++){
                                if(dataCajatempData[j].id===inputByUser[poss].id)
                                {                                    
                                    dataCajatempData[j].selected=true
                                    results.push(dataCajatempData[j])
                                }
                            }
                        }
                    }
                    //Result. index devuleve la posicion de la lista de opciones
                    results.index=opts
                    //Show listoption by index
                    results.flag=false
                    dataCajatempOptions.push(results)
                }
                //console.log(dataCajatempOptions)
                const listOptions={...this.state.listOptions}
                listOptions.flag=true
                listOptions.listdata=dataCajatempOptions
                listOptions.optionSelected=opcion
                this.setState({listOptions:listOptions})
                this.setState({showPopupFloat:true})
                this.setState({positionPopup:'right'})           
            }else{
                //No hay resultados
                alert('No hay resultados que mostrar')
            }
        }

        

    }

    //DIBUJAR LISTA DE OPCIONES EN POPUP
    dibujarListaOpciones(){
        const optionSelected={...this.state.listOptions.optionSelected}
        //console.log('listOptions=>',this.state.listOptions)
        console.log('parametro=>',this.state.parametro)
        //Parametro
        //const parametro={...this.state.parametro}
        return(
        <React.Fragment>
            <p>{'Se encontraron ' +this.state.listOptions.listdata.length +' grupos de opciones'}</p>
            <table index="Caja_" key='Caja' className="table table-center">
                    <thead>
                        <tr index={'Caja1_'} key={'Caja1'}>
                            <th colSpan="4">{this.state.listOptions.optionSelected===1? 'Estado de Cuenta - Extracto Bancario': 'Libro Contable Empresa'}</th>
                        </tr>
                        
                        <tr index={'Caja2_'} key={'Caja2'}>
                            <th colSpan="1">Fecha</th>
                            <th colSpan="1">Cargo</th>
                            <th colSpan="1">Abono</th>
                            <th colSpan="1">Descripción</th>
                        </tr>
                        
                    </thead>
                    {
                        <tbody>
                        {
                        this.state.listOptions.listdata.map(con=>{
                            return(<React.Fragment>
                            <tr id={'opcion'+con.index} key={'opcion'+con.index} onClick={(e)=>{this.showListOptions(e,con,optionSelected)}} >
                                <td colSpan={4}>{'Se tiene un grupo con '+con.length + ' items'}</td>
                            </tr>
                            {   con.flag?
                                con.map(c=>{
                                    return(
                                    <tr id={'opcion'+con.index+'-'+c.id} key={'opcion'+con.index+'-'+c.id}  className="ct_nivel2" onClick={(e)=>this.handleObjectListChange(e,con,optionSelected)}>
                                        <td className="text-izquierda">{c.fecha}</td>
                                        <td className={this.state.parametro==="cargo"?"text-resaltar":""}>{c.cargo}</td>
                                        <td className={this.state.parametro==="abono"?"text-resaltar":""}>{c.abono}</td>
                                        <td className="text-izquierda">{c.descripcion}</td>
                                    </tr>
                                    )
                                }):null
                            }
                            </React.Fragment>
                            )
                        })
                        }
                    </tbody>
                    }
            </table>
        </React.Fragment>
        )

    }
    //Show-Hide list options
    showListOptions(e,data,opcion){
        console.log('data',data,'opcion',opcion)
        data.flag=!data.flag
        const listOptions={...this.state.listOptions}
        listOptions.listdata[data.index]=data
        this.setState({listOptions:listOptions})
    }

    //ACTUALIZAR OPCION EN LA TABLA
    handleObjectListChange(e,data,opcion){
        this.setState({showPopupFloat:false})
        //opcion:1 Caja  opcion:2 Banco
        //parametro='abono' parametro='cargo'
        
        if(this.state.listOptions.optionSelected===1){
            //console.log('idCajaSelect',this.state.idCajaSelect)
            //EN bucle cambiar usedFlag=1 de la lista Banco
            const dataBanco={...this.state.dataBanco}
            for(const dat of data){
                //console.log(dat)
                //console.log(dat.id)
                for(var j=0; j<dataBanco.data.length;j++){
                    if(dataBanco.data[j].id*1===dat.id*1){
                        this.state.parametro==="abono"?dataBanco.data[j].usedFlagAbono=true:dataBanco.data[j].usedFlagCargo=true;                        
                        this.state.parametro==="abono"?dataBanco.data[j].idmatchAbono=this.state.idCajaSelect*1:dataBanco.data[j].idmatchCargo=this.state.idCajaSelect*1;
                        
                        this.state.parametro==="abono"?dataBanco.data[j].typeAbono='child':dataBanco.data[j].typeCargo='child';
                        
                    }
                    

                }
            }
            this.setState({dataBanco:dataBanco})
            //Cambiar usedFlag=1 de la lista Caja segun id===idCajaSelect
            const dataCaja={...this.state.dataCaja}
            for(var m=0;m<dataCaja.data.length;m++){
                if(dataCaja.data[m].id===this.state.idCajaSelect){
                    this.state.parametro==="abono"?dataCaja.data[m].usedFlagCargo=true:dataCaja.data[m].usedFlagAbono=true
                    //dataCaja.data[m].usedFlag=true

                    this.state.parametro==="abono"?dataCaja.data[m].typeCargo='master':dataCaja.data[m].typeAbono='master'
                }
            }
            this.setState({dataCaja:dataCaja})

        }else{
            //console.log('idBancoSelect',this.state.idBancoSelect)
            //EN bucle cambiar usedFlag=1 de la lista Caja
            const dataCajas={...this.state.dataCaja}
            for(const dat of data){
                //console.log(dat)
                //console.log(dat.id)
                for(var i=0; i<dataCajas.data.length;i++){
                    if(dataCajas.data[i].id===dat.id){
                        this.state.parametro==='abono'?dataCajas.data[i].usedFlagAbono=true:dataCajas.data[i].usedFlagCargo=true ;                       
                        this.state.parametro==='abono'?dataCajas.data[i].idmatchAbono=this.state.idBancoSelect*1:dataCajas.data[i].idmatchCargo=this.state.idBancoSelect*1;

                        this.state.parametro==="abono"?dataCajas.data[i].typeAbono='child':dataCajas.data[i].typeCargo='child';
                    }
                    

                }
            }
            this.setState({dataCaja:dataCajas})

            //Cambiar usedFlag=1 de la lista Caja segun id===idBancoSelect
            const dataBancos={...this.state.dataBanco}
            for(var n=0;n<dataBancos.data.length;n++){
                if(dataBancos.data[n].id===this.state.idBancoSelect){
                    this.state.parametro==='abono'?dataBancos.data[n].usedFlagCargo=true:dataBancos.data[n].usedFlagAbono=true;

                    this.state.parametro==='abono'?dataBancos.data[n].typeCargo='master':dataBancos.data[n].typeAbono='master';
                    
                }
            }
            this.setState({dataBanco:dataBancos})
        }
        
        //alert()

    }
    //DEVOLVER LOS OPCIONES SELECCIONADAS A VALORES POR DEFECTO
    restoreMatching(event,data,opcion,parametro){
        event.preventDefault()
        //Buscar en opcion:1 Caja  opcion:2 Banco
        //Buscar en parametro='abono' parametro='cargo'
        //console.log('fila seleccionada=>',data,'parametro=>',parametro,'opcion=>',opcion)

        //Definir si la data de entrada es el master[padre] (data.idmatch:-1)
        // o son la lista de opciones asociadas al master[hijos] (idmatch===data.idmatch)
        var master=false;
        if(parametro==="cargo" && data.typeAbono==='master'){//console.log('Seleccione un Abono',1);
        master=true}
        if(parametro==="cargo" && data.typeAbono==='child'){//console.log(2)
        }

        if(parametro==="abono" && data.typeCargo==='master'){//console.log('Seleccione un Cargo',3);
        master=true}
        if(parametro==="abono" && data.typeCargo==='child'){//console.log(4)
        }

        if(master===true){
            //Seleccione el data master y debo limpiar los idmatch de la lista de opciones asociadas
            if(opcion===1){
                const dataCaja={...this.state.dataCaja}
                for(var i=0;i<dataCaja.data.length;i++){
                    if(parametro==='abono'){
                        if(dataCaja.data[i].idmatchAbono===data.id){
                            dataCaja.data[i].usedFlagAbono=false
                            dataCaja.data[i].idmatchAbono=-1

                            dataCaja.data[i].typeAbono='none'    
                        }
    
                    }else{
                        if(dataCaja.data[i].idmatchCargo===data.id){
                            dataCaja.data[i].usedFlagCargo=false
                            dataCaja.data[i].idmatchCargo=-1

                            dataCaja.data[i].typeCargo='none'    
                        }
                    }
                    
    
                }
                const dataBanco={...this.state.dataBanco}
                for(var j=0;j<dataBanco.data.length;j++){
                    
                    if(dataBanco.data[j].id===data.id){
                        if(parametro==='abono'){
                            dataBanco.data[j].usedFlagCargo=false

                            dataBanco.data[j].typeCargo='none'
    
                        }else{
                            dataBanco.data[j].usedFlagAbono=false

                            dataBanco.data[j].typeAbono='none'
                        }
                        
                    }
                }
                this.setState({dataBanco:dataBanco})
                this.setState({dataCaja:dataCaja})
    
    
            }else{
                const dataBanco={...this.state.dataBanco}
                for(var m=0;m<dataBanco.data.length;m++){
                    if(parametro==='abono'){
                        if(dataBanco.data[m].idmatchAbono===data.id){
                            dataBanco.data[m].usedFlagAbono=false
                            dataBanco.data[m].idmatchAbono=-1

                            dataBanco.data[m].typeAbono='none'    
                        }
    
                    }else{
                        if(dataBanco.data[m].idmatchCargo===data.id){
                            dataBanco.data[m].usedFlagCargo=false
                            dataBanco.data[m].idmatchCargo=-1

                            dataBanco.data[m].typeCargo='none'     
                        }
                    }
    
                }
                const dataCaja={...this.state.dataCaja}
                for(var n=0;n<dataCaja.data.length;n++){
                    
                    if(dataCaja.data[n].id===data.id){
                        if(parametro==='abono'){
                            dataCaja.data[n].usedFlagCargo=false

                            dataCaja.data[n].typeCargo='none'    
                        }else{
                            dataCaja.data[n].usedFlagAbono=false

                            dataCaja.data[n].typeAbono='none' 
                        }
                        
                    }
                }
    
                this.setState({dataBanco:dataBanco})
                this.setState({dataCaja:dataCaja})
    
            }

        }else{
            //Selccione algun hijo, debo buscar los hijos asosciados al padre y el padre
            const dat=data
            if(opcion===1){
                //console.log('opcion child selected opcion',opcion)
                const Caja={...this.state.dataCaja}
                //Buscando el master
                for(var qq=0;qq<Caja.data.length;qq++){
                    //console.log(dataCaja.data[q])
                    if(parametro==='abono'){
                        if(Caja.data[qq].id===data.idmatchCargo){
                            //este es el master
                            //console.log('este es el master',Caja.data[qq])
                            Caja.data[qq].typeAbono='none'
                            Caja.data[qq].usedFlagAbono=false
                        }
                    }else{
                        if(Caja.data[qq].id===data.idmatchAbono){
                            //este es el master
                            //console.log('este es el master',Caja.data[qq])
                            Caja.data[qq].typeCargo='none'
                            Caja.data[qq].usedFlagCargo=false
                        }
                    }
                    
                }
                const Banco={...this.state.dataBanco}
                //Buscar los hijos
                for(var oo=0;oo<Banco.data.length;oo++){
                    if(parametro==='abono'){                        
                        if(Banco.data[oo].id!==dat.id && Banco.data[oo].idmatchCargo*1 ===dat.idmatchCargo*1 && Banco.data[oo].usedFlagCargo=== true){
                            Banco.data[oo].idmatchCargo=-1
                            Banco.data[oo].usedFlagCargo=false
                            Banco.data[oo].typeCargo='none'
                        }
                    }else{
                        if(Banco.data[oo].id!==dat.id && Banco.data[oo].idmatchAbono*1===dat.idmatchAbono*1 && Banco.data[oo].usedFlagAbono=== true){
                            //console.log('=>',Banco.data[oo],'idmatchAbono',Banco.data[oo].idmatchAbono)
                            Banco.data[oo].idmatchAbono=-1
                            Banco.data[oo].usedFlagAbono=false
                            Banco.data[oo].typeAbono='none'
                        }
                    }
                }
                for(oo=0;oo<Banco.data.length;oo++){
                    if(parametro==='abono'){                        
                        if(Banco.data[oo].id===dat.id ){
                            Banco.data[oo].idmatchCargo=-1
                            Banco.data[oo].usedFlagCargo=false
                            Banco.data[oo].typeCargo='none'
                        }
                    }else{
                        if(Banco.data[oo].id===dat.id ){
                            //console.log('=>',Banco.data[oo],'idmatchAbono',Banco.data[oo].idmatchAbono)
                            Banco.data[oo].idmatchAbono=-1
                            Banco.data[oo].usedFlagAbono=false
                            Banco.data[oo].typeAbono='none'
                        }
                    }
                }
                this.setState({dataCaja:Caja})
                this.setState({dataBanco:Banco})
            }else{
                //console.log('opcion child selected opcion',opcion)
                const Bancos={...this.state.dataBanco}
                //Buscando el master
                for(var ww=0;ww<Bancos.data.length;ww++){
                    //console.log(dataBanco.data[w])
                    if(parametro==='abono'){
                        if(Bancos.data[ww].id===data.idmatchCargo){
                            //este es el master
                            //console.log('este es el master',Bancos.data[ww])
                            Bancos.data[ww].typeAbono='none'
                            Bancos.data[ww].usedFlagAbono=false
                        }
                    }else{
                        if(Bancos.data[ww].id===data.idmatchAbono){
                            //este es el master
                            //console.log('este es el master',Bancos.data[ww])
                            Bancos.data[ww].typeCargo='none'
                            Bancos.data[ww].usedFlagCargo=false
                        }
                    }
                    
                }
                //Buscar los hijos
                const Cajas={...this.state.dataCaja}
                for(var pp=0;pp<Cajas.data.length;pp++){
                    if(parametro==='abono'){
                        if(Cajas.data[pp].id!==dat.id && Cajas.data[pp].idmatchCargo===dat.idmatchCargo && Cajas.data[pp].usedFlagCargo===true){
                            Cajas.data[pp].idmatchCargo=-1
                            Cajas.data[pp].usedFlagCargo=false
                            Cajas.data[pp].typeCargo='none'
                        }
                    }else{
                        if(Cajas.data[pp].id!==dat.id && Cajas.data[pp].idmatchAbono===dat.idmatchAbono && Cajas.data[pp].usedFlagAbono===true){                            
                            Cajas.data[pp].idmatchAbono=-1
                            Cajas.data[pp].usedFlagAbono=false
                            Cajas.data[pp].typeAbono='none'
                        }
                    }
                }
                for(pp=0;pp<Cajas.data.length;pp++){
                    if(parametro==='abono'){
                        if(Cajas.data[pp].id===dat.id ){
                            Cajas.data[pp].idmatchCargo=-1
                            Cajas.data[pp].usedFlagCargo=false
                            Cajas.data[pp].typeCargo='none'
                        }
                    }else{
                        if(Cajas.data[pp].id===dat.id){                            
                            Cajas.data[pp].idmatchAbono=-1
                            Cajas.data[pp].usedFlagAbono=false
                            Cajas.data[pp].typeAbono='none'
                        }
                    }
                }
                this.setState({dataBanco:Bancos})
                this.setState({dataCaja:Cajas})
            }
        }
        

    }

    render(){
        const cuerpo=<tr>Cargando...</tr>;
        
        return(
            <React.Fragment>
                
                <div className="row">
                    <button className="botonInstruccion" onClick={()=>this.togglePopup()}>Instrucciones</button>
                </div>
                <div className="row">                
                    <a href={excelFile}><FaFileExcel size="26px" color="green"></FaFileExcel> Descagar plantilla excel</a>
                </div>
                <div className="row">
                    <div className="w-5"></div>
                    <div className="w-75">
                        
                <DragAndDrop  >
                    <div className="w-100 padding-20"  onClick={()=>this.fileInput.click()}>
                        <input
                            required
                            type="file"
                            className="w-100"
                            style={{display:'none'}} 
                            name="file"
                            id="file"
                            key="file"
                            onChange={(event)=>this.handleInputChange(event)}
                            ref={fileInput=>this.fileInput=fileInput}
                            placeholder="Archivo Excel"
                        />
                        {'Click para cargar Excel'}
                        
                    </div>
                </DragAndDrop>
              
                    </div>
                    <div className="w-10"></div>
                    <div className="w-10">
                        <Checkbox changeFlags={(a)=>this.toggleMultiCheckbox(a)} flags={(this.state.flagsCheckbox)}></Checkbox>
                    </div>
                </div>

                
                
                <div className="row separacion_20">
                    

                </div>

              

                <div className="row" >
                    <div className="w-45">
                    {
                    (this.state.showtable ?
                    <table index="Caja_" key='Caja' className="table table-center">
                    <thead>
                        <tr index={'Caja1_'} key={'Caja1'}>
                            <th colSpan="4">Libro Contable Empresa</th>
                        </tr>
                        
                        <tr index={'Caja2_'} key={'Caja2'}>
                            <th colSpan="1">Fecha</th>
                            <th colSpan="1">Cargo</th>
                            <th colSpan="1">Abono</th>
                            <th colSpan="1">Descripción</th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        {this.state.dataCaja.data.map((data)=>
                            {return(<React.Fragment>
                            <tr index={'Caja_'+data.id} key={'Caja'+data.id} onClick={(e)=>this.handleObjectChange(e,data,1)} >
                                <td className="text-izquierda">{data.fecha}</td>
                                <td className={data.usedFlagCargo===false?"":"tachado"}>{data.cargo}</td>
                                <td className={data.usedFlagAbono===false?"":"tachado"}>{data.abono}</td>
                                <td className="text-izquierda" >{data.descripcion}</td>
                                {/*data.usedFlag===false?null:<td>Ok</td>*/}
                                {data.usedFlagCargo===false?"":<AiOutlineCloseCircle className="icono-check" onClick={(e)=>this.restoreMatching(e,data,2,'abono')} size={'4vh'}></AiOutlineCloseCircle> } 
                                {data.usedFlagAbono===false?"":<AiOutlineCloseCircle className="icono-check" onClick={(e)=>this.restoreMatching(e,data,2,'cargo')} size={'4vh'}></AiOutlineCloseCircle> }                               
                            </tr>
                            {
                                data.showOptions?
                                (<React.Fragment>
                                <tr className="background-boton" index={'BotonCaja_'+data.id} key={'BotonCaja'+data.id}>
                                    <td></td>
                                    {data.usedFlagCargo===false?
                                    <td>{<button onClick={(e)=>this.procesarData(e,data,1,'cargo')} > Buscar</button>}</td>
                                    :
                                    <td>{<button onClick={(e)=>this.restoreMatching(e,data,2,'abono')} > Deshacer</button>}</td>
                                    }
                                    {data.usedFlagAbono===false?
                                    <td>{<button onClick={(e)=>this.procesarData(e,data,1,'abono')} > Buscar</button>}</td>
                                    :
                                    <td>{<button onClick={(e)=>this.restoreMatching(e,data,2,'cargo')} > Deshacer</button>}</td>
                                    }
                                    <td></td>
                                    {data.usedFlag===false?null:<td><AiOutlineCloseCircle size={'4vh'} onClick={()=>alert()}></AiOutlineCloseCircle></td>} 
                                </tr>
                                
                                {data.loadingcajadata===true?cuerpo:null}</React.Fragment>)
                                :null
                            }
                            </React.Fragment>);
                            }
                           
                            
                        )}

                    </tbody>
                </table>
                            
                    :null)
                    }
                    </div>
                    <div className="w-10"></div>
                    <div className="w-45">
                    {
                    (this.state.showtable?
                    <table id='Banco_' key='Banco' className="table table-center">
                    <thead>
                        <tr index={'Banco1_'} key={'Banco1'}>
                            <th colSpan="4">Estado de Cuenta - Extracto Bancario</th>
                        </tr>
                        
                        <tr index={'Banco2_'} key={'Banco2'}>
                            <th colSpan="1">Fecha</th>
                            <th colSpan="1">Cargo</th>
                            <th colSpan="1">Abono</th>
                            <th colSpan="1">Descripción</th>
                        </tr>
                        
                    </thead>
                    <tbody>
                    {this.state.dataBanco.data.map((data)=>
                            {return(<React.Fragment>
                            <tr index={'Banco_'+data.id} key={'Banco'+data.id} onClick={(e)=>this.handleObjectChange(e,data,2)} >                                 
                                <td className="text-izquierda">{data.fecha}</td>
                                <td className={data.usedFlagCargo===false?"":"tachado"}>{data.cargo}</td>
                                <td className={data.usedFlagAbono===false?"":"tachado"}>{data.abono}</td>
                                <td className="text-izquierda">{data.descripcion}</td>
                                {/*data.usedFlag===false?null:<td>Ok</td>*/}        
                                {data.usedFlagCargo===false?"":<AiOutlineCloseCircle className="icono-check" onClick={(e)=>this.restoreMatching(e,data,1,'abono')} size={'4vh'}></AiOutlineCloseCircle> } 
                                {data.usedFlagAbono===false?"":<AiOutlineCloseCircle className="icono-check" onClick={(e)=>this.restoreMatching(e,data,1,'cargo')} size={'4vh'}></AiOutlineCloseCircle> }                        
                            </tr>
                            {
                                data.showOptions?
                                <React.Fragment>
                                <tr index={'BotonBanco_'+data.id} key={'BotonBanco'+data.id} className="background-boton">
                                    <td></td>
                                    {data.usedFlagCargo===false?
                                    <td>{<button onClick={(e)=>this.procesarData(e,data,2,'cargo')} > Buscar</button>}</td>
                                    :
                                    <td>{<button onClick={(e)=>this.restoreMatching(e,data,1,'abono')} > Deshacer</button>}</td>
                                    }
                                    {data.usedFlagAbono===false?
                                    <td>{<button onClick={(e)=>this.procesarData(e,data,2,'abono')} > Buscar</button>}</td>
                                    :
                                    <td>{<button onClick={(e)=>this.restoreMatching(e,data,1,'cargo')} > Deshacer</button>}</td>
                                    }
                                    <td></td>
                                    {data.usedFlag===false?null:<td><AiOutlineCloseCircle size={'4vh'} onClick={()=>alert()}></AiOutlineCloseCircle></td>} 
                                </tr>
                                
                                {data.loadingbancodata===true?cuerpo:null}
                                </React.Fragment>
                                :null
                            }
                            </React.Fragment>);
                            }
                           
                            
                        )}

                    </tbody>
                </table>
                            
                    :null)
                    }

                    </div>
                </div>
                
                {this.state.showPopup ?  
                    <Popup  
                    contenido={this.dibujartabla()}
                    titulo={'Lea atentamente'}  
                    closePopup={this.togglePopup.bind(this)}  
                    />
                      
                    : null  
                }
                <div className="row">
                    <div className="col-4"></div>
                    <div className="col-4">
                    {
                        this.state.showPopupFloat?
                        <Popupflotante contenido={this.dibujarListaOpciones()}
                        position={this.state.positionPopup}
                        titulo={'Seleccione una opción'}  
                        closePopup={this.togglePopupFlotante.bind(this)} ></Popupflotante>
                        :null
                    }
                    </div>
                    <div className="col-4"></div>
                </div>

                
                

                
                
                
            </React.Fragment>

        );
    }

}
export default  XlsxUploaderV3;