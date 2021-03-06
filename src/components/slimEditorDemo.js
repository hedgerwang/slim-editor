// @flow
import DocsConfig from '../editor_configuration/DocsConfig.js';
import DocsDecorator from '../editor_configuration/DocsDecorator.js';
import SlimEditor from './slimEditor.js';

import { default as uniqueID } from '../utils/uniqueID.js';
import convertDraftEditorStateToHTML from '../utils/convertDraftEditorStateToHTML.js';
import convertFromRaw from '../utils/convertFromRaw.js';
import convertToRaw from '../utils/convertToRaw.js';
import noop from '../utils/noop.js';

import '../styles/slimEditorPage.css';

import { ButtonGroup, Button } from 'react-bootstrap';
import { Editor, EditorState } from 'draft-js';
import React from 'react';

const LOCAL_STORAGE_KEY = 'slim-editor-examples';

DocsConfig.init();

function getInitialState() {
  let editorState = EditorState.createEmpty(DocsDecorator.get());
  let debugValue = '';
  try {
    debugValue = window.localStorage.getItem(LOCAL_STORAGE_KEY) || '';
    if (/^\{/.test(debugValue)) {
      const raw = JSON.parse(debugValue);
      editorState = convertFromRaw(raw);
    }
  } catch (ex) {
    editorState = {};
  }
  return {
    debugKey: uniqueID(),
    editorState,
    initialEditorState: editorState,
    debugValue,
    debugMode: /debug_mode=1/.test(document.cookie),
  };
}

type State = {
  debugMode: boolean,
  debugValue: string,
  debugKey: string,
  editorState: EditorState,
  initialEditorState: EditorState,
};
export default class SlimEditorDemo extends React.Component {
  state: State;

  _dropping = false;

  constructor(props: any) {
    super(props);
    this.state = getInitialState();
  }

  render() {
    const {
      debugMode, debugValue, debugKey, editorState,
    } = this.state;

    return (
      <div className="react-root">
        <div className="grid-container">
          <div className="slim-editor">
            <p>
              <strong>Slim Editor HTML</strong>
            </p>
            <textarea value={convertDraftEditorStateToHTML(editorState)} />
          </div>
          <div className="debug-tool">
            <div>
              <ButtonGroup>
                <Button onClick={this._save} bsStyle="primary">
                  Save
                </Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button onClick={this._dump}>Dump</Button>
                <Button onClick={this._clear}>Clear</Button>
              </ButtonGroup>
              <ButtonGroup>
                <Button onClick={this._importJSON}>Import JSON</Button>
                <Button onClick={this._reset}>Reset</Button>
              </ButtonGroup>
              <label className="checkbox">
                <input type="checkbox" checked={debugMode} onChange={this._toggleDebugMode} />
                debug mode
              </label>
            </div>
            <textarea
              className="debug-text-area"
              defaultValue={debugValue}
              id={debugKey}
              key={debugKey}
            />
          </div>
        </div>
      </div>
    );
  }

  applyJSON = (raw: Object): void => {
    const { editorState, debugMode } = this.state;
    this.setState({
      debugValue: debugMode ? JSON.stringify(raw, null, 2) : '',
      editorState: convertFromRaw(raw, editorState),
    });
  };

  _importJSON = (): void => {
    const { debugKey } = this.state;
    const el: any = document.getElementById(debugKey);
    if (el) {
      try {
        const json = el.value.trim();
        const raw = JSON.parse(json);
        this.applyJSON(raw);
      } catch (ex) {
        el.value = ex.message;
      }
    }
  };

  _reset = (): void => {
    const { initialEditorState } = this.state;
    this.setState({
      editorState: initialEditorState,
    });
  };

  _dump = (callback?: ?Function): void => {
    const { editorState } = this.state;
    const raw = convertToRaw(editorState);
    const debugValue = JSON.stringify(raw, null, 2);
    const fn = typeof callback === 'function' ? callback : noop;
    this.setState(
      {
        debugValue,
        debugKey: uniqueID(),
      },
      fn,
    );
  };

  _save = (): void => {
    const { debugKey } = this.state;
    const el: any = document.getElementById(debugKey);
    if (el) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, el.value);
    }
  };

  _clear = (): void => {
    const { debugKey } = this.state;
    const el: any = document.getElementById(debugKey);
    if (el) {
      el.value = '';
    }
    this.setState({ debugValue: '', debugKey: uniqueID() });
    window.localStorage.clear();
  };

  _toggleDebugMode = () => {
    const debugMode = !this.state.debugMode;
    this.setState({
      debugMode,
    });
    document.cookie = `debug_mode=${debugMode ? 1 : ''}`;
  };
}
