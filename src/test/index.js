/**
 * Mongoose archive plugin test
 * @license MIT
 * @author 0@39.yt (Yurij Mikhalevich)
 * @module 'mongoose-archive-test'
 */

import assert from 'assert';
import mongoose, { Schema } from 'mongoose';
import Promise from 'bluebird';
import mongooseArchive from '../index';

describe('mongooseArchive', function () {
  mongoose.connect('mongodb://localhost/mongoose-archive-test');

  const TestDocumentSchema = new Schema({
    fieldA: {
      type: String,
      default: 'Hello, AutoLotto!'
    },
    fieldB: {
      type: Number,
      default: 1337
    }
  });

  TestDocumentSchema.plugin(mongooseArchive);

  const TestDocument = mongoose.model('test-document', TestDocumentSchema);
  Promise.promisifyAll(TestDocument);
  Promise.promisifyAll(TestDocument.prototype);

  const test1 = new TestDocument();
  const testDocs = [test1, new TestDocument(), new TestDocument()];

  before(async () => {
    for (let i = 0; i < testDocs.length; ++i) {
      await testDocs[i].saveAsync();
    }
  });

  after(async () => {
    for (let i = 0; i < testDocs.length; ++i) {
      await testDocs[i].removeAsync();
    }
  });

  it('should be possible to archive a document', async () => {
    await test1.archiveAsync();
    assert.notStrictEqual(test1.archivedAt, undefined);
  });

  it(`shouldn't appear in empty find query results after archiving`, async () => {
    assert.notStrictEqual(test1.archivedAt, undefined, `document 'test1' should be archived`);
    const docs = await TestDocument.findAsync();
    assert.equal(docs.length, 2);
  });

  it(`should be possible to query archived document by specifying archivedAt filter`, async () => {
    assert.notStrictEqual(test1.archivedAt, undefined, `document 'test1' should be archived`);
    const docs = await TestDocument.findAsync({ archivedAt: { $exists: true } });
    assert.equal(docs.length, 1);
    const doc = await TestDocument.findOneAsync({ archivedAt: { $exists: true } });
    assert.deepEqual(docs[0].toObject(), doc.toObject());
    assert.deepEqual(doc.toObject(), test1.toObject());
  });

  it('should be possible to restore a document', async () => {
    await test1.restoreAsync();
    assert.strictEqual(test1.archivedAt, undefined);
  });

  it('should appear in empty find query results after restoring', async () => {
    assert.strictEqual(test1.archivedAt, undefined, `document 'test1' should be restored`);
    const docs = await TestDocument.findAsync();
    assert.equal(docs.length, 3);
  });
});
