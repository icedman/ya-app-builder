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
};

export default broadcaster;
