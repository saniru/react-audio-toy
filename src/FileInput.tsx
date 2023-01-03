import React, { Component } from 'react';
interface FileInputProps {
  getFile: Function;
}
export class FileInput extends Component {
  fileInput: React.RefObject<HTMLInputElement>;
  declare props: FileInputProps;
  constructor(props: FileInputProps) {
    super(props);
    this.state = {
    };
    this.fileInput = React.createRef();
  }
  handleSubmit = () => {
    if (this.fileInput.current) {
      this.props.getFile(this.fileInput.current.files);
    }
  };
  render() {
    return (
      <div>
        <label htmlFor="audio">Input audio file:</label>
        <input ref={this.fileInput} id="audiofile" name="audio" multiple type="file" />
        <button onClick={this.handleSubmit}></button>
      </div>
    );
  }
}

export default FileInput;