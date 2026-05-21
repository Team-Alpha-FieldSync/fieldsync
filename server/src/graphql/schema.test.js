import { parse } from 'graphql';
import typeDefs from './schema.js';

try{
    parse(typeDefs);
    console.log('Schema is syntactically valid');
}catch (err){
    console.log('Schema error:', err.message);
}