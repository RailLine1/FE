import { useGet2 } from '@/api/10-커넥터/10-커넥터';

import { MyConnector } from '../courseTypes';

// GET /me/connector
export function useMyConnector() {
  return useGet2<MyConnector>();
}
