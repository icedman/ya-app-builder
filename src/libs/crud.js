import $http from './http';
import config from 'config/config';

class CrudModel {
  constructor(model) {
    this.config = config;
    this.model = model;
    this.signal = $http.CancelToken.source();
  }

  findOne(id) {
    return $http({
      method: 'get',
      url: this.config.app.server.url + `/${this.model}/${id}`,
      cancelToken: this.signal.token,
    })
      .then((res) => {
        // console.log(res)
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  save(doc) {
    let method = doc._id ? 'put' : 'post';
    let path = [this.config.app.server.url, this.model];
    if (doc._id) {
      path.push(doc._id);
    }
    let url = path.join('/');
    return $http({
      method: method,
      url: url,
      data: doc,
      cancelToken: this.signal.token,
    })
      .then((res) => {
        console.log(res.data);
        if (!res.data._id) {
          return Promise.reject(res);
        }
        return Promise.resolve(res);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  erase(id) {
    return $http({
      method: 'delete',
      url: this.config.app.server.url + `/${this.model}/${id}`,
      cancelToken: this.signal.token,
    })
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  find(params = {}) {
    const query = params;
    query._limit = query._limit || 50;
    query._skip = query._skip || 0;

    if (query._page) {
      query._skip = query._page * query._limit;
      delete query._page;
    }

    // let keyword = params.value
    // let m = /[A-Z]-([0-9]*)-[0-9]{1,2}/.exec(keyword)
    // if (m && m[1]) {
    //   keyword = m[1]
    // }
    // if (params.match) {
    //   var keys = Object.keys(params.match) || []
    //   keys.forEach(f => {
    //     query[f] = params.match[f]
    //   })
    // }

    console.log(query);

    return $http
      .get(this.config.app.server.url + `/${this.model}`, {
        params: query,
        cancelToken: this.signal.token,
      })
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  cancel(reason) {
    this.signal.cancel(reason);
  }

  request(doc, opt) {
    console.log(doc);

    opt = opt || {};
    let method = opt.method || 'get';
    let path = [this.config.app.server.url, this.model];
    if (opt.action) {
      path.push(opt.action);
    }
    if (doc._id) {
      path.push(doc._id);
    }
    let url = path.join('/');
    return $http({
      method: method,
      url: url,
      data: doc,
      cancelToken: this.signal.token,
    })
      .then((res) => {
        console.log(res.data);
        return Promise.resolve(res);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
}

export default function crud(model) {
  return new CrudModel(model);
}
