export default defineNuxtPlugin(() => {
  const { initialize } = usePwa()
  void initialize()
})
