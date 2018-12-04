import { Editor, EditorState } from 'draft-js';
import React from 'react';
import ReactDOM from 'react-dom';
import nullthrows from 'nullthrows';
import SlimEditor from '../components/slimEditor.js';

import simplifyLists from './simplifyLists';

import type { SerializedListType } from './sanitizeLists.js';

export default function convertDraftEditorStateToHTML(data) {
  let editorState = null;
  if (data !== null && typeof data === 'object') {
    if (data instanceof EditorState) {
      editorState = data;
    } else {
      editorState = convertFromRaw(data);
    }
  }

  const el = document.createElement('div');
  const editor = <SlimEditor editorState={editorState} />;
  ReactDOM.render(editor, el);
  const html = simplifyLists(el);
  ReactDOM.unmountComponentAtNode(el);
  return html;
}