import {schema} from 'normalizr'

export const userSchema = new schema.Entity('user')

//notre data est flat alors on doit déclarer le schéma "non-flat" pour pouvoir "réassembler" (denormalize)


// Schemas for API responses.
export const Schemas = {
  USER: userSchema,
  USER_ARRAY: [userSchema]
}