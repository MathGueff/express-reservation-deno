import { assertEquals } from 'https://deno.land/std@0.201.0/assert/assert_equals.ts'
import { assertExists } from 'https://deno.land/std@0.201.0/assert/assert_exists.ts'

export enum PayloadType {
  'successPayload' = "successPayload", 
  'errorPayload' = "errorPayload"
}

export interface IResponse  {
  message : string,
  code : number,
  status : string
  data ?: any
  errors ?: string[]
}

export function defaultAssert(received: IResponse, payloadType: PayloadType, expected: IResponse) {
  assertEquals(
    received.message,
    expected.message,
    `
    Mensagem recebida (received): "${received.message}"
    Mensagem esperada (expected): "${expected.message}"
  `,
  )
  assertEquals(
    received.status,
    expected.status,
    `
    Status recebido: "${received.status}"
    Status esperado: "${expected.status}"
  `,
  )

  assertEquals(
    received.code,
    expected.code,
    `
    Código HTTP recebido: ${received.code}
    Código HTTP esperado: ${expected.code}
  `,
  )

  switch (payloadType) {
    case PayloadType.successPayload:
      assertExists(
        received.data,
        `
        A resposta deve conter o objeto 'data'`,
      )
      if(expected.data)
        assertEquals(JSON.stringify(received.data), JSON.stringify(expected.data))
      break
    case PayloadType.errorPayload:
      assertExists(
        received.errors,
        `
        A resposta deve conter o objeto 'errors'`,
      )
      break
  }
}
