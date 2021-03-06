import React, { Component } from 'react';

import { CSVReader } from 'react-papaparse';

class CvsUploader extends Component {
    handleOnDrop = (data) => {
        console.log('---------------------------')
        console.log(data)
        console.log('---------------------------')
      }
    
      handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
      }
    
      handleOnRemoveFile = (data) => {
        console.log('---------------------------')
        console.log(data)
        console.log('---------------------------')
      }
    
      render() {
        return (
          <CSVReader
            onDrop={this.handleOnDrop}
            onError={this.handleOnError}
            addRemoveButton
            onRemoveFile={this.handleOnRemoveFile}
          >
            <span>Drop CSV file here or click to upload.</span>
          </CSVReader>
        )
      }
    }
export default CvsUploader;
