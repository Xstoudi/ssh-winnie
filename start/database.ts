import { types } from 'pg'
const { setTypeParser, builtins } = types

setTypeParser(builtins.INT8, BigInt)
