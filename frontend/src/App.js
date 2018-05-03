import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';

const BACKEND = 'http://127.0.0.1:8000'

class TopBasic extends Component {
  render() {
    return (
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">WEB APPLICATION FOR ENGLISH TO CHINESE NMT</h1>
      </header>
    );
  }
}

class BottomBasic extends Component {
  render() {
    return (
      <div className="App-intro">
        <p>Team member:<span>Chong Han</span>, <span>Yingbing Wang</span>, <span>Yunzhe Chen</span></p>
        <p>Made by: React + Django</p>
      </div>
    );
  }
}

class GoogleTranslated extends Component {
  constructor(props) {
    super(props);
    this.state = {translated: null}
  }
  translate(props) {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh&dt=t&q=' + encodeURIComponent(props.source_text);
    fetch(url).then(data => data.json()).then(data => this.setState({translated: data[0][0][0]}));
  }

  render() {
    this.translate(this.props);
    return (
      <p>{this.state.translated}</p>
    );
  }
}

class Loading extends Component {
  render() {
    return (
      <div>
        <div class="loadEffect">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="loading">
          <p>Translating...</p>
        </div>
      </div>
    );
  }
}

class SourceText extends Component {
  constructor(props) {
    super(props);
    const textarea_value = "Please write a source text from English."
    this.state = {
      words_left: props.max_words - textarea_value.split(" ").length,
      textarea_value: textarea_value,
      select_value: "bahdanau",
      maximum_class: "maximum-normal",
      loading_state: "before",
      data: {},
      again: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleAgain = this.toggleAgain.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    if (event.target.type === "textarea") {
      if (this.state.words_left <= 0 && this.state.maximum_class === "maximum-normal") {
        this.setState({
          maximum_class: "maximum-warning"
        });
      } else if (this.state.maximum_class === "maximum-warning" && this.state.words_left >= 0) {
        this.setState({
          maximum_class: "maximum-normal"
        });
      }
      this.setState({
        textarea_value: value,
        words_left: this.props.max_words - value.trim().split(" ").length
      });
    } else {
      this.setState({
        select_value: value,
      });
    }
  }

  toggleAgain() {
    this.setState({again: !this.state.again})
  }

  handleSubmit(event) {
    if (this.state.maximum_class === "maximum-warning") {
      alert("You could not sned a source text more than 50 words in current version!");
    } else {
      this.setState({loading_state: "during"});
      fetch(BACKEND + '/nmt/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          attention: this.state.select_value,
          source_text: this.state.textarea_value.trim(),
        })
      }).then(
        data => data.json()
      ).then(data => {
        this.setState({
          loading_state: "after",
          data: data
        });
      });
      this.toggleAgain()
    }
    event.preventDefault();
  }

  render() {
    if (this.state.loading_state === "during") {
      return (<Loading />);
    } else if (this.state.loading_state === "before" || this.state.again) {
      return (
        <form onSubmit={this.handleSubmit}>
          <h1 className="h1">Source Text in English:<br /></h1>
          <div>
            <h3 className="h3">Attention:</h3>
            <div className="select">
              <select value={this.state.select_value} onChange={this.handleChange} id="slct">
                 <option value="bahdanau">Bahdanau</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <textarea  value={this.state.textarea_value} onChange={this.handleChange} className="textarea"  /><br />
            <div className="counter">
              <p className={this.state.maximum_class}>Words Left: {this.state.words_left}</p>
            </div>
            <input type="submit" value="Submit" className='fsSubmitButton' />
          </div>
        </form>
      );
    } else if (this.state.loading_state === "after") {
      return (
        <div className='textareaAfter' >
          <h2>Source Text:</h2>
          <p>{this.state.data.source_text}</p>
          <h2>NMT Translated:</h2>
          <p>{this.state.data.nmt_text}</p>
          <h2>Google Translated:</h2>
          <GoogleTranslated source_text={this.state.data.source_text} />
          <input type="submit" value="Continue Translation" onClick={this.toggleAgain} className='fsSubmitButtonContinue' />
        </div>
      );
    } else {
      return (<div>Strange thing happened</div>)
    }
  }
}

class App extends Component {
  render() {
    return (
        <div className="App">
          <div className="App-header">
            <TopBasic />
          </div>
          <div className="wrapper">
            <SourceText max_words="50" />
          </div>
          <BottomBasic/>
        </div>
    )
  }
}

export default App;
