'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = convertDraftEditorStateToHTML;

var _draftJs = require('draft-js');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _slimEditor = require('../components/slimEditor.js');

var _slimEditor2 = _interopRequireDefault(_slimEditor);

var _simplifyLists = require('./simplifyLists.js');

var _simplifyLists2 = _interopRequireDefault(_simplifyLists);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertDraftEditorStateToHTML(data) {
  var editorState = null;
  if (data !== null && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    if (data instanceof _draftJs.EditorState) {
      editorState = data;
    } else {
      editorState = convertFromRaw(data);
    }
  }

  if (!editorState) {
    return '<div>' + JSON.stringify(data || '') + '</div>';
  }

  var el = document.createElement('div');
  var editor = _react2.default.createElement(_slimEditor2.default, { editorState: editorState });
  _reactDom2.default.render(editor, el);
  var html = (0, _simplifyLists2.default)(el);
  _reactDom2.default.unmountComponentAtNode(el);
  return html;
}