import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import { user } from './user';
import { account } from './account';
import { post } from './post';

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    user, account, post
  ]),
})
