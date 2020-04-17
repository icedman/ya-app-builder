// import config from 'config/config';

const config = {
  app: {
    id: 'my-app',
  },
};

class SimplePersist {
  constructor(storage, id) {
    this.storage = storage || window.localStorage;
    this.key = config.app.id + (id || '') || 'app-simple-storage';
    this.data = {};
    if (this.storage) {
      this.data = JSON.parse(this.storage.getItem(this.key, '{}')) || {};
    }
  }

  setItem(key, value) {
    this.data[key] = value;
    this.storage.setItem(this.key, JSON.stringify(this.data));
  }

  removeItem(key) {
    delete this.data[key];
    this.storage.removeItem(this.key);
  }
}

export class SimpleCache {
  constructor(storage, id) {
    this.persist = new SimplePersist(storage, id);
    this.cache = this.persist.data;
    this.expire();
  }

  put(key, data, opts) {
    let _data = {
      key: key,
      data: data,
      opts,
    };

    this.cache[key] = _data;
    if (opts) {
      if (opts.persist) {
        this.persist.setItem(key, _data);
      }
    }
  }

  get(key, defaultData) {
    if (!this.cache[key]) {
      return defaultData;
    }
    return this.cache[key].data || defaultData;
  }

  getCache() {
    return this.cache;
  }

  clear(key) {
    // todo clear perists
    if (key == null) {
      Object.keys(this.cache).forEach((k) => {
        this.persist.removeItem(k);
        delete this.cache[k];
      });
      return;
    }

    if (this.persist) {
      this.persist.removeItem(key);
    }
    delete this.cache[key];
    // console.log('removing..' + key);
  }

  expire() {}

  request(key, requestFunc, opts) {
    if (this.cache[key] && this.cache[key].data) {
      return Promise.resolve(this.cache[key].data);
    }
    return requestFunc().then((res) => {
      if (!res) {
        return Promise.resolve(null);
      }
      this.put(key, res.data, opts);
      return Promise.resolve(res.data);
    });
  }
}

const cache = new SimpleCache(window.localStorage);
export const session = new SimpleCache(window.sessionStorage);
export default cache;

window.$cx = cache;
