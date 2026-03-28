import { authHandlers } from './auth'
import { accountHandlers } from './account'
import { transactionHandlers } from './transactions'
import { transferHandlers } from './transfer'

export const handlers = [...authHandlers, ...accountHandlers, ...transactionHandlers, ...transferHandlers]
