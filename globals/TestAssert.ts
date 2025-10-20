import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts'
import { assertExists } from 'https://deno.land/std@0.201.0/assert/assert_exists.ts'

type PayloadType = 'success-payload' | 'error-payload';

export function defaultAssert(received : any, payload : PayloadType, expected: {message : string, code : number, status : string}){
  assertEquals(received.message, expected.message,`
    Mensagem recebida (received): "${received.message}"
    Mensagem esperada (expected): "${expected.message}"
  `);
  assertEquals(received.status, expected.status,`
    Status recebido: "${received.status}"
    Status esperado: "${expected.status}"
  `);

  assertEquals(received.code, expected.code,`
    Código HTTP recebido: ${received.code}
    Código HTTP esperado: ${expected.code}
  `);

  // assertEquals(received.success, expected.success,`
  //   Success recebido: ${received.success}
  //   Success esperado: ${expected.success}
  // `);

  switch (payload) {
    case 'success-payload':
      assertExists(received.data, `
        A resposta deve conter o objeto 'data'`);
      break;
    case 'error-payload':
      assertExists(received.errors, `
        A resposta deve conter o objeto 'errors'`);
      break;
  }
}