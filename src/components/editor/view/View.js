export default {
  contained: {
    attributes: {
      className: {
        type: 'string',
      },
      flex: {
        type: 'select',
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
    },
  },
  container: {
    typeof: ['contained'],
    categories: [],
    attributes: {
      orientation: {
        type: 'select',
        options: [
          {
            value: 'horizontal',
            label: 'horizontal',
          },
          {
            value: 'vertical',
            label: 'vertical',
          },
        ],
      },
    },
    children: {
      types: ['container'],
    },
    preview: 'Container',
  },
  view: {
    children: {
      types: ['container'],
    },
    typeof: ['container', 'contained'],
    preview: 'Container',
  },
};
