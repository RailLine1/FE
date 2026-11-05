import { MyConnector } from '../courseTypes';
import { dummyConnector } from '../dummy/courseDetails';

// import { useGet2 } from '@/api/10-커넥터/10-커넥터';

// GET /me/connector
export function useMyConnector() {
  // API 연동 시 아래 return으로 교체
  // return useGet2<MyConnector>();

  const data: MyConnector = dummyConnector;
  return { data, isLoading: false, isError: false };
}
