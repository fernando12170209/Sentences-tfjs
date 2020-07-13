import React, { Component } from 'react'
import DragAndDrop from './DragAndDrop'
class FileList extends Component {
    state = {
        files: [
            'Arrastra aqui tu archivo'

        //'Coquito ABC.pdf',
        ]
    }
    handleDrop = (files) => {
        let fileList = this.state.files
        for (var i = 0; i < files.length; i++) {
        if (!files[i].name) return
        fileList.push(files[i].name)
        }
        this.setState({files: fileList})
    }
    render() {
        return (
        <DragAndDrop handleDrop={this.handleDrop}>
            <div style={{height: 20, width: 250}}>
            {this.state.files.map((file) =>
                <div key={file.i}>{file}</div>
            )}
            </div>
        </DragAndDrop>
        )
  }
}
export default FileList