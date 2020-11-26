import Block from './Block/Block';

export default (query: string, block: Block): HTMLElement => {
  const root = document.querySelector(query);
  const RootBlock = block.getContent();
  if (root && RootBlock instanceof HTMLElement) {
    root.appendChild(RootBlock);
  }
  // root.appendChild(block);
  return <HTMLElement>root;
};
