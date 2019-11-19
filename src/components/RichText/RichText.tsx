import React, { Component } from 'react';
import Quill from 'quill';
import _ from 'lodash';
import classNames from 'classnames';
import styles from './RichText.module.scss';

const Delta = Quill.import('delta');
const Link = Quill.import('formats/link');

// https://github.com/quilljs/quill/issues/1966#issuecomment-528317638
class ClickableLink extends Link {
  public static create(value: string): ClickableLink {
    const node = super.create(value);
    node.setAttribute('href', Link.sanitize(value));
    node.setAttribute('target', '_blank');
    node.setAttribute('contenteditable', 'false');

    return node;
  }
}

Quill.register('formats/link', ClickableLink, true);

interface RichTextProps {
  readOnly?: boolean;
  onChange?: Function;
  onEnter?: Function;
  content?: any;
  placeholder?: string;
  className?: string;
  lastUpdate?: Date;
}

interface RichTextState {
  id: string;
  lastLoad: Date;
  quill?: any;
}

export function getDelta(rawContent = '') {
  let delta;

  try {
    const deltaOps = JSON.parse(rawContent);
    delta = new Delta(deltaOps);
  } catch (error) {
    delta = new Delta().insert(rawContent);
  }

  return delta;
}

export function getShouldTruncate(content: any) {
  const delta = getDelta(content);
  const deltaString = JSON.stringify(delta);
  const numberNewline = _.size(_.split(deltaString, /\\n/g));

  return delta.length() > 1300 || numberNewline > 20;
}

class RichText extends Component<RichTextProps> {
  state: RichTextState = {
    id: `id_${_.random(10000000)}`,
    quill: undefined,
    lastLoad: new Date(),
  };

  componentDidMount() {
    const { readOnly, onChange, onEnter, placeholder } = this.props;
    const { id } = this.state;
    const getContents = () => {
      const isEmpty = _.isEmpty(_.trim(quill.getText()));
      return isEmpty ? '' : quill.getContents();
    };
    const enterKey = 13;

    const quill = new Quill(`#${id}`, {
      theme: 'bubble',
      placeholder,
      readOnly,
      formats: ['bold', 'italic', 'link', 'blockquote', 'list', 'indent'],
      modules: {
        toolbar: [
          'bold',
          'italic',
          { list: 'ordered' },
          { list: 'bullet' },
          'blockquote',
          'link',
        ],
        keyboard: {
          bindings: {
            custom: {
              key: enterKey,
              handler: () => {
                onEnter && onEnter(getContents());
                return true;
              },
            },
          },
        },
      },
    });

    if (onChange) {
      quill.on('text-change', () => onChange(getContents()));
    }

    this.setState({ quill }, this.updateContent);
  }

  updateContent = () => {
    const { quill } = this.state;
    const { content } = this.props;
    const delta = getDelta(content);
    quill.setContents(delta);
  };

  render() {
    const { placeholder, className, readOnly, lastUpdate } = this.props;
    const { id, quill, lastLoad } = this.state;
    const quillElement = document.querySelector(`#${id} .ql-editor.ql-blank`);
    const hasUpdated = lastUpdate && lastUpdate > lastLoad;

    if (hasUpdated && quill) {
      this.updateContent();
      this.setState({ lastLoad: new Date() });
    }

    if (quillElement && placeholder) {
      quillElement.setAttribute('data-placeholder', placeholder);
    }

    if (readOnly && quill) {
      this.updateContent();
    }

    return <div id={id} className={classNames(styles.richText, className)} />;
  }
}

export default RichText;
