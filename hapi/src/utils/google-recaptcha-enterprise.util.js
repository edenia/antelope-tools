const {
  RecaptchaEnterpriseServiceClient
} = require('@google-cloud/recaptcha-enterprise')

const isRecaptchaTokenValid = async token => {
  const reCaptchaClient = new RecaptchaEnterpriseServiceClient()

  const [assessment] = await reCaptchaClient.createAssessment({
    parent: reCaptchaClient.projectPath('eosio-dashboard'),
    assessment: {
      event: {
        token: token,
        siteKey: '6LfiHUwfAAAAAEKanm2t2roRSPxmhP5-LPUBU_wG'
      }
    }
  })

  return assessment.tokenProperties.valid
}

module.exports = {
  isRecaptchaTokenValid
}
