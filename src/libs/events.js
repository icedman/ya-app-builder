import EventEmitter from 'events';

const emitter = new EventEmitter();
emitter.setMaxListeners(200);

const broadcaster = {
  $on: function (evt, func) {
    emitter.on(evt, func);
  },

  $off: function (evt, func) {
    emitter.off(evt, func);
  },

  $emit: function (evt, params) {
    emitter.emit(evt, params);
  },

  register: function (def) {
    Object.keys(def).forEach((k) => {
      broadcaster.$on(k, def[k]);
    });
  },

  unregister: function (def) {
    Object.keys(def).forEach((k) => {
      broadcaster.$off(k, def[k]);
    });
  },
};

export default broadcaster;
