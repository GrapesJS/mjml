import { isComponentType } from './index.js';

export default (editor, { dc, coreMjmlModel, coreMjmlView }) => {
  const type = 'mj-carousel-image';

  dc.addType(type, {
    isComponent: isComponentType(type),

    model: {
      ...coreMjmlModel,
    },

    view: {
      ...coreMjmlView,
    },

    render() {
      return this;
    },
  });
};
