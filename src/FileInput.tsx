import React, { Component } from 'react';
interface FileInputProps {
  callback: Function;
}
export default class FileInput extends Component {
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
      this.props.callback(this.fileInput.current.files);
    }
  };
  render() {
    return (
      <div>
        <label htmlFor="audio-file">Input audio file:</label>
        <input ref={this.fileInput} id="audio-file" name="audio" multiple type="file" />
        <button onClick={this.handleSubmit}>Add File Tracks</button>
      </div>
    );
  }
};
