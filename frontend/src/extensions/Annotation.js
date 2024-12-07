import { Mark } from '@tiptap/core';

export default Mark.create({
  name: 'annotation',

  addAttributes() {
    return {
      text: {
        default: '',
        parseHTML: element => element.getAttribute('data-annotation') || '',
        renderHTML: attributes => {
          if (!attributes.text) return {};
          return {
            'data-annotation': attributes.text,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-annotation]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', { 
      ...HTMLAttributes, 
      class: 'annotation' 
    }, 0];
  },

  addCommands() {
    return {
      setAnnotation: attributes => ({ commands }) => {
        return commands.setMark('annotation', attributes);
      },
      toggleAnnotation: attributes => ({ commands }) => {
        return commands.toggleMark('annotation', attributes);
      },
      unsetAnnotation: () => ({ commands }) => {
        return commands.unsetMark('annotation');
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-k': () => this.editor.commands.toggleAnnotation({ text: 'Anotación' }),
    };
  },
});
