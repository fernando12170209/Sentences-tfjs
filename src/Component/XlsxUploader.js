import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import './Table.css';
import Popup from './Popup/Popup'
import Popupflotante from './Popup/Popup_flotante'


//Para determinar que grupo de valores suman X
import SubsetSum from './SumSubset';

//Icons
import { AiOutlineCloseCircle } from "react-icons/ai";
class XlsxUploader extends Component {
    state={
        opcion:0,
        showPopup:false,
        showPopupFloat:false,

        showOptions:false,
        showtable:false,
        dataBanco:{
            data:[{id:1,fecha:"",cargo:"",abono:"",descripcion:"",showOptions:false,loadingbancodata:false,selected:false,usedFlag:false,usedFlagAbono:false,usedFlagCargo:false,idmatch:0,idmatchAbono:0,idmatchCargo:0}],
        },
        dataCaja:{
            data:[{id:1,fecha:"",cargo:"",abono:"",descripcion:"",showOptions:false,loadingcajadata:false,selected:false,usedFlag:false,usedFlagAbono:false,usedFlagCargo:false,idmatch:0,idmatchAbono:0,idmatchCargo:0}],
        },

        idCajaSelect:0,
        idBancoSelect:0,
        listOptions:{
            flag:false,
            optionSelected:1,//1:Caja 2:Banco
            listdata:[{id:1,fecha:"",cargo:"",abono:"",descripcion:"",showOptions:false,loadingcajadata:false,selected:false,usedFlag:false,usedFlagAbono:false,usedFlagCargo:false,idmatch:0,idmatchAbono:0,idmatchCargo:0}],
        },
        positionPopup:'right' //Popup show 'right': when caja is clicked ELSE 'left'
        
    }
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
                    idmatch:0,
                    idmatchAbono:0,
                    idmatchCargo:0,
                    usedFlag:false,
                    usedFlagCargo:false,
                    usedFlagAbono:false
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
                    idmatch:0,
                    idmatchAbono:0,
                    idmatchCargo:0,
                    usedFlag:false,
                    usedFlagCargo:false,
                    usedFlagAbono:false
                }
                Banco2.data.push(temp)
                Banco.fecha.push(dataParse2[j][0])
                Banco.cargo.push(dataParse2[j][1])
                Banco.abono.push(dataParse2[j][2])
                Banco.descripcion.push(dataParse2[j][3])
            }

            console.log('Caja',Caja)
            

            console.log('Banco',Banco)
            

            //Secion similar al App.js
            const inputByUser=Caja.abono
            var arrayFlag=[]
            arrayFlag.length=inputByUser.length
            console.log('arrayFlag',arrayFlag)
            
            const proposedSum=590
            console.log('proposedSum',proposedSum)
            const resultado= SubsetSum(inputByUser,arrayFlag,proposedSum)
            console.log('resultadoexcel',resultado)

           



            
            
            //setFileUploaded(dataParse);
        };
        reader.readAsBinaryString(f)

        reader.onloadend=()=>{
            this.saveDataHandler(Caja2,Banco2)
        }
        

            

        
        
    }
    
    handleObjectChange(e,data,opcion ){
        //opcion=1 Caja , opcion=2 Banco

        this.setState({opcion:opcion})
        console.log('data selecionada en fila',data)

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
            console.log(input.data[j].showOptions)
            input.data[j].showOptions=input.data[j].showOptions===false?true:false//!(childData.showData);
            this.setState({dataCaja:input})
        }else{
            this.setState({idBancoSelect:data.id})

            const inputsUpdated = {...this.state.dataBanco}
            console.log(inputsUpdated.data[j].showOptions)
            inputsUpdated.data[j].showOptions=inputsUpdated.data[j].showOptions===false?true:false//!(childData.showData);
            this.setState({dataBanco:inputsUpdated})

        }
        
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
    togglePopupFlotante() {  
        //Cerrar PopUp
        this.setState({  
             showPopupFloat: !this.state.showPopupFloat  
        });  
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
    
    async procesarData(e,data,opcion,tipo){

        
        e.preventDefault()
        
        
        //opcion=1 Caja , opcion=2 Banco
        //tipo="cargo" tipo="abono" 
        //Mientas se procesa mostrar mensaje de espera
        this.loadingdata(opcion,data)
        
        var inputByUser=[]
        var arrayFlag=[]
        //CAJA
        if(opcion*1===1){
            
            if(tipo==='cargo'){
                
                for(var i=0;i<this.state.dataBanco.data.length;i++ ){
                    if(this.state.dataBanco.data[i].usedFlag===false){
                        inputByUser.push(this.state.dataBanco.data[i].abono)
                    }
                    
                }                
                //var arrayFlag=[0,0,0,0,0,0,0,0,0,0]
                //Define un array de valores de tamaño igual a inputByUser
                
                arrayFlag.length=inputByUser.length
                //inicializamos 'arrayFlag' con 0: no se considera y 1 se considera
                arrayFlag.fill(0)                              
                const proposedSum=data.cargo                
                const resultado= await SubsetSum(inputByUser,arrayFlag,proposedSum).then(this.loadingdata(opcion,data))
                //console.log('resultado',resultado)
                
                this.returnListSolutions(resultado,1)
                

            }else{
                //this.setState({loadingcajadata:true})
                for(var j=0;j<this.state.dataBanco.data.length;j++ ){
                    if(this.state.dataBanco.data[j].usedFlag===false){
                        inputByUser.push(this.state.dataBanco.data[j].cargo)
                    }
                    
                }                
                //var arrayFlag=[0,0,0,0,0,0,0,0,0,0]
                //Define un array de valores de tamaño igual a inputByUser
                
                arrayFlag.length=inputByUser.length
                //inicializamos 'arrayFlag' con 0: no se considera y 1 se considera
                arrayFlag.fill(0)                              
                const proposedSum=data.abono
                const resultado= await SubsetSum(inputByUser,arrayFlag,proposedSum).then(this.loadingdata(opcion,data))
                //console.log('resultado',resultado)
                
                this.returnListSolutions(resultado,1)

            }

            
        }else{
            //BANCO
            
            if(tipo==='cargo'){
                for(var m=0;m<this.state.dataCaja.data.length;m++ ){
                    if(this.state.dataCaja.data[m].usedFlag===false){
                        inputByUser.push(this.state.dataCaja.data[m].abono)
                    }
                    
                }                
                //var arrayFlag=[0,0,0,0,0,0,0,0,0,0]
                //Define un array de valores de tamaño igual a inputByUser
                //Arrayflag=new Array(inputByUser.length)
                arrayFlag.length=inputByUser.length
                //inicializamos 'arrayFlag' con 0: no se considera y 1 se considera
                arrayFlag.fill(0)                
                const proposedSum=data.cargo                
                const resultado= await SubsetSum(inputByUser,arrayFlag,proposedSum).then(this.loadingdata(opcion,data))
                //console.log('resultado',resultado)
                
                this.returnListSolutions(resultado,2)

            }else{
                //this.setState({loadingbancodata:true})

                for(var n=0;n<this.state.dataCaja.data.length;n++ ){
                    if(this.state.dataCaja.data[n].usedFlag===false){
                        inputByUser.push(this.state.dataCaja.data[n].cargo)
                    }
                    
                }                
                //var arrayFlag=[0,0,0,0,0,0,0,0,0,0]
                //Define un array de valores de tamaño igual a inputByUser
                
                arrayFlag.length=inputByUser.length
                //inicializamos 'arrayFlag' con 0: no se considera y 1 se considera
                arrayFlag.fill(0)            
                const proposedSum=data.abono
                console.log('inputByUser',inputByUser)
                const resultado= await SubsetSum(inputByUser,arrayFlag,proposedSum).then(this.loadingdata(opcion,data))
                //console.log('resultado',resultado)
                
                this.returnListSolutions(resultado,2)
            }
        }

        

        //this.setState({showPopupFloat:false})

    }
    returnListSolutions(resultado,opcion){
        //opcion=1 Caja , opcion=2 Banco
        if(opcion===1){
            if(resultado.length>0){
                //Hay Resultados
                //iterar entre la lista de opciones
                //const dataBancotemp={...this.state.dataBanco}
                var dataBancotempOptions=[]
                const dataBancotempData= {...this.state.dataBanco.data.filter(a=>a.usedFlag===false)}
                for(var opt=0;opt<resultado.length;opt++){
                    //Iterar entre la posiciones de la opcion
                    //console.log(resultado[opt])
                    var result=[]
                    for( var pos=0;pos<resultado[opt].length;pos++){
                        //console.log(opt)
                        if(resultado[opt][pos]===1){
                            dataBancotempData[pos].selected=true
                            //console.log(dataBancotempData[pos])
                            result.push(dataBancotempData[pos])
                        }
                    }
                    dataBancotempOptions.push(result)
                }
                console.log(dataBancotempOptions)

                const listOptions={...this.state.listOptions}
                listOptions.flag=true
                listOptions.listdata=dataBancotempOptions
                listOptions.optionSelected=opcion
                this.setState({listOptions:listOptions})
                this.setState({showPopupFloat:true})
                this.setState({positionPopup:'left'})

                console.log('listOptions',listOptions)
                
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
                const dataCajatempData= {...this.state.dataCaja.data.filter(b=>b.usedFlag===false)}
                for(var opts=0;opts<resultado.length;opts++){
                    //Iterar entre la posiciones de la opcion
                    //console.log(resultado[opt])
                    var results=[]
                    for( var poss=0;poss<resultado[opts].length;poss++){
                        //console.log(opt)
                        if(resultado[opts][poss]===1){
                            dataCajatempData[poss].selected=true
                            //console.log(dataBancotempData[pos])
                            results.push(dataCajatempData[poss])
                        }
                    }
                    dataCajatempOptions.push(results)
                }
                console.log(dataCajatempOptions)
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

    dibujartabla(){
        //opcion=1 Caja , opcion=2 Banco
        
        return(
        <React.Fragment>
            {
                this.state.index*1===1?
                <div className="row">
                    <div className="col-4">
                        <button onClick={(e)=>{this.procesarData(e,this.state.dataCaja)}}>Procesar Cargo</button>
                    </div>
                    <div className="col-4"></div>
                    <div className="col-4">
                        <button onClick={(e)=>{this.procesarData(e,this.state.dataCaja)}}>Procesar Abono</button>
                    </div>
                </div>
                :
                <div className="row">
                    <div className="col-4">
                        <button onClick={(e)=>{this.procesarData(e,this.state.dataBanco)}}>Procesar Cargo</button>
                    </div>
                    <div className="col-4"></div>
                    <div className="col-4">
                        <button onClick={(e)=>{this.procesarData(e,this.state.dataBanco)}}>Procesar Abono</button>
                    </div>
                </div>
                

            }
            <div className="row">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>

                </table>

            </div>
        </React.Fragment>
        
        )
    }
    dibujarListaOpciones(){
        const optionSelected={...this.state.listOptions.optionSelected}
        console.log('optionSelected',optionSelected)
        return(
        <React.Fragment>
            <p>{'Se encontraron ' +this.state.listOptions.listdata.length +' grupos de opciones'}</p>
            <table index="Caja_" key='Caja' className="table table-center">
                    <thead>
                        <tr index={'Caja1_'} key={'Caja1'}>
                            <th colSpan="4">Caja</th>
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
                            <tr >
                                <td colSpan={4}>{'Se tiene un grupo con '+con.length + ' items'}</td>
                            </tr>
                            {
                                con.map(c=>{
                                    return(
                                    <tr className="ct_nivel2" onClick={(e)=>this.handleObjectListChange(e,con,optionSelected)}>
                                        <td>{c.fecha}</td>
                                        <td>{c.cargo}</td>
                                        <td>{c.abono}</td>
                                        <td>{c.descripcion}</td>
                                    </tr>
                                    )
                                })
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
    handleObjectListChange(e,data,opcion){
        this.setState({showPopupFloat:false})
        //opcion:1 Caja  opcion:2 Banco
        
        if(this.state.listOptions.optionSelected===1){
            console.log('idCajaSelect',this.state.idCajaSelect)
            //EN bucle cambiar usedFlag=1 de la lista Banco
            const dataBanco={...this.state.dataBanco}
            for(const dat of data){
                console.log(dat)
                console.log(dat.id)
                for(var j=0; j<dataBanco.data.length;j++){
                    if(dataBanco.data[j].id*1===dat.id*1){
                        dataBanco.data[j].usedFlag=true
                        dataBanco.data[j].idmatch=this.state.idCajaSelect*1
                    }
                    

                }
            }
            this.setState({dataBanco:dataBanco})
            //Cambiar usedFlag=1 de la lista Caja segun id===idCajaSelect
            const dataCaja={...this.state.dataCaja}
            for(var m=0;m<dataCaja.data.length;m++){
                if(dataCaja.data[m].id===this.state.idCajaSelect){
                    dataCaja.data[m].usedFlag=true
                }
            }
            this.setState({dataCaja:dataCaja})

        }else{
            console.log('idBancoSelect',this.state.idBancoSelect)
            //EN bucle cambiar usedFlag=1 de la lista Caja
            const dataCajas={...this.state.dataCaja}
            for(const dat of data){
                console.log(dat)
                console.log(dat.id)
                for(var i=0; i<dataCajas.data.length;i++){
                    if(dataCajas.data[i].id===dat.id){
                        dataCajas.data[i].usedFlag=true
                        dataCajas.data[i].idmatch=this.state.idBancoSelect*1
                    }
                    

                }
            }
            this.setState({dataCaja:dataCajas})

            //Cambiar usedFlag=1 de la lista Caja segun id===idBancoSelect
            const dataBancos={...this.state.dataBanco}
            for(var n=0;n<dataBancos.data.length;n++){
                if(dataBancos.data[n].id===this.state.idBancoSelect){
                    dataBancos.data[n].usedFlag=true
                }
            }
            this.setState({dataBanco:dataBancos})
        }
        
        //alert()

    }
    render(){
        const cuerpo=<tr>Cargando...</tr>;
        
        return(
            <React.Fragment>
                
                <input
                required
                type="file"
                name="file"
                id="file"
                key="file"
                onChange={(event)=>this.handleInputChange(event)}
                placeholder="Archivo Excel"
                /> 

                <div className="row separacion_20">
                    

                </div>

              

                <div className="row" >
                    <div className="w-45">
                    {
                    (this.state.showtable ?
                    <table index="Caja_" key='Caja' className="table table-center">
                    <thead>
                        <tr index={'Caja1_'} key={'Caja1'}>
                            <th colSpan="4">Caja</th>
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
                                <td></td>
                                <td className={data.usedFlag===false?"":"tachado"}>{data.cargo}</td>
                                <td className={data.usedFlag===false?"":"tachado"}>{data.abono}</td>
                                <td>{data.descripcion}</td>
                                {data.usedFlag===false?null:<td>Ok</td>}                               
                            </tr>
                            {
                                data.showOptions?
                                (<React.Fragment>
                                <tr className="background-boton" index={'BotonCaja_'+data.id} key={'BotonCaja'+data.id}>
                                    <td></td>
                                    <td>{<button onClick={(e)=>this.procesarData(e,data,1,'cargo')} > Buscar</button>}</td>
                                    <td>{<button onClick={(e)=>this.procesarData(e,data,1,'abono')} > Buscar</button>}</td>
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
                            <th colSpan="4">Banco</th>
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
                                <td></td>
                                <td className={data.usedFlag===false?"":"tachado"}>{data.cargo}</td>
                                <td className={data.usedFlag===false?"":"tachado"}>{data.abono}</td>
                                <td>{data.descripcion}</td>
                                {data.usedFlag===false?null:<td>Ok</td>}                                
                            </tr>
                            {
                                data.showOptions?
                                <React.Fragment>
                                <tr index={'BotonBanco_'+data.id} key={'BotonBanco'+data.id} className="background-boton">
                                    <td></td>
                                    <td>{<button onClick={(e)=>this.procesarData(e,data,2,'cargo')} > Buscar</button>}</td>
                                    <td>{<button onClick={(e)=>this.procesarData(e,data,2,'abono')} > Buscar</button>}</td>
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
                    titulo={'Seleccione opción'}  
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
export default  XlsxUploader;