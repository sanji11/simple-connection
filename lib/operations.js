'use strict';

const Collections = require('./collections');

class Operations extends Collections {

  constructor(collectionName, connect, config) {
    super(connect, config);
    this.collection = this.use(collectionName);
    return this.operation.bind(this);
  }

  operation() {
    if (!arguments.length) {
      throw new Error(`No arguments found to your operation:
      Your call must be like following arguments
        operation('find', { your: 'search' })
      `);
    }

    const operationType = arguments[0];
    const params = Array.from(arguments).filter((item, i) => i !== 0);

    return this.collection
      .then(col => col[operationType].apply(col, params));
  }
}

module.exports = Operations;
