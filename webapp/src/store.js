import { init } from '@rematch/core'
import loadingPlugin from '@rematch/loading'

import * as models from './models'

export default init({
  models,
  redux: {
    rootReducers: {
      RESET_APP: () => {}
    }
  },
  plugins: [loadingPlugin()]
})
