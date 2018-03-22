import register from './rpc-server';
import * as procedures from './procedures';
import * as simulator from './sodexo-simulator';

register(procedures);
register(simulator);
