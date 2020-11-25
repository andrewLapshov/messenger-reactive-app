// function listener(event) {
//   return this[event.type](event);
// }

import { AnyFunc } from './event-bus';

export interface IProps {
  [key: string]: any;
}

const appendChild = (parent: HTMLElement, child: HTMLElement | HTMLElement[] | string): void => {
  if (Array.isArray(child)) {
    child.forEach(nestedChild => appendChild(parent, nestedChild));
  } else if (typeof child === 'string') {
    parent.appendChild(document.createTextNode(child));
  } else if (child?.nodeType) {
    parent.appendChild(child);
  }
};

export const createElement = (tag: string | AnyFunc, props: IProps, ...children: [HTMLElement | string]) => {
  if (typeof tag === 'function') {
    // @ts-ignore
    const element = new tag({ ...props, children });
    return element.getContent();
    // return tag(props, ...children);
  }

  const node = document.createElement(tag);

  Object.entries(props || {}).forEach(([key, value]) => {
    if (key.startsWith('on') && key.toLowerCase() in window && typeof value === 'function') {
      const eventType = key.toLowerCase().substr(2);

      node.addEventListener(eventType, value);
    } else {
      if (key === 'className') key = 'class';
      if (value !== false) {
        node.setAttribute(key, value.toString());
      }
    }
  });

  children.forEach(child => appendChild(node, child));

  return node;
};

// renderDOM(".root", new Login());
// renderDOM(".root", new Button({ text: "123" }));
// renderDOM(".root", <Button name={"123"} />);

// class TextItem extends Block {
//   constructor(props, tagName = "p") {
//     super({ ...props, ownText: "THIS" }, tagName);
//   }
//
//   componentDidMount(oldProps) {
//     setTimeout(() => this.setProps({ ownText: "UP" }), 2000);
//   }
//
//   render() {
//     return <p>{`${this.props.text} ${this.props.ownText}`}</p>;
//   }
// }
//
// class Button extends Block {
//   constructor(props, tagName) {
//     super(props, tagName);
//   }
//
//   // componentDidMount(oldProps) {
//   //   setTimeout(() => this.setProps({ text: "PUSH" }), 2000);
//   // }
//
//   render() {
//     return (
//       <button>
//         <TextItem text={this.props.text} />
//       </button>
//     );
//   }
// }
