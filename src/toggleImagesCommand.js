export default () => {
  const toggleImages = (components, on) => {
    const srcPlh = '##';

    components.each((component) => {
      if (component.get('type') === 'image') {
        const source = component.get('src');

        if (on) {
          if (source === srcPlh) {
            component.set('src', component.get('src_bkp'));
          }
        } else if (source !== srcPlh) {
          component.set('src_bkp', component.get('src'));
          component.set('src', srcPlh);
        }
      }

      toggleImages(component.get('components'), on);
    });
  };

  return {
    run(editor) {
      const components = editor.getComponents();
      toggleImages(components);
    },
    stop(editor) {
      const components = editor.getComponents();
      toggleImages(components, 1);
    },
  };
};