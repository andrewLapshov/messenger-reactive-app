import renderDOM from '../renderDOM';
import Block from '../Block/Block';
import { IProps } from '../createElement';

function isEqual(lhs: string, rhs: string): boolean {
  return lhs === rhs;
}

export type BlockType = new (props?: IProps, tagName?: string) => Block;

export default class Route {
  private _pathname: string;
  private readonly _blockClass: BlockType;
  private _block: Block | null;
  private _props: IProps;

  constructor(pathname: string, view: BlockType, props: IProps) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave(): void {
    if (this._block) {
      this._block.hide();
      this._block = null;
    }
  }

  match(pathname: string): boolean {
    return isEqual(pathname, this._pathname);
  }

  render(): void {
    if (!this._block) {
      this._block = new this._blockClass();
      renderDOM(this._props.rootQuery, this._block);
      return;
    }
  }
}
