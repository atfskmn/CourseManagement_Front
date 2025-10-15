import { defineBoot } from '#q-app/wrappers'
import { Notify, Loading } from 'quasar'

export default defineBoot(() => {
  Loading.setDefaults({ delay: 200 })
})

export { Notify, Loading }
