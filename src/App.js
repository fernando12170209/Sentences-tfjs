import React from 'react';
//import logo from './logo.svg';
import './App.css';

import CvsUploader from './Component/CvsUploader';
//import XlsxUploader from './Component/XlsxUploader';

//import FileList from './Component/FileList';
import FileListMain from './Component/DragAndDrop/FileListMain';
import XlsxUploaderV3 from './Component/XlsxUploaderV3';
import TfIdf from './Component/Tf_Idf/Tf_Idf'


//import SubsetSum from './Component/SumSubset';

function App() {
  /*
  const inputByUser=[2,10,15,11,7,5,9,13,8,20]
  //var arrayFlag=[0,0,0,0,0,0,0,0,0,0]
  //Define un array de valores de tamaño igual a inputByUser
  var arrayFlag=[]
  arrayFlag.length=inputByUser.length
  console.log('arrayFlag',arrayFlag)
  
  const proposedSum=50
  console.log('proposedSum',proposedSum)

  
  const resultado= SubsetSum(inputByUser,arrayFlag,proposedSum)
  //Ojo puede devolver undefined en algunos indices dado que el array arrayFlag se creo vacio
  console.log('resultado',resultado)

  */
  return (
    <div className="App">
      {/*
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      */
      }
      <TfIdf></TfIdf>
      {/*<CvsUploader className="row"></CvsUploader>
      <FileListMain className="row"></FileListMain>*/}
      
      <div className="row">
        
        <XlsxUploaderV3 ></XlsxUploaderV3>
       
       
        
      </div>
      
      
    </div>
  );
}

export default App;
