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
  render() {
    return (
      <div>
        <h2>Google Translated:</h2>
        <p dangerouslySetInnerHTML={{__html:
        this.props.translated}}></p>
      </div>
    );
  }
}

class NMTTranslated extends Component {
  render() {
    return (
      <div>
        <h2>NMT Translated:</h2>
        <p dangerouslySetInnerHTML={{__html:
        this.props.nmt_text}}></p>
        <p><b>Google to English: </b>{this.props.translate_again}</p>
      </div>
    );
  }
}

class Loading extends Component {
  render() {
    return (
      <div>
        <div className="loadEffect">
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
      translated: undefined,
      google_text: undefined,
      nmt: undefined,
      translate_again: undefined
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleAgain = this.toggleAgain.bind(this)
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

  handleSubmit(event) {
    if (this.state.maximum_class === "maximum-warning") {
      alert("You could not sned a source text more than 80 words in current version!");
    } else {
      this.setState({loading_state: "during"});
      Promise.all([this.getNMT(), this.translate()]).then(
        res => this.translate_again()
      ).then(
        res => this.redCommonText()
      ).then(
        res => {
          this.toggleAgain();
          this.setState({loading_state: "after"})
        }
      );
    }
  }

  getNMT() {
    return fetch(BACKEND + '/nmt/', {
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
        data: data
      });
    })
  }

  translate() {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh&dt=t&q='
                  + encodeURIComponent(this.state.textarea_value.trim());
    return fetch(url).then(data => data.json()).then(data => this.setState({google_text: data[0][0][0]}));
  }

  translate_again() {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh&tl=en&dt=t&q='
                  + encodeURIComponent(this.state.data.nmt_text.trim());
    return fetch(url).then(data => data.json()).then(data => this.setState({translate_again: data[0][0][0]}));
  }

  toggleAgain() {
    this.setState({again: !this.state.again})
  }

  redCommonText() {
    const nmt_array = this.state.data.nmt_text.replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g,"").split("")
    const google_array = this.state.google_text.replace(/[^0-9a-zA-Z\u4e00-\u9fa5]/g,"").split("")
    const nmt = this.state.data.nmt_text.split("")
    const google = this.state.google_text.split("")
    const common_set = new Set(google_array.slice().filter(word => nmt_array.indexOf(word) != -1))
    for (let i = 0; i < nmt.length; i++) {
      if (common_set.has(nmt[i])) {
        nmt[i] = "<span class='red'>"+nmt[i]+"</span>"
      }
    }
    for (let i = 0; i < google.length; i++) {
      if (common_set.has(google[i])) {
        google[i] = "<span class='red'>"+google[i]+"</span>"
      }
    }
    this.setState({
      nmt: nmt.join(""),
      translated: google.join("")
    })
  }

  render() {
    if (this.state.loading_state === "during") {
      return (<Loading />);
    } else if (this.state.loading_state === "before" || this.state.again) {
      return (
        <div>
        <form onSubmit={this.handleSubmit}>
          <h1 className="h1">Source Text in English:<br /></h1>
          <div>
            <h3 className="h3">Model:</h3>
            <div className="select">
              <select value={this.state.select_value} onChange={this.handleChange} id="slct">
                <option value="naive">Naive</option>
                <option value="luong">Luong</option>
                <option value="luong_deeper">Luong Deeper</option>
                <option value="bahdanau">Bahdanau</option>
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
        <BottomBasic/>
        </div>
      );
    } else if (this.state.loading_state === "after") {
      return (
        <div className='textareaAfter' >
          <h2>Source Text:</h2>
          <p>{this.state.data.source_text}</p>
          <NMTTranslated nmt_text={this.state.nmt} translate_again={this.state.translate_again} />
          <GoogleTranslated translated={this.state.translated} />
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
            <SourceText max_words="80" />
          </div>
        </div>
    )
  }
}

export default App;
