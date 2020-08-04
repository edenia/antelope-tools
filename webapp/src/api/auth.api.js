export default {
  login: async (email, password) => {
    if (email !== 'admin@eoscostarica.io' || password !== 'admin') {
      throw new Error('Invalid email or password')
    }

    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 1500)
    )

    return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJlb3Njb3N0YXJpY2EuaW8iLCJpYXQiOjE1ODczNjQzMzcsImV4cCI6MTYxODkwMDMzNywiYXVkIjoiZW9zY29zdGFyaWNhLmlvIiwic3ViIjoiMSIsIm5hbWUiOiJhZG1pbiIsImhlYWRsaW5lIjoiZW9zY29zdGFyaWNhLmlvIiwicHJvZmlsZVBpY3R1cmUiOiJodHRwczovL3JhbmRvbXVzZXIubWUvYXBpL3BvcnRyYWl0cy93b21lbi82MC5qcGciLCJlbWFpbCI6ImFkbWluQCBlb3Njb3N0YXJpY2EuaW8ifQ.oXZcY72VDx0WNBYL-gh5duyxNRXqwsz0vTR-qI4-kgk'
  }
}
