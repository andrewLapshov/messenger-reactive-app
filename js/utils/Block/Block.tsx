import EventBus from '../event-bus';
import debounce from '../debounce';
import { createElement, IProps } from '../createElement';

interface Meta {
  tagName: string;
  props: IProps;
}

export default class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  protected _element: HTMLElement | null = null;
  protected _meta: Meta | null = null;
  eventBus: () => EventBus;
  props: IProps;
  protected _CDUDebounced;

  constructor(props: IProps = {}, tagName: string = 'div') {
    const eventBus = new EventBus();
    this._meta = {
      tagName,
      props,
    };

    this.eventBus = () => eventBus;
    this.props = this._makePropsProxy(props);

    this._CDUDebounced = debounce(this._componentDidUpdate.bind(this), 50);

    this._registerEvents(eventBus);

    eventBus.emit(Block.EVENTS.INIT);
  }

  _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._CDUDebounced.bind(this));
    // eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
  }

  _createResources(): void {
    if (this._meta) {
      const { tagName } = this._meta;
      this._element = this._createDocumentElement(tagName);
    }
  }

  _createDocumentElement(tagName: string): HTMLElement {
    // Можно сделать метод, который через фрагменты в цикле создает сразу несколько блоков
    return document.createElement(tagName);
  }

  init(): void {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  _componentDidMount(): void {
    this.componentDidMount();
  }

  componentDidMount(oldProps?: IProps): void {}

  _componentDidUpdate(oldProps?: IProps, newProps?: IProps): void {
    // const response = this.componentDidUpdate(oldProps, newProps);
    // if (!response) {
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    // }
    this.componentDidUpdate(oldProps, newProps);
  }

  componentDidUpdate(oldProps?: IProps, newProps?: IProps): void {
    // return oldProps !== newProps;
  }

  setProps = (nextProps: IProps | null): void => {
    if (!nextProps) {
      return;
    }
    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

  _render(): void {
    const renderedBlock = this.render();
    while (this._element && this._element.firstElementChild) {
      this._element.removeChild(this._element.firstElementChild);
    }
    if (this._element && renderedBlock instanceof HTMLElement) {
      this._element.append(renderedBlock);
    }
    // console.log(elem.firstElementChild);
    // console.log(this._element.firstElementChild);
  }

  render(): JSX.Element {
    return <div>Nothing to render</div>;
  }

  getContent() {
    return this.element;
  }

  _makePropsProxy(props: IProps) {
    const self = this;

    return new Proxy(props, {
      set(target, prop, value) {
        if (typeof prop === 'string' || typeof prop === 'number') {
          target[prop] = value;
          self.eventBus().emit(Block.EVENTS.FLOW_CDU, target[prop], value);
          return true;
        }
        return false;
      },
      deleteProperty() {
        throw new Error('Отказано в доступе');
      },
    });
  }

  show() {
    if (this._element) {
      this._element.style.display = 'block';
    }
  }

  hide() {
    if (this._element) {
      this._element.remove();
    }
  }
}
