import { useTranslation } from 'react-i18next'

import { useSharedState } from '../../context/state.context'
import { useSnackbarMessageState } from '../../context/snackbar-message.context'
import { generalConfig } from '../../config'

const useAlertTranslationState = () => {
  const [{ translationinProgress }, { updateTranslationAlertsState }] =
    useSharedState()
  const [, { showMessage }] = useSnackbarMessageState()
  const { t } = useTranslation('')

  const showAlertMessage = (language, ignoreStatus = false) => {
    if (!generalConfig.languagesInProgress.includes(language)) return
    if (!ignoreStatus && translationinProgress?.isAlertShown[language]) return

    showMessage({
      type: 'info',
      content: t('translationInProgress'),
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      }
    })
    updateTranslationAlertsState(language)
  }

  return [{}, { showAlertMessage }]
}

export default useAlertTranslationState
