const { recaptchaConfig } = require('../config')

const {
  RecaptchaEnterpriseServiceClient
} = require('@google-cloud/recaptcha-enterprise')

const isRecaptchaTokenValid = async (token) => {
  const reCaptchaClient = new RecaptchaEnterpriseServiceClient()

  const [assessment] = await reCaptchaClient.createAssessment({
    parent: reCaptchaClient.projectPath(recaptchaConfig.projectId),
    assessment: {
      event: {
        token,
        siteKey: recaptchaConfig.siteKey
      }
    }
  })

  return assessment.tokenProperties.valid
}

module.exports = {
  isRecaptchaTokenValid
}
