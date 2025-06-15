export default defineEventHandler(async () => {
  return {
    access_token: 'dummy_access_token_' + Math.random().toString(36).slice(2)
  }
})
