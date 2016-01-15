/**
 * Mongoose archive plugin
 * @license MIT
 * @author 0@39.yt (Yurij Mikhalevich)
 * @module 'mongoose-archive'
 */

/**
 * @param {Mongoose.Schema} schema
 */
export default function (schema) {
  schema.add({ archivedAt: Date });

  schema.methods.archive = function (cb) {
    this.archivedAt = new Date();
    this.save(cb);
  };

  schema.methods.restore = function (cb) {
    this.archivedAt = undefined;
    this.save(cb);
  };

  ['find', 'findOne', 'findOneAndRemove', 'findOneAndUpdate'].forEach(method => {
    schema.pre(method, function () {
      if (!this.getQuery().archivedAt) this.where('archivedAt').exists(false);
    });
  });
}
