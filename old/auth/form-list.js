import Block from '../../block.js';
import { formListTmpl } from './auth.tmpl.js';
import compile from '../compile.js';

export default class FormList extends Block {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.list.map(item => compile(formListTmpl, item)).join('\n\t');
  }
}
