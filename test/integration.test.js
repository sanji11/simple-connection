'use strict';

const expect = require('chai').expect;

const DB = require('./../lib/db.js');

describe('Test integration with mongo db', () => {

  let db, collection;

  const CONFIG = {
    "server": "localhost",
    "port": 27017,
    "database_name": "mydb_test"
  };

  beforeEach(() => {
    db = new DB(CONFIG);
    collection = db.open('exampleCollection');
  });

  context('insert data', () => {
    it('expect create data', async () => {
      const ops = await collection('insertOne', { name: 'filipe silva' });
      expect(ops.result).to.be.a('object');
      expect(ops.result).to.have.property('ok');
      expect(ops.result.ok).to.be.equal(1);
    });

    it('expect multiple data', async () => {
      const ops = await collection('insertMany', [
        { name: 'filipe silva' },
        { name: 'filipe silva' },
        { name: 'filipe silva' },
        { name: 'filipe silva' }
      ]);

      expect(ops.result).to.be.a('object');
      expect(ops.result).to.have.property('ok');
      expect(ops.result).to.have.property('n');
      expect(ops.result.ok).to.be.equal(1);
      expect(ops.result.n).to.be.equal(4);
    });
  });

  context('read data', () => {

    it('expect find record', async () => {
      const result = await collection('find', { name: 'filipe silva' }, { limit: 0 });
      const ops = await result.toArray();
      expect(ops).to.be.a('array');
      expect(ops[0]).to.be.a('object');
      expect(ops[0]).to.have.a.property('_id');
      expect(ops[0]).to.have.a.property('name');
      expect(ops[0].name).to.equal('filipe silva');
    });

    it('expect findOne record', async () => {
      const ops = await collection('findOne', { name: 'filipe silva' }, { limit: 0 })
          
      expect(ops).to.be.a('object');
      expect(ops).to.have.a.property('_id');
      expect(ops).to.have.a.property('name');
      expect(ops.name).to.equal('filipe silva');
    });
  });

  context('update data', () => {
    it('expect update data', async () => {
      const ops = await collection('updateOne', 
        { name: 'filipe silva' }, 
        { $set: { name: 'filipe melo' } 
      })
                
      expect(ops).to.be.a('object');
      expect(ops).to.have.a.property('result');
      expect(ops.result).to.have.a.property('ok');
      expect(ops.result.ok).to.be.equal(1);
    });
  });

  context('delete data', () => {
    it('expect delete data', async () => {
      const ops = await collection('deleteOne', { name: 'filipe silva' })               
      expect(ops).to.be.a('object');
      expect(ops).to.have.a.property('result');
      expect(ops.result).to.have.a.property('ok');
      expect(ops.result.ok).to.be.equal(1);
    });
  });
  
  context('validate operations in another collection', () => {
    it('expect create data in other collection', async () => {
      const col = db.collection('new_collection');
      const ops = await col('insertOne', { name: 'verify' });
      expect(ops.result).to.be.a('object');
      expect(ops.result).to.have.property('ok');
      expect(ops.result.ok).to.be.equal(1);    
    });
    
    it('expect create data in two collections', async () => {
      const col = db.collection('new_collection');
      const col2 = db.collection('new_collection2');

      const ops = await col('insertOne', { name: 'verify' })
      const ops2 = await col2('insertOne', { name: 'verify' })
      
      expect(ops.result).to.be.a('object');
      expect(ops.result).to.have.property('ok');
      expect(ops.result.ok).to.be.equal(1);

      expect(ops2.result).to.be.a('object');
      expect(ops2.result).to.have.property('ok');
      expect(ops2.result.ok).to.be.equal(1);
    });
  });
});
