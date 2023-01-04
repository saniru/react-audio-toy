import { Component } from 'react';
interface URLInputState {
  input: string;
}
interface URLInputProps {
  callback: Function;
}
export default class URLInput extends Component {
  state: URLInputState;
  declare props: URLInputProps;
  constructor(props: URLInputProps) {
    super(props);
    this.state = {
      input: ""
    };
  }
  render() {
    return (
      <div>
        <label htmlFor="audio-url">URL:</label>
        <input onChange={e => this.setState({ input: e.target.value })} id="audio-url" name="audio-url" type="text" value={this.state.input} />
        <button onClick={() => this.props.callback(this.state.input)}></button>
      </div>
    );
  }
};
