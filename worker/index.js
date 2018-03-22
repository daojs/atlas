import register from './rpc-server';
import * as procedures from './procedures';
import * as simulator from './sodexo-simulator';
import * as analysis from './analysis';

register(procedures);
register(simulator);
register(analysis);
