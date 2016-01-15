# mongoose-archive

[![NPM](https://nodei.co/npm/mongoose-archive.png?downloads=true)](https://nodei.co/npm/mongoose-archive/)

[Mongoose](http://mongoosejs.com/) archive plugin.

Yet another softdelete plugin, but with this one you will not be querying archived
documents by default.


## Description

Creates `archivedAt` property with timestamp of the moment when
document was archived.

Adds `archive(callback)` and `restore(callback)` methods.

Also patches `find`, `findOne`, `findOneAndRemove` and `findOneAndUpdate` methods
to add `{ archivedAt: { $exists: false } }` to the query object in case condition
for `archivedAt` wasn't specified.


## Setup

Install

```bash
npm install mongoose-archive
```

## Usage

Just require and register plugin for a desired Schema.

```javascript
import mongooseArchive from 'mongoose-archive';

Model.plugin(mongooseArchive);
```

After, you can call `archive` and `restore` methods on your Model instances.

```javascript
instance.archive();
// instance will not be queriable with Model.find(), unless you will be querying
// archived documents by specifying proper archivedAt filter
instance.restore();
// now the document was "restored" from archive
```
